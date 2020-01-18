import React, { Component } from "react";
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
import apiCall from "../../services/apiCalls/apiService";
import "./reactUnityStyles.css";
let game_index = "";
class ReactUnityBridge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showUnity: true
    };
    const { user } = this.props.rootTree;
    game_index = user.currentAssessment.current_game;
    //game_index = "mob-07";
    if (game_index != "") {
      this.unityContent = new UnityContent(
        GameConfigModules[game_index].jsonPath,
        GameConfigModules[game_index].unityLoaderPath
      );
      this.state = {
        progression: 0,
        openLoading: true
      };

      this.unityContent.on("sendDataToNativeJS", jsonData => {
        // console.log("Data From Unity");
        let dataFromUnity = JSON.parse(jsonData);
        console.log(
          "TCL: ReactUnityBridge -> constructor -> parsedData",
          dataFromUnity
        );

        if (dataFromUnity.data_label === "cameradata") {
          let parsedJsonDataUnity = JSON.parse(dataFromUnity.json_data);
          let cameraData = {
            playerid: user.userId,
            game_name: game_index,
            timestamp: dataFromUnity.time_stamp,
            encoded_image: parsedJsonDataUnity.ImageData
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
        } else if (
          dataFromUnity.data_label === "gamedata" ||
          dataFromUnity.data_label === "pausedata"
        ) {
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
          user.currentAssessment.update_current_game("");
          this.props.history.goBack();
        } else if (dataFromUnity.data_label === "next") {
          // Called when proceed button is pressed in the game

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
  render() {
    return (
      <div className="App">
        <div
          //className="gameContainer"
          style={{
            backgroundColor: "#fff"
          }}
        >
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
          <DialogTitle
            id="form-dialog-title"
            style={{ textAlign: "center", backgroundColor: "transparent" }}
          >
            Loading game..
          </DialogTitle>
          <DialogContent>
            <CircleToBlockLoading size="small" />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

const styles = theme => ({
  icon: {
    marginRight: theme.spacing(2)
  }
});

export default withRouter(
  withStyles(styles)(inject("rootTree")(observer(ReactUnityBridge)))
);
