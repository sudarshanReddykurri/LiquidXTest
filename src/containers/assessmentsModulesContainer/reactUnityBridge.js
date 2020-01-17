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
    if (game_index != "") {
      //   this.setState({
      //     showUnity: false
      //   });
      // this.props.history.goBack();
      // this.props.history.replace();
      // const history = this.props.history.entries;
      // set first entry in history to mirror the last entry
      // history.length = history[history.length - 1];
      // remove all but first history entry
      // history.length = history.length-1;

      // setTimeout(() => {
      //   localStorage.setItem("reset_game", true);
      //   this.props.history.push({
      //     pathname: "/am",
      //     state: {
      //       from: this.props.location.pathname
      //     }
      //   });
      // }, 10000);

      this.unityContent = new UnityContent(
        GameConfigModules[game_index].jsonPath,
        GameConfigModules[game_index].unityLoaderPath
        //"GameBuilds/tsmBuild/Build/UnityLoader.js"
      );
      this.state = {
        progression: 0,
        openLoading: true
      };
      console.log(
        "TCL: ReactUnityBridge -> constructor -> GameConfigModules[game_index].jsonPath",
        GameConfigModules[game_index].jsonPath
      );
      console.log(
        "TCL: ReactUnityBridge -> constructor -> GameConfigModules[game_index].unityLoaderPath",
        GameConfigModules[game_index].unityLoaderPath
      );

      // const [openadialogue, setOpen] = React.useState(true);

      this.unityContent.on("sendDataToNativeJS", jsonData => {
        console.log("Data From Unity");
        console.log(jsonData);
      });

      this.unityContent.on("gameCompletedNotify", message => {
        console.log("gameCompletedNotify From Unity");
      });

      this.unityContent.on("progress", progression => {
        console.log("Unity progress", progression);
      });
      this.unityContent.on("sendCameraDataToNativeJs", ImageDataJson => {
        console.log("Unity Camera Data: " + ImageDataJson);
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

        this.unityContent.send("MSM", "setPlayerID", user.userId);
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
            backgroundColor: '#fff'
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
