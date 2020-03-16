// 1. Localhost: In Localhost Chrome Browser asking permission only one time and Firefox every pageload.
// 2. HTTPS: Both Browsers Chrome and Firefox asking permission only one time.
import React, { Component } from "react";
// import logo from "./logo.svg";
// import "./App.css";
import {
  Box,
  Button,
  ButtonBase,
  Card,
  CardActions,
  CardMedia,
  CardContent,
  Container,
  Grid,
  IconButton,
  Input,
  Paper,
  Slider,
  Typography,
  withStyles
} from "@material-ui/core";
import StopIcon from "@material-ui/icons/Stop";
import RecordRTC from "recordrtc";

let recordRTC;
const mediaConstraints = { video: true, audio: true };
const recordingOptions = {
  mimeType: "video/webm;codecs=vp9",
  bitsPerSecond: 128000
};
const toBuffer = require("blob-to-buffer");
const toArrayBuffer = require("to-arraybuffer");

const screens = {
  INITIAL: "initial_screen",
  DEVICE_CHECK: "device_screen",
  NETWORK_CHECK: "network_screen",
  GUIDELINES_SLIDES: "guidelines_screen",
  INSTRUCTION_SCREEN: "instruction_screen",
  QUESTION_SCREEN: "question_screen",
  RECORDING_SCREEN: "recording_screen",
  UPLOADING_SCREEN: "uploading_screen",
  GAME_END_SCREEN: "game_end_screen"
};

const styles = theme => ({
  root: {
    /* margin: 200px; */
    position: "fixed" /* or absolute */,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  paper: {
    //padding: theme.spacing(2),
    margin: "auto",
    width: 600,
    height: 800,
    maxHeight: 800
  },
  stopButton: {
    minWidth: 100,
    backgroundColor: "#fff",
    borderRadius: 20,
    textTransform: "capitalize"
    //verticalAlign: "middle",
  },
  image: {
    width: 128,
    height: 128
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%"
  },
  flexFullWidth: {
    display: "flex",
    width: "100%"
  },
  flexFullHeight: {
    display: "flex",
    height: "100%"
  },
  flexColumnCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  flexRowCenter: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  roundedButton: {
    borderRadius: 25,
    padding: theme.spacing(1, 3),
    textTransform: "capitalize"
  },
  infoPaper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary
  }
});

function hasGetUserMedia() {
  return !!(
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
  );
}

function errorMessage(message, e) {
  console.error(message, typeof e == "undefined" ? "" : e);
  alert(message);
}

class VideoInterview extends Component {
  constructor() {
    super();
    this.state = {
      videoEnded: false,
      currentScreenName: "initial_screen",
      slides: [
        {
          title: "Good Lighting",
          body:
            "Before you start the Interview, find a quiet room with bright lighting.",
          icon_path: require("../assets/Instructions/01.png")
        },
        {
          title: "Dress Neatly",
          body:
            "Your recruiter can see you, so dress right and remember to look at the camera during the interview.",
          icon_path: require("../assets/Instructions/02.png")
        },
        {
          title: "High Speed Internet",
          body:
            "Make sure your network signal is good and stable. A high speed internet connection is strongly recommended.",
          icon_path: require("../assets/Instructions/06.png")
        },
        {
          title: "Face the Camera",
          body: "Face the camera. You are a HERO. - act like one!",
          icon_path: require("../assets/Instructions/04.png")
        },
        {
          title: "Limited Time",
          body:
            "Clear. Crisp. Creative. These 3 C's are your friends. You have limited time, so use it well.",
          icon_path: require("../assets/Instructions/05.png")
        },
        {
          title: "Advisory Notice",
          body:
            "It is recommended that users use Wi-Fi wherever possible in order to upload the videos. ",
          icon_path: require("../assets/Instructions/Notice.png")
        }
      ],
      slideCounter: 0,
      audioDeviceIds: [],
      videoDeviceIds: []
    };

    this.clearAndStopVideoRecording = this.clearAndStopVideoRecording.bind(
      this
    );
    this.StartVideoRecording = this.StartVideoRecording.bind(this);
  }

