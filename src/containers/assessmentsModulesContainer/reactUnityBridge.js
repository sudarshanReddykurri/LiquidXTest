// https://medium.com/@subwaymatch/disabling-back-button-in-react-with-react-router-v5-34bb316c99d7
import React, { Component, Fragment } from "react";
import Unity, { UnityContent } from "react-unity-webgl";
import { GameConfigModules } from "./gameConfig.js";
import {
  AppBar,
  Button,
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  Toolbar,
  Typography,
  makeStyles,
  Link,
  Slide,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withStyles
} from "@material-ui/core";
import Modal from "react-bootstrap/Modal";
import { CircleToBlockLoading } from "react-loadingg";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import apiCall from "../../services/apiCalls/apiService";
import "./reactUnityStyles.css";
import FullScreenButton from "../../components/FullScreenButton";

const styles = theme => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  boxRoot: {
    //padding: theme.spacing(3, 2),
    //height: 200,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center"
  }
});

let game_index = "";
let videoRef = null;
let captured_img_src = null;
let imageCaptureInterval = 15000; // in ms

const WIDTH = 400;
const HEIGHT = 400;

let videoConstraints = {
  width: WIDTH,
  height: HEIGHT,
  facingMode: "user"
};
class ReactUnityBridge extends Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
    this.state = {
      showUnity: false,
      startVideo: false,
      faceStatus: "Initializing camera. Please wait.."
    };
    this.isModelsLoaded = false;
    this.fullScreenRef = null;
    const { user } = this.props.rootTree;
    console.log(
      "TCL: ReactUnityBridge -> constructor -> this.props.rootTree",
      this.props.rootTree
    );
    game_index = user.currentAssessment.current_game;
   // game_index = "mob-05";
    //this.OnDimensionChange = this.updateDimensions.bind(this);
    //game_index = "mob-11";
    if (game_index !== "") {
      this.state = {
        progression: 0,
        openLoading: true
      };

      this.unityContent = new UnityContent(
        GameConfigModules[game_index].jsonPath,
        GameConfigModules[game_index].unityLoaderPath
      );

      this.unityContent.on("sendDataToNativeJS", jsonData => {
        // console.log("Data From Unity");
        let dataFromUnity = JSON.parse(jsonData);
        console.log(
          "TCL: ReactUnityBridge -> constructor -> parsedData",
          dataFromUnity
        );

        if (dataFromUnity.data_label === "cameradata") {
          // let parsedJsonDataUnity = JSON.parse(dataFromUnity.json_data);
          // let cameraData = {
          //   playerid: user.userId,
          //   game_name: game_index,
          //   timestamp: dataFromUnity.time_stamp,
          //   encoded_image: parsedJsonDataUnity.ImageData
          // };
          // apiCall
          //   .imageDataUpload(JSON.stringify(cameraData))
          //   .then(res => {
          //     console.log("TCL: App -> componentDidMount -> rsp", res);
          //     if (res.status === 200) {
          //       console.log("camera data successfully uploaded");
          //     }
          //   })
          //   .catch(err => {
          //     console.log("TCL: App -> componentDidMount -> err", err);
          //     console.log(err.response);
          //     // const { status, data } = err.response;
          //   });
        } else if (
          dataFromUnity.data_label === "gamedata" ||
          dataFromUnity.data_label === "pausedata"
        ) {
          if (dataFromUnity.data_label === "gamedata") {
            this.clearAllTimers();
            this.setState({
              startVideo: false
            });
          }
          let gameData = {
            name: game_index,
            data: dataFromUnity.json_data
          };
          apiCall
            .gameDataUpload(JSON.stringify(gameData))
            .then(res => {
              if (res.status === 200) {
                console.log("game or pause data successfully uploaded");
              }
            })
            .catch(err => {
              console.log("TCL: App -> componentDidMount -> err", err);
              console.log(err.response);
            });
        } else if (dataFromUnity.data_label === "quit") {
          // Called when back or home is pressed in the game
          this.clearAllTimers();
          this.setState({
            startVideo: false
          });
          user.currentAssessment.update_current_game("");
          this.props.history.goBack();

          // console.log(
          //   "TCL: ReactUnityBridge -> constructor -> this.props.history.entries",
          //   this.props.history
          // );
          // this.props.history.entries = [];

          // // history.push() auto increments from the current index
          // this.props.history.index = -1;
          //this.props.history.push("/login");
        } else if (dataFromUnity.data_label === "next") {
          // Called when proceed button is pressed in the game
          this.clearAllTimers();
          this.setState({
            startVideo: false
          });
          user.currentAssessment.add_to_complete_games(game_index);
          user.currentAssessment.remove_from_games_to_play(game_index);
          user.currentAssessment.update_current_game("");
          this.props.history.goBack();
        }
      });

      this.unityContent.on("loaded", () => {
        this.setState({ openLoading: false });
        //setOpen(false);
        console.log("Yay! Unity is loaded!");
        //console.log("JsonData" + GameConfig[0].gameName);
        var canvas = document.getElementById("#canvas");
        if (canvas != null) {
          var width = canvas.width;
          var height = canvas.height;
          setTimeout(function() {
            canvas.width = GameConfigModules[game_index].width;
            canvas.height = GameConfigModules[game_index].height;
            var resolution = width + "x" + height;
            console.log("resolution unity:" + resolution);
          }, 250);
        } else {
          console.log("resolution unity canvas not found");
        }

        this.unityContent.send(
          GameConfigModules[game_index].gameObjectToCall,
          "setPlayerID",
          user.userId
        );
      });
      this.unityContent.on("progress", progression => {
        // Now we can use the progression to for example
        // display it on our React app.

        this.setState({
          progression: progression
        });
      });
    } else {
      console.log("Game Not Found");
    }
  }

  clearAllTimers = () => {
    if (this.imageCaptureTimer) {
      clearInterval(this.imageCaptureTimer);
    }
    if (this.webCameraFaceDetectionInterval) {
      clearInterval(this.webCameraFaceDetectionInterval);
    }
  };

  componentDidMount = async () => {
    const { history } = this.props;

    //window.addEventListener("resize", this.OnDimensionChange);
    // Hey, a popstate event happened!
    window.addEventListener("popstate", () => {
      //history.go(1);
     // window.location.reload();
     this.setState({
       startVideo: false
     })
    });

    // Check game_index if not empty then only render unity
    if (game_index !== "") {
      this.setState(
        {
          showUnity: true
        },
        () => {
          // if (this.fullScreenRef) {
          //   this.fullScreenRef.handleToggle();
          // }
        }
      );

      // Loading Face Detection Model
      const MODEL_URL = process.env.PUBLIC_URL + "/models";
      await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
      setTimeout(() => {
        this.isModelsLoaded = true;
        this.checkModelsLoaded();
      }, 500);
    }
  };

  checkModelsLoaded = () => {
    if (this.isModelsLoaded) {
      console.log("Models loaded successfully");
      this.setInputDevice();
      this.setState(
        {
          startVideo: true
        },
        () => {
          videoRef = this.webcam.current.video;
          console.log("this.webcam", videoRef);
          videoRef.addEventListener("play", () => {
            console.log("on webcam video play");
            const displaySize = {
              width: videoRef.width,
              height: videoRef.height
            };
            this.startCapture();
            this.webCameraFaceDetectionInterval = setInterval(async () => {
              const detections = await faceapi.detectAllFaces(
                videoRef,
                new faceapi.TinyFaceDetectorOptions()
              );
              //.withFaceLandmarks();
              // .withFaceExpressions();
              console.log("detections", detections);
              if (detections.length === 1) {
                console.log("One face found");
                this.setState({
                  faceStatus: "One face found"
                });
                //this.capture();
              } else if (detections.length > 1) {
                console.log("More than one face found");
                this.setState({
                  faceStatus: "More than one face found"
                });
              } else {
                console.log("Face not found");
                this.setState({
                  faceStatus: "Face not found"
                });
              }
            }, 1000);
          });
        }
      );
    } else {
      console.log("Models are not loaded");
      setTimeout(() => {
        this.checkModelsLoaded();
      }, 2000);
    }
  };

  setInputDevice = () => {
    navigator.mediaDevices.enumerateDevices().then(async devices => {
      let inputDevice = await devices.filter(
        device => device.kind === "videoinput"
      );
      console.log("inputDevice", inputDevice);
    });
  };

  startCapture = () => {
    this.imageCaptureTimer = setInterval(() => {
      this.capture();
    }, imageCaptureInterval);
  };

  capture = async () => {
    if (!!this.webcam.current) {
      if(this.state.faceStatus === "One face found")
      {
        // One face found
      }else{
        // Not one face
      }
      captured_img_src = await this.webcam.current.getScreenshot();
      console.log("captured_img_src", captured_img_src);
      let temp_captured_src = captured_img_src.split(",");
      console.log("temp_captured_src", temp_captured_src[0]);
      console.log("temp_captured_src", temp_captured_src[1]);
      const { user } = this.props.rootTree;
      let cameraData = {
        playerid: user.userId,
        game_name: game_index,
        timestamp: new Date().getTime().toString(),
        encoded_image: temp_captured_src[1].toString()
      };
      apiCall
        .imageDataUpload(JSON.stringify(cameraData))
        .then(res => {
          console.log("TCL: App -> componentDidMount -> rsp", res);
          if (res.status === 200) {
            console.log("camera data successfully uploaded");
          }
        })
        .catch(err => {
          console.log("TCL: App -> componentDidMount -> err", err);
          console.log(err.response);
          // const { status, data } = err.response;
        });
    }
  };

  componentWillUnmount() {
    this.fullScreenRef = null;
    this.clearAllTimers();
    //window.removeEventListener("resize", this.OnDimensionChange);
  }

  updateDimensions() {
    console.log(
      "TCL: ReactUnityBridge -> updateDimensions -> window.innerWidth",
      window.innerWidth
    );
    // if(window.innerWidth < 500) {
    //   this.setState({ width: 450, height: 102 });
    // } else {
    //   let update_width  = window.innerWidth-100;
    //   let update_height = Math.round(update_width/4.4);
    //   this.setState({ width: update_width, height: update_height });
    // }
  }

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        {this.state.showUnity ? (
          <div className="App">
            {/* <FullScreenButton ref={ref => (this.fullScreenRef = ref)} /> */}
            <div
              //className="gameContainer"
              style={{
                backgroundColor: "#fff"
              }}
            >
              {this.state.faceStatus && (
                <Typography>
                  <b>FaceDetection:</b> {this.state.faceStatus}
                </Typography>
              )}
              {this.state.startVideo && (
                <Webcam
                  audio={false}
                  width={WIDTH}
                  height={HEIGHT}
                  ref={this.webcam}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                />
              )}
              <Unity
                unityContent={this.unityContent}
                width="100%"
                height="100%"
                ref={ref => (this.unityRef = ref)}
              />
            </div>
            {/* <Unity unityContent={this.unityContent} /> */}
            <Dialog
              fullScreen
              open={this.state.openLoading}
              onClose={this.handleClose}
            >
              {/* <DialogTitle
            id="form-dialog-title"
            style={{ textAlign: "center", backgroundColor: "transparent" }}
          >
           
          </DialogTitle> */}
              <DialogContent>
                <CircleToBlockLoading size="small"></CircleToBlockLoading>
                <Box align="center">
                  <Typography> Loading game..</Typography>
                </Box>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <Grid
            container
            spacing={0}
            align="center"
            justify="center"
            direction="column"
            style={{ marginTop: "20%" }}
          >
            <Grid item>
              <h4>404 Game Not Found!!</h4>
              <p>Please go back and select the game</p>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  this.props.history.goBack();
                }}
              >
                Go Back
              </Button>
              <p>
                <i>
                  Don't reload the page and don't use browser controls to
                  navigate
                </i>
              </p>

              {/* <i>
                <p>
                  Note the styling of body, html and #root in index.css for this
                  to work.
                </p>
                <p>
                  Thanks to{" "}
                  <a href="https://codesandbox.io/s/gLE85V2D">STUNAZ</a> for
                  improving upon my original!
                </p>
              </i> */}
            </Grid>
          </Grid>
        )}
      </Fragment>
    );
  }
}

export default withRouter(
  withStyles(styles)(inject("rootTree")(observer(ReactUnityBridge)))
);
