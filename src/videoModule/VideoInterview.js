// 1. Localhost: In Localhost Chrome Browser asking permission only one time and Firefox every pageload.
// 2. HTTPS: Both Browsers Chrome and Firefox asking permission only one time.

// https://javascript.info/blob
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
  LinearProgress,
  Paper,
  Slider,
  Typography,
  withStyles
} from "@material-ui/core";
import StopIcon from "@material-ui/icons/Stop";
import RecordRTC from "recordrtc";
import NetworkDetector from "../hoc/NetworkDetector";
import InternetCheck from "../components/internetCheck";
import apiCall from "../services/apiCalls/apiService";
// const speedTest = require("speedtest-net");

let recordRTC;
const mediaConstraints = { video: true, audio: true };
// https://github.com/muaz-khan/RecordRTC/wiki/mimeType-and-recorderType

//var mime = 'video/webm; codecs=opus,vp9';
var mime = 'video/mp4; codecs="avc1.424028, mp4a.40.2"';
const recordingOptions = {
  // mimeType = 'video/webm; codecs=opus,vp9'; //this works for chrome
  //  mimeType = 'video/webm; codecs=opus,vp8'; //this works for firefox
  mimeType: mime,
  //mimeType: 'video/mp4; codecs="avc1.424028, mp4a.40.2"',
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
  LAST_VIDEO_UPLOAD_SCREEN: "last_video_upload_screen",
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
      videoDeviceIds: [],
      questions_data: [],
      interview_duration: 3,
      question_counter: 0,
      renderVideoInterview: false,
      question_timer: 0,
      answer_timer: 0,
      uploadProgress: 0,
      uploadStatus: ""
    };
    this.unSubscribeTimer = null;
    this.unSubscribeRecordingTimer = null;
    this.localMediaStream = null;

    this.clearAndStopVideoRecording = this.clearAndStopVideoRecording.bind(
      this
    );
    this.StartVideoRecording = this.StartVideoRecording.bind(this);
    this.startStream = this.startStream.bind(this);
    this.ClearRecordingTimers = this.ClearRecordingTimers.bind(this);
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

  async componentDidMount() {
    // try {
    //   console.log(await speedTest());
    // } catch (err) {
    //   console.log(err.message);
    // } finally {
    //   process.exit(0);
    // }

    if (!hasGetUserMedia()) {
      alert("getUserMedia() is not supported in your browser");
      return;
    } else {
      apiCall
        .getInterviewQuestionsData("sudarshankurri19900101_01")
        .then(res => {
          // console.log("Workbench -> componentDidMount -> res", res);
          if (res.data.message === "Success") {
            console.log(
              "VideoInterview -> componentDidMount -> res.data",
              res.data
            );

            this.setState(
              {
                questions_data: res.data["questions_list"]
              },
              () => {
                console.log(
                  "VideoInterview -> componentDidMount -> questions_data",
                  this.state.questions_data[0]["question"]
                );
                let temp_alloted_time = 0;
                this.state.questions_data.map((ques, index) => {
                  temp_alloted_time = temp_alloted_time + ques.alotted_time;
                });
                this.setState(
                  {
                    interview_duration: temp_alloted_time / 60,
                    renderVideoInterview: true
                  },
                  () => {
                    // Testing
                    //this.gotoLevel("question_screen");
                  }
                );
              }
            );
          }
        });
      //this.startStream();
      //this.hasCamAndMicrophone();
    }
  }

  componentWillUnmount() {
    // Clear the subscribers or listeners
    if (this.unSubscribeTimer) {
      clearInterval(this.unSubscribeTimer);
    }
    if (this.unSubscribeRecordingTimer) {
      clearTimeout(this.unSubscribeRecordingTimer);
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
          // console.log("Found another kind of device: ", deviceInfo);
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

  //ajax calling
  // uploadBlob(blob) {
  //   var formData = new FormData();
  //   formData.append("video-blob", blob);
  //   formData.append("video-filename", "demo.mp4");
  // }

  startStream() {
    let _this = this;
    window.navigator.getUserMedia(
      mediaConstraints,
      stream => {
        this.localMediaStream = stream;
        const video = this.refs.video;
        // localMediaStream = stream;
        video.srcObject = this.localMediaStream;
        video.onloadedmetadata = function(e) {
          // console.log("App -> video.onloadedmetadata -> e", e);
          // if (this.state.currentScreenName === "recording_screen") {

          _this.StartRecordingAnswerTimer();
          _this.StartVideoRecording(_this.state.answer_timer, stream);
        };

        var mediaStreamTrack = this.localMediaStream.getVideoTracks()[0];
        // localMediaStream.getAudioTracks()[0];
        if (typeof mediaStreamTrack != "undefined") {
          mediaStreamTrack.onended = function() {
            //for Chrome.
            errorMessage("Your webcam is busy!");
          };
        } else {
          errorMessage("Permission denied!");
        }

        // };
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

  StartRecordingAnswerTimer() {
    this.unSubscribeTimer = setInterval(() => {
      if (this.state.answer_timer <= 0) {
        this.ClearRecordingTimers();
      } else {
        this.setState({
          answer_timer: this.state.answer_timer - 1
        });
      }
    }, 1000);
  }

  StartVideoRecording(alloted_time, stream) {
    // console.log("successCallback -> stream", stream);
    recordRTC = RecordRTC(stream, recordingOptions);
    recordRTC.startRecording();

    // after X amount of seconds clear the timer interval and stop recording
    this.unSubscribeRecordingTimer = setTimeout(() => {
      this.clearAndStopVideoRecording();
    }, alloted_time * 1000);
  }

  ClearRecordingTimers() {
    if (this.unSubscribeRecordingTimer) {
      clearTimeout(this.unSubscribeRecordingTimer);
      this.clearAndStopVideoRecording();
    }
  }

  stopAndRemoveTrack(mediaStream) {
    return function(track) {
      track.stop();
      mediaStream.removeTrack(track);
    };
  }

  stopMediaStream(mediaStream) {
    if (!mediaStream) {
      return;
    }

    mediaStream.getTracks().forEach(this.stopAndRemoveTrack(mediaStream));
  }

  clearAndStopVideoRecording() {
    let _this = this;
    try {
      if (recordRTC) {
        recordRTC.stopRecording(audioVideoWebMURL => {
          const video = this.refs.video;
          video.pause();
          video.srcObject = null;
          video.src = "";
          if (this.localMediaStream) {
            console.log(
              "VideoInterview -> clearAndStopVideoRecording -> this.localMediaStream",
              this.localMediaStream
            );
            this.stopMediaStream(this.localMediaStream);
            // Next Level
            let blob = recordRTC.getBlob();
            // console.log("App -> btnStopRecording -> blob", blob);

            const upload_config = {
              onUploadProgress: function(progressEvent) {
                var percentCompleted = Math.round(
                  progressEvent.loaded / progressEvent.total
                );
                if (percentCompleted < 1) {
                  _this.setState({
                    uploadProgress: percentCompleted,
                    uploadStatus:
                      "Please wait while we are uploading video to cloud"
                  });
                } else {
                  _this.setState({
                    uploadProgress: 1,
                    uploadStatus: "Video Uploaded Successfully"
                  });
                }
                console.log(
                  "this.state.uploadProgress",
                  _this.state.uploadProgress
                );
              }
            };

            apiCall
              .getInterviewUploadPreSignedUrl(
                "sudarshankurri19900101_01",
                `${this.state.question_counter}.mp4`
              )
              .then(res => {
                if (res.status === 200) {
                  let upload_presigned_url = res.data.url;
                  // Upload to s3
                  apiCall
                    .uploadVideoFromPreSignedUrl(
                      upload_presigned_url,
                      blob,
                      upload_config
                    )
                    .then(response => {
                      console.log(
                        "VideoInterview -> clearAndStopVideoRecording -> response",
                        response
                      );
                      if (res.status === 200) {
                        // this.setState(
                        //   {
                        //     question_counter: this.state.question_counter + 1
                        //   },
                        //   () => {
                        if (
                          this.state.question_counter <
                          this.state.questions_data.length - 1
                        ) {
                          this.gotoLevel("uploading_screen");
                        } else {
                          this.gotoLevel("last_video_upload_screen");
                        }

                        //}
                        //);
                      } else {
                        console.log(
                          "Failed uploading video to the cloud. Retry again"
                        );
                      }
                    });

                  // Save to disk (For Testing Purpose Only)
                  // 1. Convert the data into 'blob'

                  // 2. Create blob link to download
                  // const url = window.URL.createObjectURL(
                  //   new Blob([blob])
                  // );
                  // console.log(
                  //   "VideoInterview -> clearAndStopVideoRecording -> url",
                  //   url
                  // );
                  // const link = document.createElement("a");
                  // link.href = url;
                  // link.setAttribute("download", `sample.mp4`);
                  // // 3. Append to html page
                  // document.body.appendChild(link);
                  // // 4. Force download
                  // link.click();
                  // // 5. Clean up and remove the link
                  // link.parentNode.removeChild(link);
                }
              });
            //this.gotoLevel("question_screen");
          }
        });
      }
    } catch (err) {
      // console.log("No video recorded yet");
    }
  }

  onFinish() {
    // console.log("The End");
  }

  onUploadProceed() {
    if (this.state.question_counter < this.state.questions_data.length - 1) {
      this.gotoLevel("question_screen");
    } else {
      this.gotoLevel("game_end_screen");
    }
  }

  gotoLevel(level_name) {
    // console.log("TCL: gotoLevel -> level_name", level_name);
    if (this.unSubscribeTimer) {
      clearInterval(this.unSubscribeTimer);
    }
    // this.setState({
    //   question_timer: 0,
    //   answer_timer: 0
    // });
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
        let temp_question_time = this.state.questions_data[
          this.state.question_counter
        ]["prep_time"];

        this.setState(
          {
            question_timer: temp_question_time,
            uploadProgress: 0,
            uploadStatus: ""
          },
          () => {
            console.log(
              "VideoInterview -> gotoLevel -> temp_question_time",
              this.state.question_timer
            );
            this.unSubscribeTimer = setInterval(() => {
              if (this.state.question_timer <= 0) {
                clearInterval(this.unSubscribeTimer);
                this.gotoLevel("recording_screen");
              } else {
                this.setState({
                  question_timer: this.state.question_timer - 1
                });
              }
            }, 1000);
          }
        );
        break;
      case screens.RECORDING_SCREEN:
        let temp_answer_time = this.state.questions_data[
          this.state.question_counter
        ]["alotted_time"];

        this.setState(
          {
            answer_timer: temp_answer_time
          },
          () => {
            this.startStream();
            // this.unSubscribeTimer = setInterval(() => {
            //   if (this.state.answer_timer <= 0) {
            //     clearInterval(this.unSubscribeTimer);

            //     if (
            //       this.state.question_counter <=
            //       this.state.questions_data.length - 1
            //     ) {
            //       this.setState(
            //         {
            //           question_counter: this.state.question_counter + 1
            //         },
            //         () => {
            //           this.gotoLevel("question_screen");
            //         }
            //       );
            //     } else {
            //       this.gotoLevel("uploading_screen");
            //     }
            //   } else {
            //     this.setState({
            //       answer_timer: this.state.answer_timer - 1
            //     });
            //   }
            // }, 1000);
          }
        );
        break;
      case screens.UPLOADING_SCREEN:
        break;
      case screens.LAST_VIDEO_UPLOAD_SCREEN:
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
                    <Box
                      fontWeight={400}
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
                    <Box
                      fontWeight={400}
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
        return (
          <Container
            style={{
              height: "100%",
              padding: 0
            }}
          >
            <Box
              className={[classes.flexColumnCenter, classes.flexFullHeight]}
              style={{
                flex: 5
              }}
            >
              <Box
                className={[classes.flexColumnCenter, classes.flexFullWidth]}
                style={{
                  flex: 5,
                  textAlign: "center"
                }}
              >
                <Box
                  style={{
                    marginTop: -50
                  }}
                >
                  <Paper
                    style={{
                      paddingTop: 20,
                      PaddingBottom: 20,
                      width: 400,
                      borderRadius: 10,
                      backgroundColor: "#e8e8e8"
                    }}
                  >
                    <Typography
                      align="center"
                      component="div"
                      variant="h6"
                      style={{ color: "#000" }}
                    >
                      Company Name
                    </Typography>
                    <div
                      style={{
                        // marginTop: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Typography
                        align="center"
                        component="div"
                        variant="body1"
                        style={{ color: "#000", marginRight: 10 }}
                      >
                        Loop Reality
                      </Typography>
                    </div>
                    <br />
                  </Paper>

                  <br />
                  <br />
                  <br />
                  <br />

                  <Box fontWeight={800}>
                    <Typography
                      component="div"
                      style={{
                        textShadow: "1px 1px rgba(0, 0, 0, 0.034)",
                        textAlign: "left"
                      }}
                    >
                      Total Interview Duration: {this.state.interview_duration}{" "}
                      Mins
                    </Typography>
                  </Box>
                  <br />
                  <Paper
                    style={{
                      width: 400,
                      borderRadius: 10,
                      backgroundColor: "#e8e8e8"
                    }}
                  >
                    <Typography
                      align="center"
                      component="div"
                      variant="body1"
                      style={{ color: "#000", textAlign: "left", padding: 20 }}
                    >
                      You will have 30 seconds to prepare and different response
                      time to answer each question. Please try to complete your
                      response in time.
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        backgroundColor: "#fff",
                        flex: 1,
                        flexDirection: "column",
                        padding: 20,
                        borderBottomRightRadius: 10,
                        borderBottomLeftRadius: 10
                      }}
                    >
                      <Typography
                        align="center"
                        component="div"
                        variant="body1"
                        style={{ color: "#000", marginRight: 10 }}
                      >
                        <Box fontWeight={600}>
                          No. of Questions: {this.state.questions_data.length}
                        </Box>
                      </Typography>
                      <br />
                      <Typography
                        align="center"
                        component="div"
                        variant="body1"
                        style={{ color: "#000", marginRight: 10 }}
                      >
                        <Box fontWeight={600}>
                          Estimated bandwidth required: 5 Mbps
                        </Box>
                      </Typography>
                    </div>
                  </Paper>

                  <br />
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
                  onClick={() => this.gotoLevel("question_screen")}
                  className={classes.roundedButton}
                  style={{
                    minWidth: 200
                  }}
                >
                  Start Interview
                </Button>
              </Box>
            </Box>
          </Container>
        );
      case screens.QUESTION_SCREEN:
        return (
          <Container
            style={{
              height: "100%",
              padding: 0
            }}
          >
            <Box
              className={[classes.flexColumnCenter, classes.flexFullHeight]}
              style={{
                flex: 5
              }}
            >
              <Box
                className={[classes.flexColumnCenter, classes.flexFullWidth]}
                style={{
                  flex: 5,
                  textAlign: "center"
                }}
              >
                <Box
                  style={{
                    marginTop: -100
                  }}
                >
                  <Typography
                    align="center"
                    component="div"
                    variant="h6"
                    style={{ color: "#000" }}
                  >
                    Question : {this.state.question_counter + 1}
                  </Typography>
                  <br />

                  <br />
                  <Paper
                    style={{
                      paddingTop: 20,
                      PaddingBottom: 20,
                      width: 400,
                      borderRadius: 10,
                      backgroundColor: "#e8e8e8"
                    }}
                  >
                    {/* <Typography
                      align="center"
                      component="div"
                      variant="body1"
                      style={{ color: "#000", padding: 10 }}
                    >
                      Question:
                    </Typography> */}

                    <Typography
                      align="center"
                      component="div"
                      variant="body1"
                      style={{ color: "#000", marginRight: 10 }}
                    >
                      {
                        this.state.questions_data[this.state.question_counter][
                          "question"
                        ]
                      }
                    </Typography>

                    <br />
                  </Paper>

                  <br />

                  <br />

                  <Typography>Recording starts in</Typography>
                  <br />

                  <Box
                    fontWeight={400}
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
                    {this.state.question_timer}
                  </Box>

                  <br />
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
                  onClick={() => this.gotoLevel("recording_screen")}
                  className={classes.roundedButton}
                  style={{
                    minWidth: 200
                  }}
                >
                  Proceed
                </Button>
              </Box>
            </Box>
          </Container>
        );
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
                      <Box fontWeight={800}>{this.state.answer_timer} Secs</Box>
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
                  onClick={this.ClearRecordingTimers}
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
        return (
          <Container
            style={{
              height: "100%",
              padding: 0
            }}
          >
            <Box
              className={[classes.flexColumnCenter, classes.flexFullHeight]}
              style={{
                flex: 5
              }}
            >
              <Box
                className={[classes.flexColumnCenter, classes.flexFullWidth]}
                style={{
                  flex: 5,
                  textAlign: "center"
                }}
              >
                <Box
                  style={{
                    margin: "0 60px",
                    marginTop: -200
                  }}
                >
                  <div
                    style={{
                      paddingTop: 20,
                      PaddingBottom: 20,
                      width: 500,
                      borderRadius: 10
                    }}
                  >
                    <Typography
                      align="center"
                      component="div"
                      variant="h6"
                      style={{ color: "#000", marginBottom: 20 }}
                    >
                      {this.state.uploadStatus}
                    </Typography>
                    {this.state.uploadProgress >= 1 ? (
                      <div></div>
                    ) : (
                      <LinearProgress
                        mode="determinate"
                        value={this.state.uploadProgress}
                      />
                    )}
                    <br />
                  </div>
                  <br />
                  <br />
                  <Typography
                    align="center"
                    component="div"
                    variant="body1"
                    style={{ color: "#000", marginBottom: 20 }}
                  >
                    You will have 15 seconds to prepare to answer the next
                    question and a specific time limit to complete your
                    response. You will only be given one attempt to complete
                    your answer.
                  </Typography>
                </Box>
              </Box>

              <Box
                className={[classes.flexColumnCenter, classes.flexFullWidth]}
                style={{
                  flex: 2,
                  textAlign: "center"
                }}
              >
                {this.state.uploadProgress >= 1 ? (
                  <Typography
                    align="center"
                    component="div"
                    variant="body1"
                    style={{ color: "#000", marginBottom: 20 }}
                  >
                    Tap "Proceed" to continue with your interview.
                  </Typography>
                ) : (
                  <div></div>
                )}
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  disabled={this.state.uploadProgress >= 1 ? false : true}
                  onClick={() => this.onUploadProceed()}
                  className={classes.roundedButton}
                  style={{
                    minWidth: 200
                  }}
                >
                  Proceed
                </Button>
              </Box>
            </Box>
          </Container>
        );
      case screens.LAST_VIDEO_UPLOAD_SCREEN:
        return (
          <Container
            style={{
              height: "100%",
              padding: 0
            }}
          >
            <Box
              className={[classes.flexColumnCenter, classes.flexFullHeight]}
              style={{
                flex: 5
              }}
            >
              <Box
                className={[classes.flexColumnCenter, classes.flexFullWidth]}
                style={{
                  flex: 5,
                  textAlign: "center"
                }}
              >
                <Box
                  style={{
                    margin: "0 60px",
                    marginTop: -200
                  }}
                >
                  <div
                    style={{
                      paddingTop: 20,
                      PaddingBottom: 20,
                      width: 500,
                      borderRadius: 10
                    }}
                  >
                    <Typography
                      align="center"
                      component="div"
                      variant="h6"
                      style={{ color: "#000", marginBottom: 20 }}
                    >
                      {this.state.uploadStatus}
                    </Typography>
                    {this.state.uploadProgress >= 1 ? (
                      <div></div>
                    ) : (
                      <LinearProgress
                        mode="determinate"
                        value={this.state.uploadProgress}
                      />
                    )}
                    <br />
                  </div>
                  <br />
                  <br />
                  <Typography
                    align="center"
                    component="div"
                    variant="body1"
                    style={{ color: "#000", marginBottom: 20 }}
                  >
                    Congratulations for making to the end of this module. Your
                    video will be processed once it is successfully uploaded in
                    the cloud.
                  </Typography>
                </Box>
              </Box>

              <Box
                className={[classes.flexColumnCenter, classes.flexFullWidth]}
                style={{
                  flex: 2,
                  textAlign: "center"
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  disabled={this.state.uploadProgress >= 1 ? false : true}
                  onClick={() => this.onUploadProceed()}
                  className={classes.roundedButton}
                  style={{
                    minWidth: 200
                  }}
                >
                  Proceed
                </Button>
              </Box>
            </Box>
          </Container>
        );

      case screens.GAME_END_SCREEN:
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
                      src={require("../assets/Game_Icons/Video_Interview_Test.png")}
                      alt="Video Interview Logo"
                      style={{ height: 200, aspectRatio: 1.0 }}
                    />
                    <Typography
                      component="div"
                      style={{
                        marginTop: 30,
                        textShadow: "1px 1px rgba(0, 0, 0, 0.034)"
                      }}
                      variant="body1"
                    >
                      {"Thanks for taking the test"}
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
                    onClick={() => this.onFinish()}
                    className={classes.roundedButton}
                    style={{
                      minWidth: 200
                    }}
                  >
                    Next
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
                <InternetCheck
                  message="No Connection"
                  style={{
                    color: "#fff",
                    backgroundColor: "#000",
                    textAlign: "center"
                  }}
                />
                {this.state.renderVideoInterview &&
                  this.getScreen(this.state.currentScreenName, classes)}
              </Box>
            </Paper>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default NetworkDetector(withStyles(styles)(VideoInterview));
