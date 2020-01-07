import React, { Component } from "react";
import Unity, { UnityContent } from "react-unity-webgl";
import GameConfig from "./gameConfig.json";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";
import Modal from "react-bootstrap/Modal";
import { CircleToBlockLoading } from "react-loadingg";

let game_index = 0;
class ReactUnityBridge extends Component {
  constructor(props) {
    super(props);
    game_index = this.props.intValue;
    this.unityContent = new UnityContent(
      GameConfig[game_index].jsonPath,
      GameConfig[game_index].unityLoaderPath
      
      //"GameBuilds/tsmBuild/Build/UnityLoader.js"
    );
    this.state = {
      progression: 0,
      openLoading: true
    };
    console.log("TCL: ReactUnityBridge -> constructor -> GameConfig[game_index].jsonPath", GameConfig[game_index].jsonPath)
    console.log("TCL: ReactUnityBridge -> constructor -> GameConfig[game_index].unityLoaderPath", GameConfig[game_index].unityLoaderPath)

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
      console.log("JsonData" + GameConfig[0].gameName);
      var canvas = document.getElementById("#canvas");
      if (canvas != null) {
        var width = canvas.width;
        var height = canvas.height;
        setTimeout(function() {
          canvas.width = GameConfig[game_index].width;
          canvas.height = GameConfig[game_index].height;
          var resolution = width + "x" + height;
          console.log("resolution unity:" + resolution);
        }, 250);
      } else {
        console.log("resolution unity canvas not found");
      }

      this.unityContent.send("MSM", "setPlayerID", "stephencherla19701001_00");
    });
    this.unityContent.on("progress", progression => {
      // Now we can use the progression to for example
      // display it on our React app.

      this.setState({
        progression: progression
      });
    });
  }
  render() {
    return (
      <div className="App">
        {/* <div>{`Loading ${this.state.progression * 100} percent...`}</div> */}
        <Unity unityContent={this.unityContent} />
        <Dialog
          fullScreen
          open={this.state.openLoading}
          onClose={this.handleClose}
        >
          <DialogTitle id="form-dialog-title" style={{ textAlign: "center" ,backgroundColor: 'transparent'}}>
            Loading game..
          </DialogTitle>
          <DialogContent>
            <CircleToBlockLoading size="small" />
          </DialogContent>
        </Dialog>
      </div>
      //     <div>
      //   <Dialog open={true} onClose={this.handleClose} aria-labelledby="form-dialog-title">
      //     <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
      //     <DialogContent>
      //       <DialogContentText>
      //         To subscribe to this website, please enter your email address here. We will send updates
      //         occasionally.
      //       </DialogContentText>

      //     </DialogContent>
      //   </Dialog>
      // </div>
    );
  }
}

export default ReactUnityBridge;
