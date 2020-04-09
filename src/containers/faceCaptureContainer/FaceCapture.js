// https://github.com/supachaic/react-face-recognition/blob/master/src/views/VideoInput.js
import React, { Component, Fragment } from "react";
import AssessmentCard from "../../components/assessmentCard";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  withStyles,
  Typography,
  LinearProgress,
} from "@material-ui/core";
import NavBar from "../../shared/NavBar";
import Webcam from "react-webcam";
import { inject, observer } from "mobx-react";
import apiCall from "../../services/apiCalls/apiService";
import authService from "../../services/auth/authService";
import { withRouter } from "react-router-dom";
import MoreVertIcon from "@material-ui/icons/MoreVert";
// import { loadModels, getFullFaceDescription, createMatcher } from "./api/face";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { red, green } from "@material-ui/core/colors";
import * as faceapi from "face-api.js";
import { PageViewOnlyPath, Event } from "../../analytics/Tracking";
// Import face profile
const JSON_PROFILE = require("./descriptors/bnk48.json");

const WIDTH = 420;
const HEIGHT = 420;
const inputSize = 160;

const screens = {
  FACECAPTUREINSTRUCTIONS: "face_capture_instruction_screen",
  FACECAPTURE: "face_capture_screen",
};

let captured_img_src = null;
let ImageData = [];

let capture_image_obj = {
  playerid: "",
  image_number: 0,
  encoded_image: "",
};

let videoRef = null;