  onGuidelinesPress() {
    if (this.state.slideCounter < this.state.slides.length - 1) {
      this.setState({
        slideCounter: this.state.slideCounter + 1
      });
    } else if (this.state.slideCounter === this.state.slides.length - 1) {
      this.gotoLevel("instruction_screen");
    }
  }

  componentDidMount() {
    if (!hasGetUserMedia()) {
      alert("getUserMedia() is not supported in your browser");
      return;
    } else {
      this.startStream();
      //this.hasCamAndMicrophone();
    }
  }

  hasCamAndMicrophone() {
    window.navigator.mediaDevices.enumerateDevices().then(deviceInfos => {
      for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        // console.log(
        //   "VideoInterview -> gotDevices -> deviceInfo.kind ",
        //   deviceInfo.kind
        // );
        // console.log(
        //   "VideoInterview -> gotDevices -> deviceInfo.deviceId",
        //   deviceInfo.deviceId
        // );
        if (deviceInfo.kind === "audioinput") {
          let current_audio_devices = this.state.audioDeviceIds;
          current_audio_devices.push(deviceInfo.deviceId);
          this.setState({
            audioDeviceIds: current_audio_devices
          });

          //   console.log(
          //     "VideoInterview -> gotDevices -> deviceInfo.label",
          //     deviceInfo.label,
          //     "Audio"
          //   );
        } else if (deviceInfo.kind === "videoinput") {
          let current_video_devices = this.state.videoDeviceIds;
          current_video_devices.push(deviceInfo.deviceId);
          this.setState({
            videoDeviceIds: current_video_devices
          });

          //   console.log(
          //     "VideoInterview -> gotDevices -> deviceInfo.label",
          //     deviceInfo.label,
          //     "Video"
          //   );
        } else {
          console.log("Found another kind of device: ", deviceInfo);
        }
      }

      setTimeout(() => {
        if (
          this.state.audioDeviceIds.length > 0 &&
          this.state.videoDeviceIds.length > 0
        ) {
          return true;
        } else {
          return false;
        }
      }, 1000);
    });
  }

  startStream() {
    window.navigator.getUserMedia(
      mediaConstraints,
      localMediaStream => {
        const video = this.refs.video;
        video.srcObject = localMediaStream;
        var mediaStreamTrack = localMediaStream.getVideoTracks()[0];
        // localMediaStream.getAudioTracks()[0];
        if (typeof mediaStreamTrack != "undefined") {
          mediaStreamTrack.onended = function() {
            //for Chrome.
            errorMessage("Your webcam is busy!");
          };
        } else {
          errorMessage("Permission denied!");
        }
        video.onloadedmetadata = function(e) {
          console.log("App -> video.onloadedmetadata -> e", e);
        };
      },
      error => {
        var message;
        switch (error.name) {
          case "NotFoundError":
          case "DevicesNotFoundError":
            message = "Please setup your webcam first.";
            break;
          case "SourceUnavailableError":
            message = "Your webcam is busy";
            break;
          case "PermissionDeniedError":
          case "SecurityError":
            message = "Permission denied!";
            break;
          default:
            errorMessage("Rejected!", error);
            return;
        }
        errorMessage(message);
      }
    );
  }

  StartVideoRecording() {
    window.navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(stream => {
        console.log("successCallback -> stream", stream);
        recordRTC = RecordRTC(stream, recordingOptions);
        recordRTC.startRecording();
        // after X amount of seconds clear the timer interval and stop recording
        setTimeout(() => {
          this.clearAndStopVideoRecording();
        }, 6000);
      })
      .catch(error => {
        console.log("errorCallback -> error", error);
      });
  }

  clearAndStopVideoRecording() {
    try {
      if (recordRTC) {
        recordRTC.stopRecording(audioVideoWebMURL => {
          console.log(
            "App -> btnStopRecording -> audioVideoWebMURL",
            audioVideoWebMURL
          );

          let blob = recordRTC.getBlob();
          console.log("App -> btnStopRecording -> blob", blob);

          let params = {
            data: blob,
            id: Math.floor(Math.random() * 90000) + 10000
          };

          // toBuffer(blob, (err, buffer) => {
          //   if (err) throw err;
          //   let temp_file = toArrayBuffer(buffer);
          //   console.log("App -> clearAndStopVideoRecording -> temp_file", temp_file)
          // })

          this.setState({
            videoEnded: true
          });
        });
      }
    } catch (err) {
      console.log("No video recorded yet");
    }
  }

  gotoLevel(level_name) {
    console.log("TCL: gotoLevel -> level_name", level_name);
    switch (level_name) {
      case screens.INITIAL:
        break;
      case screens.DEVICE_CHECK:
        break;
      case screens.NETWORK_CHECK:
        break;
      case screens.GUIDELINES_SLIDES:
        break;
      case screens.INSTRUCTION_SCREEN:
        break;
      case screens.QUESTION_SCREEN:
        break;
      case screens.RECORDING_SCREEN:
        break;
      case screens.UPLOADING_SCREEN:
        break;
      case screens.GAME_END_SCREEN:
        break;
      default:
        break;
    }
    this.setState({
      currentScreenName: level_name
    });
  }

  getScreen(current_screen, classes) {
    switch (current_screen) {
      case screens.INITIAL:
        return (
          <Container
            style={{
              height: "100%",
              padding: 0
            }}
          >
            <div className={classes.flexFullHeight}>
              <div
                style={{
                  flex: 1
                }}
              >
                {/* Left Empty Container */}
              </div>
              <Box
                className={[classes.flexColumnCenter, classes.flexFullHeight]}
                style={{
                  flex: 5
                }}
              >
                <Box
                  className={[classes.flexColumnCenter, classes.flexFullWidth]}
                  style={{
                    flex: 3,
                    textAlign: "center"
                  }}
                >
                  <Box
                    style={{
                      marginTop: 0,
                      height: 350
                    }}
                  >
                    <img
                      src={require("../assets/Game_Icons/Video_Interview_Test.png")}
                      alt="Language Test Logo"
                      style={{ height: 200, aspectRatio: 1.0 }}
                    />
                    <Typography
                      component="div"
                      style={{
                        marginTop: 10,
                        textShadow: "1px 1px rgba(0, 0, 0, 0.034)"
                      }}
                      variant="h6"
                    >
                      Video Interview
                    </Typography>
                  </Box>
                </Box>
                <Box
                  className={[classes.flexColumnCenter, classes.flexFullWidth]}
                  style={{
                    flex: 1,
                    textAlign: "center"
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => this.gotoLevel("guidelines_screen")}
                    className={classes.roundedButton}
                    style={{
                      minWidth: 200
                    }}
                  >
                    Proceed
                  </Button>
                </Box>
              </Box>
              <div
                style={{
                  flex: 1
                }}
              >
                {/* Reft Empty Container */}
              </div>
            </div>
          </Container>
        );
      case screens.DEVICE_CHECK:
        return (
          <Container
            style={{
              height: "100%",
              padding: 0
            }}
          >
            <div className={classes.flexFullHeight}>
              <div
                style={{
                  flex: 1
                }}
              >
                {/* Left Empty Container */}
              </div>
              <Box
                className={[classes.flexColumnCenter, classes.flexFullHeight]}
                style={{
                  flex: 5
                }}
              >
                <Box
                  className={[classes.flexColumnCenter, classes.flexFullWidth]}
                  style={{
                    flex: 3,
                    textAlign: "center"
                  }}
                >
                  <Box
                    style={{
                      marginTop: -50
                    }}
                  >
                    <Typography
                      component="div"
                      style={{
                        marginTop: 100,
                        textShadow: "1px 1px rgba(0, 0, 0, 0.034)"
                      }}
                      variant="h5"
                    >
                      Device Check
                    </Typography>
                    <Typography
                      component="div"
                      style={{
                        marginTop: 20,
                        textShadow: "1px 1px rgba(0, 0, 0, 0.034)"
                      }}
                      variant="body1"
                    >
                      Please, make sure you are in front of a system with
                      Microphone and a Camera.
                    </Typography>
                    {/* <Typography
                      component="div"
                      style={{
                        marginTop: 20,
                        textShadow: "1px 1px rgba(0, 0, 0, 0.034)"
                      }}
                      variant="body1"
                    >
                      This module requires audio and video input.Kindly enable
                      the permissions of camera and microphone when prompted.
                    </Typography> */}
                    <br />
                    <br />

                    <Box fontWeight={800}>
                      <Typography
                        component="div"
                        style={{
                          textShadow: "1px 1px rgba(0, 0, 0, 0.034)"
                        }}
                      >
                        Number of audio devices found
                      </Typography>
                    </Box>
                    <br />
                    <Box fontWeight={400}
                      style={{
                        height: 100,
                        width: 100,
                        backgroundColor: "#bbb",
                        borderRadius: "50%",
                        margin: "0 auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 24
                      }}
                    >
                        {this.state.audioDeviceIds.length}
                    </Box>
                    <br />
                    <br />
                    <Box fontWeight={800}>
                      <Typography
                        component="div"
                        style={{
                          textShadow: "1px 1px rgba(0, 0, 0, 0.034)"
                        }}
                      >
                        Number of video devices found
                      </Typography>
                    </Box>
                    <br />
                    <Box fontWeight={400}
                      style={{
                        height: 100,
                        width: 100,
                        backgroundColor: "#bbb",
                        borderRadius: "50%",
                        margin: "0 auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 24
                      }}
                    >
                        {this.state.videoDeviceIds.length}
                    </Box>
                  </Box>
                </Box>

                <Box
                  className={[classes.flexColumnCenter, classes.flexFullWidth]}
                  style={{
                    flex: 1,
                    textAlign: "center"
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => this.gotoLevel("guidelines_screen")}
                    className={classes.roundedButton}
                    style={{
                      minWidth: 200
                    }}
                  >
                    Proceed
                  </Button>
                </Box>
              </Box>
              <div
                style={{
                  flex: 1
                }}
              >
                {/* Reft Empty Container */}
              </div>
            </div>
          </Container>
        );
      case screens.NETWORK_CHECK:
        return <div></div>;
      case screens.GUIDELINES_SLIDES:
        return (
          <Container
            style={{
              height: "100%",
              padding: 0
            }}
          >
            <div className={classes.flexFullHeight}>
              <div
                style={{
                  flex: 1
                }}
              >
                {/* Left Empty Container */}
              </div>
              <Box
                className={[classes.flexColumnCenter, classes.flexFullHeight]}
                style={{
                  flex: 5
                }}
              >
                <Box
                  className={[classes.flexColumnCenter, classes.flexFullWidth]}
                  style={{
                    flex: 3,
                    textAlign: "center"
                  }}
                >
                  <Box
                    style={{
                      marginTop: 0,
                      height: 350
                      //width: 200,
                      //height: imgHeight
                      //boxShadow: "0px 2.8px 2.2px rgba(0, 0, 0, 0.034)"
                      // boxShadow: "10px 10px 5px -8px rgba(245,242,245,1)"
                    }}
                  >
                    <img
                      src={
                        this.state.slides[this.state.slideCounter]["icon_path"]
                      }
                      alt="Language Test Logo"
                      style={{ height: 300, aspectRatio: 1.0 }}
                    />
                    <Typography
                      component="div"
                      style={{
                        marginTop: 30,
                        textShadow: "1px 1px rgba(0, 0, 0, 0.034)"
                      }}
                      variant="h6"
                    >
                      {this.state.slides[this.state.slideCounter]["title"]}
                    </Typography>

                    <Typography
                      component="div"
                      style={{
                        // lineHeight: 20,
                        marginTop: 40,
                        textAlign: "center"
                        // height: 80
                      }}
                    >
                      {this.state.slides[this.state.slideCounter]["body"]}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  className={[classes.flexColumnCenter, classes.flexFullWidth]}
                  style={{
                    flex: 1,
                    textAlign: "center"
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => this.onGuidelinesPress()}
                    className={classes.roundedButton}
                    style={{
                      minWidth: 200
                    }}
                  >
                    Proceed
                  </Button>
                </Box>
              </Box>
              <div
                style={{
                  flex: 1
                }}
              >
                {/* Reft Empty Container */}
              </div>
            </div>
          </Container>
        );
      case screens.INSTRUCTION_SCREEN:
        return <div></div>;
      case screens.QUESTION_SCREEN:
        return <div></div>;
      case screens.RECORDING_SCREEN:
        return (
          <React.Fragment>
            <div
              style={{
                flex: 1,
                display: "flex",
                height: "100%",
                flexDirection: "column",
                justifyContent: "space-around"
              }}
            >
              <div
                style={{
                  //   flex: 0.15,
                  height: 150,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Paper
                  style={{
                    padding: 10,
                    width: "80%",
                    borderRadius: 10
                  }}
                >
                  <Typography
                    align="center"
                    component="div"
                    variant="body1"
                    style={{ color: "#000" }}
                  >
                    Tell me about yourself in brief?
                  </Typography>
                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Typography
                      align="center"
                      component="div"
                      variant="caption"
                      style={{ color: "#000", marginRight: 10 }}
                    >
                      Time left :
                    </Typography>
                    <Typography
                      align="center"
                      component="div"
                      style={{
                        color: "#ff0000"
                      }}
                    >
                      <Box fontWeight={800}>120 Secs</Box>
                    </Typography>
                  </div>
                </Paper>
              </div>
              <div
                style={{
                  //   flex: 0.7,
                  //   display: "flex",
                  //   alignItems: "center",
                  //   justifyContent: "center",
                  top: 0,
                  left: 0,
                  height: 450,
                  width: "100%",
                  position: "relative"
                }}
              >
                <video
                  ref="video"
                  autoPlay
                  muted
                  style={{
                    position: "relative",
                    zIndex: 0,
                    objectFit: "cover",
                    height: "auto",
                    width: "100%"
                    // height:"100%"
                  }}
                ></video>
                {/* <div
                      style={{
                        position: "absolute",
                        top: 80,
                        zIndex: 1
                      }}
                    >
                      <p>Content above your video</p>
                      
                    </div> */}
              </div>
              <div
                style={{
                  //   flex: 0.15,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  top: 0,
                  height: 150
                }}
              >
                {/* <button onClick={this.StartVideoRecording}>Record</button> */}
                <Button
                  variant="contained"
                  className={classes.stopButton}
                  startIcon={<StopIcon style={{ color: "#ff0000" }} />}
                  onClick={this.clearAndStopVideoRecording}
                >
                  Stop
                </Button>
              </div>
            </div>
            {/* <div className="buttons">
                  <button onClick={this.StartVideoRecording}>Record</button>
                  <button onClick={this.clearAndStopVideoRecording}>
                    Stop
                  </button>
            
                </div> */}
          </React.Fragment>
        );
      case screens.UPLOADING_SCREEN:
        return <div></div>;
      case screens.GAME_END_SCREEN:
        return <div></div>;
      default:
        return <div></div>;
    }
  }

  render() {
    const { classes, rootTree } = this.props;
    return (
      <React.Fragment>
        <div
          style={{
            backgroundColor: "#d3d3d3",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        >
          <div className={classes.root}>
            <Paper className={classes.paper}>
              <Box
                style={{
                  height: "100%",
                  overflow: "hidden"
                }}
              >
                {this.getScreen(this.state.currentScreenName, classes)}
              </Box>
            </Paper>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(VideoInterview);