class FaceCapture extends Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
    this.state = {
      currentScreenName: "face_capture_instruction_screen",
      fullDesc: null,
      detections: null,
      descriptors: null,
      faceMatcher: null,
      match: null,
      facingMode: null,
      startVideo: false,
      imagesCapturedCount: 0,
      faceStatus: "Initializing camera. Please wait..",
      captureStatus: "",
      isUploadingImages: false,
      isSuccessfullyUploaded: false,
    };
    this.isModelsLoaded = false;
    //this.onModelsLoadedSucces = this.onModelsLoadedSucces.bind(this);
  }

  componentDidMount = async () => {
    const MODEL_URL = process.env.PUBLIC_URL + "/models";
    await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
    //await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
    //await faceapi.loadFaceRecognitionModel(MODEL_URL);
    setTimeout(() => {
      this.isModelsLoaded = true;
      //this.onModelsLoadedSucces();
    }, 1000);
  };

  componentWillMount = async () => {
    // await loadModels();
    // this.setState({ faceMatcher: await createMatcher(JSON_PROFILE) });
  };

  checkModelsLoaded = () => {
    if (this.isModelsLoaded) {
      console.log("Models loaded successfully");
      this.setInputDevice();
      this.setState(
        {
          startVideo: true,
        },
        () => {
          videoRef = this.webcam.current.video;
          console.log("this.webcam", videoRef);
          videoRef.addEventListener("play", () => {
            console.log("on webcam video play");
            const displaySize = {
              width: videoRef.width,
              height: videoRef.height,
            };

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
                  faceStatus: "One face found",
                });
                this.capture();
              } else if (detections.length > 1) {
                console.log("More than one face found");
                this.setState({
                  faceStatus: "More than one face found",
                });
              } else {
                console.log("Face not found");
                this.setState({
                  faceStatus: "Face not found",
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
    navigator.mediaDevices.enumerateDevices().then(async (devices) => {
      let inputDevice = await devices.filter(
        (device) => device.kind === "videoinput"
      );
      console.log("inputDevice", inputDevice);
      //   if (inputDevice.length < 2) {
      //     await this.setState({
      //       facingMode: 'user'
      //     });
      //   } else {
      //     await this.setState({
      //       facingMode: { exact: 'environment' }
      //     });
      //   }
      // this.startCapture();
    });
  };

  startCapture = () => {
    this.interval = setInterval(() => {
      this.capture();
    }, 1500);
  };

  capture = async () => {
    if (!!this.webcam.current) {
      if (this.state.imagesCapturedCount < 5) {
        captured_img_src = await this.webcam.current.getScreenshot();
        console.log("captured_img_src", captured_img_src);
        let temp_captured_src = captured_img_src.split(",");
        console.log("temp_captured_src", temp_captured_src[0]);
        console.log("temp_captured_src", temp_captured_src[1]);
        //console.log("captured_img_src", captured_img_src["data"]["base64"]);
        //console.log("captured_img_src", captured_img_src["base64"]);
        this.setState(
          {
            imagesCapturedCount: this.state.imagesCapturedCount + 1,
          },
          () => {
            console.log("imagesCapturedCount", this.state.imagesCapturedCount);
            console.log("this.props.rootTree.user", this.props.rootTree.user);
            this.setState({
              captureStatus: `Capturing  Image Count ${this.state.imagesCapturedCount}`,
            });
            let temp_image_data_obj = {
              playerid: this.props.rootTree.user.userId,
              image_number: this.state.imagesCapturedCount,
              encoded_image: temp_captured_src[1].toString(),
            };
            ImageData.push(JSON.stringify(temp_image_data_obj));
          }
        );
      } else {
        if (this.webCameraFaceDetectionInterval) {
          console.log("All the images are captured");
          this.setState(
            {
              faceStatus: null,
              captureStatus: "Capture Completed!",
            },
            () => {
              this.sendImagesToCloud();
            }
          );
          clearInterval(this.webCameraFaceDetectionInterval);
        }
      }
    }
  };

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.webCameraFaceDetectionInterval) {
      clearInterval(this.webCameraFaceDetectionInterval);
    }
  }

  onUserLogout = () => {
    console.log("onUserLogout");
  };

  sendImagesToCloud() {
    if (ImageData.length > 0) {
      this.setState({
        startVideo: false,
        captureStatus: "Uploading captured images to cloud...!",
        isUploadingImages: true,
      });
      console.log("ImageData", ImageData);
      apiCall.userFaceRegister(JSON.stringify(ImageData)).then((res) => {
        console.log("res", res);
        if (res.status === 200) {
          this.setState({
            captureStatus: "Successfully uploaded...!",
            isSuccessfullyUploaded: true,
          });
          this.props.rootTree.user.updateRegisterImages(true);
          // Take the user to the Assessment Scren
        } else {
          console.log("Issue in the api call images/register");
        }
        this.setState({
          isUploadingImages: false,
        });
      });
    } else {
      console.log("ImageData empty");
    }
  }

  goToLevel(level_name) {
    switch (level_name) {
      case screens.FACECAPTUREINSTRUCTIONS:
        break;
      case screens.FACECAPTURE:
        break;
      default:
        break;
    }
    this.setState(
      {
        currentScreenName: level_name,
      },
      () => {
        if (this.state.currentScreenName === "face_capture_screen") {
          setTimeout(() => {
            this.checkModelsLoaded();
          }, 2000);
        }
      }
    );
  }

  getScreen(level_name, classes) {
    // Here we can set the template to render based on level_name
    let videoConstraints = {
      width: WIDTH,
      height: HEIGHT,
      facingMode: "user",
    };
    const { rootTree } = this.props;
    switch (level_name) {
      case screens.FACECAPTUREINSTRUCTIONS:
        return (
          <Fragment>
            {/* Your Registration has been completed successfully. In the Next
            Screen you will be prompted to capture your face. */}
            <Typography className={classes.pageTitle} component="h1">
              <Box fontWeight="fontWeightBold" fontSize={24}>
                Face Capture Instructions
              </Box>
            </Typography>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={require("../../assets/images/face-capture.png")}
                alt="Assessment Company Logo"
                style={{ maxWidth: 200, maxHeight: 200, padding: 20 }}
              />
              <ol>
                <li>
                  <Typography>
                    <Box fontWeight="fontWeightRegular" fontSize={16}>
                      We need your web camera access for <b>proctoring</b>.
                    </Box>
                  </Typography>
                </li>
                <li>
                  <Typography>
                    <Box fontWeight="fontWeightRegular" fontSize={16}>
                      Please ensure you are in correct <b>lighting</b>.
                    </Box>
                  </Typography>
                </li>
                <li>
                  <Typography>
                    <Box fontWeight="fontWeightRegular" fontSize={16}>
                      Please <b>stay still</b> for smooth capture of your face.
                    </Box>
                  </Typography>
                </li>
                <li>
                  <Typography>
                    <Box fontWeight="fontWeightRegular" fontSize={16}>
                      Please <b>allow</b> access to the browser's camera when
                      prompted.
                    </Box>
                  </Typography>
                </li>

                <li>
                  <Typography>
                    <Box fontWeight="fontWeightRegular" fontSize={16}>
                      Click proceed to continue
                    </Box>
                  </Typography>
                </li>
              </ol>
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => {
                  Event(
                    "USER",
                    "User read face capture instructions",
                    "FaceCapture"
                  );
                  this.goToLevel("face_capture_screen");
                }}
                className={classes.roundedButton}
                style={{
                  minWidth: 200,
                  margin: 10,
                  marginTop: 50,
                }}
              >
                Proceed
              </Button>
            </div>

            <br />
          </Fragment>
        );
      case screens.FACECAPTURE:
        return (
          <Fragment>
            <Typography className={classes.pageTitle} component="h1">
              <Box fontWeight="fontWeightBold" fontSize={24}>
                Face Capture Screen
              </Box>
            </Typography>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {this.state.faceStatus && (
                <Typography>
                  <b>FaceDetection:</b> {this.state.faceStatus}
                </Typography>
              )}

              {this.state.startVideo && (
                <div
                  style={{
                    width: WIDTH,
                    height: HEIGHT,
                  }}
                >
                  <div style={{ position: "relative", width: WIDTH }}>
                    {!!videoConstraints ? (
                      <div style={{ position: "absolute" }}>
                        <Webcam
                          audio={false}
                          width={WIDTH}
                          height={HEIGHT}
                          ref={this.webcam}
                          screenshotFormat="image/jpeg"
                          videoConstraints={videoConstraints}
                          className={classes.camStyles}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {this.state.captureStatus && (
                <Typography>
                  <b>Capture Status:</b> {this.state.captureStatus}
                </Typography>
              )}

              {this.state.isSuccessfullyUploaded && (
                <React.Fragment>
                  <CheckCircleIcon
                    style={{ color: green[500], fontSize: 120, marginTop: 100 }}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => {
                      Event(
                        "USER",
                        "Use face capture upload success proceed",
                        "FaceCapture"
                      );
                      this.props.history.push("/home");
                      PageViewOnlyPath("/home");
                    }}
                    className={classes.roundedButton}
                    style={{
                      minWidth: 200,
                      margin: 10,
                      marginTop: 100,
                    }}
                  >
                    Proceed
                  </Button>
                </React.Fragment>
              )}

              {this.state.isUploadingImages && (
                <React.Fragment>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      marginTop: 100,
                    }}
                  >
                    uploading...
                    <LinearProgress
                      mode="determinate"
                      value={20}
                      style={{ height: 6, width: 400, marginTop: 20 }}
                    />
                  </div>
                </React.Fragment>
              )}
            </div>
          </Fragment>
        );
      default:
        return <div>Something went wrong. Please try later</div>;
    }
  }

  onUserLogout = () => {
    console.log("onUserLogout");
    //let hello = localStorage.getItem("@rootStoreKey");
    //console.log("TCL: AssessmentHomeContainer -> onUserLogout -> hello", hello.user);
    authService.logout().then((res) => {
      console.log("TCL: AssessmentHomeContainer -> onUserLogout -> res", res);
      Event("USER", "User logged out in face capture", "FaceCapture");
      this.props.history.push("/login");
      PageViewOnlyPath("/login");
      window.location.reload();
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <CssBaseline />
        <NavBar onLogOut={this.onUserLogout} />
        <Container className={classes.cardGrid}>
          {this.getScreen(this.state.currentScreenName, classes)}
        </Container>
      </Fragment>
    );
  }
}

const styles = (theme) => ({
  progressBar: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  pageTitle: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    textAlign: "center",
  },
  roundedButton: {
    borderRadius: 25,
    padding: theme.spacing(1, 3),
    textTransform: "capitalize",
  },
  camStyles: {
    opacity: 1,
  },
});

export default withRouter(
  withStyles(styles)(inject("rootTree")(observer(FaceCapture)))
);
