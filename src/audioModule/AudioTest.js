// https://github.com/CookPete/react-player/blob/master/src/demo/App.js
import React, { Component } from "react";
import ReactPlayer from "react-player";
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
import SimpleBarReact from "simplebar-react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import {
  PauseCircleFilled,
  PlayCircleFilled,
  Replay
} from "@material-ui/icons";
import SeekBar from "../components/SeekBar";
import AlertDialog from "../components/AlertDialog";
import AudioQuiz from "../components/AudioQuiz";
import "./AudioModuleStyles.css";
import apiCall from "../services/apiCalls/apiService";

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
    width: 440,
    height: 840,
    maxHeight: 840
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

const appendZero = number => (number < 10 ? `0${number}` : number);

const getFormattedTime = time => {
  const dateTime = new Date(0, 0, 0, 0, 0, time, 0);

  const dateTimeM = appendZero(dateTime.getMinutes());
  const dateTimeS = appendZero(dateTime.getSeconds());

  return `${dateTimeM}:${dateTimeS}`;
};

const screens = {
  INITIAL: "initial_screen",
  AUDIOCHECK: "audiocheck_screen",
  INSTRUCTION_01: "instruction_screen_01",
  LEVEL_01_Audio: "level_screen_01_audio",
  LEVEL_01_Answer: "level_screen_01_answer",
  INSTRUCTION_02: "instruction_screen_02",
  LEVEL_02_Audio: "level_screen_02_audio",
  LEVEL_02_Answer: "level_screen_02_answer",
  INSTRUCTION_03: "instruction_screen_03",
  LEVEL_03_Audio: "level_screen_03_audio",
  LEVEL_03_Answer: "level_screen_03_answer",
  GAME_END_SCREEN: "game_end_screen"
};

let game_index = "";

class AudioTest extends Component {
  constructor(props) {
    super(props);
    document.title = "PerspectAI";
    this.state = {
      url: "",
      pip: false,
      playing: false,
      controls: false,
      light: false,
      volume: 1.0,
      muted: false,
      played: 0,
      loaded: 0,
      duration: 0,
      playbackRate: 1.0,
      loop: false,
      slides: [
        {
          title: "Language Test",
          body: "",
          icon_path: require("../assets/Game_Icons/English_Test.png"),
          is_logo: true
        },
        {
          title: "Pay Attention",
          body:
            "Please be attentive with out any distractions. It is recommended to use head phones while taking the test.",
          icon_path: require("../assets/Instructions/EnglishTestInst_02.png"),
          is_logo: false
        },
        {
          title: "Time Yourself",
          body: "Make sure you keep a check on the time.",
          icon_path: require("../assets/Instructions/EnglishTestInst_03.png"),
          is_logo: false
        },
        {
          title: "Audio Check",
          body:
            "Please make sure you are able to listen to the audio clips properly.",
          icon_path: require("../assets/Instructions/EnglishTestInst_01.png"),
          is_logo: false
        }
      ],
      //currentScreenName: "game_end_screen",
      currentScreenName: "initial_screen",
      audioState: "Preparing Audio",
      slideCounter: 0,
      level_01: [],
      level_02: [],
      level_03: [],
      quiz_questions_placeholder: [],
      question_counter: 0,
      trackLength: 0,
      currentPosition: 0,
      number_of_time_audio_played_counter: 0,
      playText: "Play",
      showPopUp: false,
      userTextResponse: "",
      showAudioTest: false
    };
    this.unSubscribeTimer = null;
    this.isTimeout = false;

    // Data
    this.dump_json = [];
    this.game_data = {
      playerid: "",
      q_id: [],
      user_response: [],
      spawn_time: "",
      submit_time: ""
    };
    this.game_name = "mob-20";

    this.alertRef = null;
    this.onSubmitResponses = this.onSubmitResponses.bind(this);

    const { user } = this.props.rootTree;
    this.game_data.playerid = user.userId;

    console.log(
      "TCL: ReactUnityBridge -> constructor -> this.props.rootTree",
      this.props.rootTree
    );

    game_index = user.currentAssessment.current_game;
    //this.onAudioPlayerReady();
  }
  async componentDidMount() {
    if (game_index !== "") {
      this.setState(
        {
          showAudioTest: true
        },
        () => {
          apiCall.getLanguageTestData().then(res => {
            console.log("Workbench -> componentDidMount -> res", res);
            if (res.data.message === "Success") {
              this.populateLevels(res.data);
            }
          });
        }
      );
    }

    // console.log("this.alertRef", this.alertRef);
    // if (this.alertRef) {
    //   this.alertRef.handleOpenDialog(
    //     `Failed processing request`,
    //     "Hello World"
    //   );
    // }
  }

  componentWillUnmount() {
    // Clear the subscribers or listeners
    if (this.unSubscribeTimer) clearInterval(this.unSubscribeTimer);
  }

  populateLevels(data) {
    if (data.message === "Success") {
      this.setState(
        {
          level_01: data.questions["level_01"],
          level_02: data.questions["level_02"],
          level_03: data.questions["level_03"]
        },
        () => {
          console.log("populateLevels successful");
          // Testing Start
          // this.setState(
          //   {
          //     question_counter: 0,
          //     currentScreenName: "level_screen_02_answer"
          //   },
          //   () => {
          //     this.mapDataFromJsonToArray(this.state.level_02, 0);
          //   }
          // );

          // Testing End
        }
      );
    }
  }

  trainingSetupAudio() {
    this.setState(
      {
        currentPosition: 0,
        url:
          "https://perpsect-ai-common-public-assets.s3.ap-south-1.amazonaws.com/audio_test/test_sound.mp3"
      },
      () => {
        this.startAudio();
      }
    );
  }

  mapDataFromJsonToArray(array, index) {
    console.log("mapDataFromJsonToArray", array, index);
    let arrnew = [];
    array[index]["question_details"].map((item, index) => {
      arrnew.push(item);
    });
    this.setState(
      {
        quiz_questions_placeholder: arrnew
      },
      () => {
        console.log(
          "quiz_questions_placeholder",
          this.state.quiz_questions_placeholder
        );
        return this.state.quiz_questions_placeholder;
      }
    );
  }

  onSubmitResponses(user_responses, question_ids) {
    // Save data
    //let temp_details = this.state.level_02[question_counter]["question_details"];
    this.game_data.q_id = question_ids;
    this.game_data.user_response = user_responses;
    this.game_data.submit_time = this.getUnixTimeinMilliSeconds();
    this.pushDataToDumpjson(Object.assign({}, this.game_data));
    this.resetGameData();
    console.log("After pushing to Dump Json", this.dump_json);

    if (this.state.currentScreenName === "level_screen_02_answer") {
      if (this.state.question_counter < this.state.level_02.length - 1) {
        this.setState(
          {
            question_counter: this.state.question_counter + 1
          },
          () => {
            this.mapDataFromJsonToArray(
              this.state.level_02,
              this.state.question_counter
            );
            this.gotoLevel("level_screen_02_audio");
          }
        );
      } else {
        // Reset the variables and move to next level
        console.log("Move to next level");
        this.gotoLevel("instruction_screen_03");
      }
    } else if (this.state.currentScreenName === "level_screen_03_answer") {
      if (this.state.question_counter < this.state.level_03.length - 1) {
        this.setState(
          {
            question_counter: this.state.question_counter + 1
          },
          () => {
            this.mapDataFromJsonToArray(
              this.state.level_03,
              this.state.question_counter
            );
            this.gotoLevel("level_screen_03_audio");
          }
        );
      } else {
        // Reset the variables
        console.log("The End");
        // Need to refactor this code
        this.gotoLevel("game_end_screen");
      }
    }
  }

  onAudioPlayerReady = () => {
    console.log("onReady");
    this.handlePlay();
  };

  startAudio = () => {
    console.log("onStart");
    this.handlePlay();
  };

  handlePlay = () => {
    console.log("onPlay");
    this.setState({ playing: true, audioState: "playing" });
  };

  handlePause = () => {
    console.log("onPause");
    // this.setState({
    //   currentPosition: this.state.playedSeconds
    // });
    // this.setState({ playing: false, audioState: "paused" });
  };

  handleProgress = state => {
    //console.log("onProgress", state);

    this.setState({
      currentPosition: state.playedSeconds
      //trackLength: state.loadedSeconds
    });
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state);
    }
  };

  handleEnded = () => {
    console.log("onEnded");
    this.setState({ playing: this.state.loop, audioState: "Audio Complete" });
    this.setState({
      number_of_time_audio_played_counter:
        this.state.number_of_time_audio_played_counter + 1,
      playText: "Proceed to Question"
    });

    // if (
    //   this.state.number_of_time_audio_played_counter === 0 ||
    //   this.state.number_of_time_audio_played_counter === 1
    // ) {
    //   this.setState({
    //     number_of_time_audio_played_counter:
    //       this.state.number_of_time_audio_played_counter + 1,
    //     playText: "Proceed to Question"
    //   });
    // } else {
    //   this.setState({
    //     number_of_time_audio_played_counter: 0
    //   });
    // }
  };

  handleError(e) {
    console.log("Workbench -> handleError -> e", e);
    if (e.type === "error") {
      this.setState({
        playing: false
      });
    }
  }

  pushDataToDumpjson(game_data) {
    this.dump_json.push(game_data);
  }

  resetGameData() {
    this.game_data.q_id = [];
    this.game_data.user_response = [];
    this.game_data.spawn_time = "";
    this.game_data.submit_time = "";
  }

  onFinish() {
    console.log("The End");
    let gameData = {
      name: this.game_name,
      data: this.game_data
    };
    console.log("Workbench -> onFinish -> gameData", gameData);
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
  }

  onSpellingSubmitted() {
    this.setState({
      showPopUp: false
    });
    if (this.unSubscribeTimer) {
      console.warn("onSpellingSubmitted");
      clearInterval(this.unSubscribeTimer);
    }
    const { userTextResponse, level_01, question_counter } = this.state;

    // Record data here
    //save
    this.game_data.q_id = [this.state.level_01[question_counter]["q_id"]];
    this.game_data.user_response = [userTextResponse];
    this.game_data.submit_time = this.getUnixTimeinMilliSeconds();
    this.pushDataToDumpjson(Object.assign({}, this.game_data));
    this.resetGameData();

    console.warn("After pushing to Dump Json", this.dump_json);

    if (question_counter < level_01.length - 1) {
      // if (userTextResponse.length > 0 && userTextResponse != "") {
      // Make sure to store the data before submitting
      console.log("question_counter", question_counter);
      this.setState({
        question_counter: question_counter + 1,
        userTextResponse: "",
        totalTime: 0
      });
      this.gotoLevel("level_screen_01_audio");
    } else {
      console.log("going to level instruction_screen_02");
      this.gotoLevel("instruction_screen_02");
      this.setState({
        question_counter: 0,
        userTextResponse: ""
      });
    }
  }

  handleDuration = duration => {
    console.log("onDuration", duration);
    this.setState({ trackLength: duration });
  };

  getUnixTimeinMilliSeconds() {
    return Math.round(new Date().getTime());
  }

  onInstructionPress() {
    if (this.state.slideCounter < this.state.slides.length - 1) {
      this.setState({
        slideCounter: this.state.slideCounter + 1
      });
    } else if (this.state.slideCounter === this.state.slides.length - 1) {
      this.gotoLevel("audiocheck_screen");
      // this.setState({
      //   currentScreenName: "audiocheck_screen"
      // });
      // this.gotoLevel("audiocheck_screen");
    }
  }

  checkAudioPlayCounter(next_level_name, level_questions_array) {
    console.log("next_level_name", next_level_name);
    if (this.state.number_of_time_audio_played_counter < 2) {
      try {
        // EnglishTest/Audios from local file system
        //  For Deploy
        console.log(
          "level_questions_array[this.state.question_counter][clip_id]",
          level_questions_array[this.state.question_counter]["clip_id"]
        );
      } catch (error) {}
    }
  }

  updateAudioFile(current_level_array, num_of_times_audio_requested) {
    console.log(
      "Workbench -> updateAudioFile -> num_of_times_audio_requested",
      num_of_times_audio_requested
    );
    console.log(
      "Workbench -> updateAudioFile -> audio_url_location",
      current_level_array
    );
    // switch (num_of_times_audio_requested) {
    //   case 0:
    //     this.setState({
    //       number_of_time_audio_played_counter: 0
    //     });
    //     break;
    //   case 1:
    //     this.setState({
    //       number_of_time_audio_played_counter: 1
    //     });
    //     break;
    //   case 2:
    //     this.setState({
    //       number_of_time_audio_played_counter: 2
    //     });
    //     break;
    //   default:
    //     break;
    // }
    this.setState(
      {
        url: current_level_array[this.state.question_counter]["audio_url"]
        //number_of_time_audio_played_counter: num_of_times_audio_requested
      },
      () => {
        this.startAudio();
      }
    );
  }

  onCancelPopup = () => {
    this.setState({
      showPopUp: false
    });
  };

  onProceedForward = level_to_go => {
    console.log("Workbench -> onProceedForward -> level_to_go", level_to_go);
    //this.gotoLevel(level_to_go);
  };

  togglePopUp = () => {
    this.setState({
      showPopUp: !this.state.showPopUp
    });
  };

  renderPopUp(
    classes,
    title,
    message,
    cancelCallBack,
    nextCallBack,
    showPositiveBtn = true,
    showNegativeBtn = true,
    positiveText = "Yes",
    negativeText = "No"
  ) {
    return (
      <div class="hover_bkgr_fricc">
        <span class="helper"></span>
        <div>
          <div
            class="popupCloseButton"
            onClick={() => {
              this.setState({
                showPopUp: false
              });
            }}
          >
            &times;
          </div>
          <div>
            <b>{title}</b>
          </div>
          <br />
          <div>{message}</div>
          <br />
          {showNegativeBtn && (
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={cancelCallBack}
              className={classes.roundedButton}
              style={{
                minWidth: 60,
                marginRight: 10
              }}
            >
              {negativeText}
            </Button>
          )}
          {showPositiveBtn && (
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={nextCallBack}
              className={classes.roundedButton}
              style={{
                minWidth: 60
              }}
            >
              {positiveText}
            </Button>
          )}
        </div>
      </div>
    );
  }

  getAudioIcon(audio_state) {
    switch (audio_state) {
      case "paused":
      case "Preparing Audio":
        // case "Please wait while we are preparing Audio..":
        return (
          <IconButton
            aria-label="play"
            onClick={() => this.trainingSetupAudio()}
          >
            <PlayCircleFilled color="primary" style={{ fontSize: 50 }} />
          </IconButton>
        );
      case "playing":
        return (
          <IconButton aria-label="pause" onClick={() => this.handlePause()}>
            <PauseCircleFilled color="primary" style={{ fontSize: 50 }} />
          </IconButton>
        );
      case "Audio Complete":
        return (
          <IconButton
            aria-label="replay"
            onClick={() => this.trainingSetupAudio()}
          >
            <Replay color="primary" style={{ fontSize: 50 }} />
          </IconButton>
        );
      default:
        return <div></div>;
    }
  }

  gotoLevel(level_name) {
    console.log("TCL: gotoLevel -> level_name", level_name);
    this.setState({ showPopUp: false });
    switch (level_name) {
      case screens.AUDIOFETCH:
      case screens.INITIAL:
      case screens.AUDIOCHECK:
      case screens.INSTRUCTION_01: // This will get called only once
        this.setState({
          question_counter: 0,
          currentPosition: 0
        });
        break;
      case screens.LEVEL_01_Audio: // This will get called multiple times
        this.setState({
          currentPosition: 0,
          number_of_time_audio_played_counter: 0,
          audioState: "",
          trackLength: 0
        });
        break;
      case screens.LEVEL_01_Answer: // This will get called multiple times
        // This is used only for level_01 (Need to optimise it better) this is hard corded for time sake
        this.game_data.spawn_time = this.getUnixTimeinMilliSeconds();
        this.setState({
          totalTime: 30 //  Level_01 time insert here
        });
        this.unSubscribeTimer = setInterval(() => {
          console.log("hello123");
          if (this.state.totalTime === 1) {
            this.setState(
              {
                totalTime: 0
              },
              () => {
                this.isTimeout = true;
                //console.log("hello before onSubmit");
                this.onSpellingSubmitted();
                clearInterval(this.unSubscribeTimer);
              }
            );
            //this.submitResponses();
          } else {
            this.setState({
              totalTime: this.state.totalTime - 1
            });
          }
        }, 1000);

        break;
      case screens.INSTRUCTION_02: // This will get called only once
        console.log("INSTRUCTION_02 Called");
        this.setState({
          question_counter: 0,
          currentPosition: 0
        });
        this.mapDataFromJsonToArray(this.state.level_02, 0);

        break;
      case screens.LEVEL_02_Audio: // This will get called multiple times
        this.setState({
          currentPosition: 0,
          number_of_time_audio_played_counter: 0,
          audioState: "",
          trackLength: 0
        });
        break;
      case screens.LEVEL_02_Answer: // This will get called multiple times
        this.game_data.spawn_time = this.getUnixTimeinMilliSeconds();
        break;
      case screens.INSTRUCTION_03:
        this.setState({
          question_counter: 0,
          currentPosition: 0
        });
        this.mapDataFromJsonToArray(this.state.level_03, 0);
        break;
      case screens.LEVEL_03_Audio: // This will get called multiple times
        this.setState({
          currentPosition: 0,
          number_of_time_audio_played_counter: 0,
          audioState: "",
          trackLength: 0
        });
        break;
      case screens.LEVEL_03_Answer: // This will get called multiple times
        this.game_data.spawn_time = this.getUnixTimeinMilliSeconds();
        break;
      case screens.GAME_END_SCREEN: // This will get called only once
        break;
      default:
        break;
    }

    // Resetting Audio Player time to intial time
    this.setState({
      currentScreenName: level_name,
      playText: "Play"
      // audioState: ""
    });
  }

  getScreen(current_screen, classes) {
    switch (current_screen) {
      case screens.INITIAL:
        let imgHeight = this.state.slides[this.state.slideCounter]["is_logo"]
          ? 1200 / 6
          : 1200 / 4;
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
                      style={{ height: imgHeight, aspectRatio: 1.0 }}
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
                    onClick={() => this.onInstructionPress()}
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
      case screens.AUDIOCHECK:
        return (
          <React.Fragment>
            {this.state.showPopUp &&
              this.renderPopUp(
                classes,
                "Can't Hear Audio?",
                "This module requires Audio. Try checking the device volume once and then replay the audio. If you still face the problem try to contact the admin.",
                this.onCancelPopup,
                () => {},
                false,
                true,
                "",
                "OK"
              )}
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
                    className={[
                      classes.flexColumnCenter,
                      classes.flexFullWidth
                    ]}
                    style={{
                      flex: 3,
                      textAlign: "center"
                    }}
                  >
                    <Box
                      style={{
                        marginTop: -350
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
                        Audio Check
                      </Typography>
                      <Typography
                        component="div"
                        style={{
                          marginTop: 20,
                          textShadow: "1px 1px rgba(0, 0, 0, 0.034)"
                        }}
                        variant="body1"
                      >
                        Listen to the Audio Clipping Carefully
                      </Typography>
                      <br />
                      <br />
                      <div className={[classes.flexColumnCenter]}>
                        {this.getAudioIcon(this.state.audioState)}
                      </div>
                      <Box fontWeight={800}>
                        <Typography
                          component="div"
                          style={{
                            textShadow: "1px 1px rgba(0, 0, 0, 0.034)"
                          }}
                        >
                          {this.state.audioState}
                        </Typography>
                      </Box>
                      <SeekBar
                        trackLength={this.state.trackLength}
                        currentPosition={this.state.currentPosition}
                      />
                    </Box>
                  </Box>
                  {this.state.audioState === "Audio Complete" && (
                    <Box
                      className={[
                        classes.flexColumnCenter,
                        classes.flexFullWidth
                      ]}
                      style={{
                        flex: 1,
                        textAlign: "center",
                        marginTop: -200
                      }}
                    >
                      <Typography
                        component="div"
                        style={{
                          marginBottom: 20,
                          textShadow: "1px 1px rgba(0, 0, 0, 0.034)"
                        }}
                        variant="body1"
                      >
                        Can you hear the audio clip?
                      </Typography>
                      <Box className={[classes.flexRowCenter]}>
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          onClick={() => {
                            this.setState({
                              showPopUp: true
                            });
                          }}
                          className={classes.roundedButton}
                          style={{
                            minWidth: 50,
                            marginRight: 10
                          }}
                        >
                          No
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          onClick={() =>
                            this.gotoLevel("instruction_screen_01")
                          }
                          className={classes.roundedButton}
                          style={{
                            minWidth: 50
                          }}
                        >
                          Yes
                        </Button>
                      </Box>
                    </Box>
                  )}
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
          </React.Fragment>
        );
      case screens.INSTRUCTION_01:
        return this.instructionTemplate(
          "PART 1",
          "Spelling Test",
          this.state.level_01.length,
          30,
          this.state.level_01.length * 30,
          "level_screen_01_audio",
          classes
        );
      case screens.LEVEL_01_Audio:
        return this.audioScreen(
          "level_screen_01_answer",
          this.state.level_01,
          classes
        );
      case screens.LEVEL_01_Answer:
        return (
          <React.Fragment>
            {this.state.showPopUp &&
              this.renderPopUp(
                classes,
                "Confirm",
                "Do you want to submit?",
                this.onCancelPopup,
                () => {
                  this.onSpellingSubmitted();
                },
                true,
                true,
                "Yes",
                "NO"
              )}
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
                    className={[
                      classes.flexColumnCenter,
                      classes.flexFullWidth
                    ]}
                    style={{
                      flex: 3,
                      textAlign: "center"
                    }}
                  >
                    <Box
                      style={{
                        marginTop: 0
                      }}
                    >
                      <Typography
                        component="div"
                        style={{
                          marginTop: -200,
                          textShadow: "1px 1px rgba(0, 0, 0, 0.034)"
                        }}
                        variant="h5"
                      >
                        Audio {this.state.question_counter + 1}
                      </Typography>
                      <Typography
                        component="div"
                        style={{
                          marginTop: 20,
                          textShadow: "1px 1px rgba(0, 0, 0, 0.034)"
                        }}
                        variant="body1"
                      >
                        Fill in the blank in the statement
                      </Typography>

                      <Paper
                        style={{
                          marginTop: 20
                        }}
                      >
                        <Typography
                          component="div"
                          variant="body2"
                          style={{ color: "#000" }}
                        >
                          Time left to answer
                        </Typography>
                        <Typography
                          component="div"
                          style={{
                            marginTop: 2,
                            marginBottom: 2
                          }}
                          color="primary"
                        >
                          <Box fontWeight={800}>
                            {appendZero(getFormattedTime(this.state.totalTime))}
                          </Box>
                        </Typography>
                      </Paper>

                      <Typography
                        component="div"
                        style={{
                          marginTop: 40,
                          textShadow: "1px 1px rgba(0, 0, 0, 0.034)"
                        }}
                      >
                        <Box fontWeight={200}>
                          {
                            this.state.level_01[this.state.question_counter][
                              "question"
                            ]
                          }
                        </Box>
                      </Typography>
                      <Input
                        placeholder="Enter your answer here"
                        inputProps={{ "aria-label": "description" }}
                        style={{
                          marginTop: 80,
                          width: "100%"
                        }}
                        onChange={event => {
                          this.setState(
                            {
                              userTextResponse: event.target.value
                            },
                            () => {
                              console.log(
                                "Workbench -> getScreen -> userTextResponse",
                                this.state.userTextResponse
                              );
                            }
                          );
                        }}
                      />
                    </Box>
                  </Box>
                  <Box
                    className={[
                      classes.flexColumnCenter,
                      classes.flexFullWidth
                    ]}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      marginTop: -200
                    }}
                  >
                    <Box className={[classes.flexRowCenter]}>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => {
                          if (this.state.userTextResponse === "") {
                            this.setState({
                              showPopUp: true
                            });
                          } else {
                            this.onSpellingSubmitted();
                          }
                        }}
                        className={classes.roundedButton}
                        style={{
                          minWidth: 200
                        }}
                      >
                        Submit
                      </Button>
                    </Box>
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
          </React.Fragment>
        );
      case screens.INSTRUCTION_02:
        return this.instructionTemplate(
          "PART 2",
          "Comprehension",
          this.state.level_02.length,
          4 * 15,
          this.state.level_02.length * 4 * 15,
          "level_screen_02_audio",
          classes
        );
      case screens.LEVEL_02_Audio:
        return this.audioScreen(
          "level_screen_02_answer",
          this.state.level_02,
          classes
        );
      case screens.LEVEL_02_Answer:
        return (
          <AudioQuiz
            questions={this.state.quiz_questions_placeholder}
            responses={this.onSubmitResponses}
            timeForTest={this.state.level_02.length * 15}
            // currentAudioCount={this.state.audioClipNumberContainer}
          />
        );
      case screens.INSTRUCTION_03:
        return this.instructionTemplate(
          "PART 3",
          "Spelling Test",
          this.state.level_03.length,
          4 * 15,
          this.state.level_03.length * 4 * 15,
          "level_screen_03_audio",
          classes
        );
      case screens.LEVEL_03_Audio:
        return this.audioScreen(
          "level_screen_03_answer",
          this.state.level_03,
          classes
        );
      case screens.LEVEL_03_Answer:
        return (
          <AudioQuiz
            questions={this.state.quiz_questions_placeholder}
            responses={this.onSubmitResponses}
            timeForTest={this.state.level_03.length * 15}
            // currentAudioCount={this.state.audioClipNumberContainer}
          />
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
                      src={this.state.slides[0]["icon_path"]}
                      alt="Language Test Logo"
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

  renderButtonsInAudioScreen(
    next_level_name,
    level_questions_array,
    audio_play_count,
    classes
  ) {
    switch (audio_play_count) {
      case 0:
        return (
          <Button
            variant="contained"
            size="small"
            color="primary"
            disabled={this.state.playing}
            onClick={() => this.updateAudioFile(level_questions_array, 1)}
            className={classes.roundedButton}
            style={{
              minWidth: 200
            }}
          >
            Play
          </Button>
        );
      case 1:
        return (
          <React.Fragment>
            <Button
              variant="contained"
              size="small"
              color="primary"
              disabled={this.state.playing}
              onClick={() => this.updateAudioFile(level_questions_array, 2)}
              className={classes.roundedButton}
              style={{
                minWidth: 200
              }}
            >
              Repeat the audio clip
            </Button>
            <br />
            <Button
              variant="outlined"
              size="small"
              color="primary"
              disabled={this.state.playing}
              onClick={() => {
                if (this.state.number_of_time_audio_played_counter === 1) {
                  this.setState({
                    showPopUp: true
                  });
                } else {
                  this.gotoLevel(next_level_name);
                }
              }}
              className={classes.roundedButton}
              style={{
                minWidth: 200
              }}
            >
              Proceed to Question
            </Button>
          </React.Fragment>
        );
      case 2:
        return (
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={() => this.gotoLevel(next_level_name)}
            className={classes.roundedButton}
            style={{
              minWidth: 200
            }}
          >
            Proceed to Question
          </Button>
        );
      default:
        return null;
    }
  }

  audioScreen(next_level_name, level_questions_array, classes) {
    return (
      <React.Fragment>
        {this.state.showPopUp &&
          this.renderPopUp(
            classes,
            "Are you sure?",
            "You cannot listen to this audio clip again.",
            this.onCancelPopup,
            () => this.gotoLevel(next_level_name),
            true,
            true,
            "YES",
            "NO"
          )}
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
                <Box>
                  <Typography
                    component="div"
                    style={{
                      marginTop: -100,
                      textShadow: "1px 1px rgba(0, 0, 0, 0.034)"
                    }}
                    variant="h5"
                  >
                    Audio {this.state.question_counter + 1}
                  </Typography>
                  <Typography
                    component="div"
                    style={{
                      marginTop: 20,
                      marginBottom: 20,
                      textShadow: "1px 1px rgba(0, 0, 0, 0.034)"
                    }}
                    variant="body1"
                  >
                    Listen to the audio clipping carefully, and complete the
                    sentence
                  </Typography>
                  <Box fontWeight={800} align="center">
                    <Typography component="div">
                      <b>{this.state.audioState}</b>
                    </Typography>
                  </Box>
                  <SeekBar
                    trackLength={this.state.trackLength}
                    currentPosition={this.state.currentPosition}
                  />
                </Box>
              </Box>
              <Box
                className={[classes.flexColumnCenter, classes.flexFullWidth]}
                style={{
                  flex: 1,
                  textAlign: "center"
                }}
              >
                {this.renderButtonsInAudioScreen(
                  next_level_name,
                  level_questions_array,
                  this.state.number_of_time_audio_played_counter,
                  classes
                )}
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
      </React.Fragment>
    );
  }

  instructionTemplate(
    level_number,
    level_title,
    num_of_audio_clips,
    time_to_respond,
    section_time,
    next_level_name,
    classes
  ) {
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
                  marginTop: -200
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
                  {level_number}
                </Typography>
                <Typography
                  component="div"
                  style={{
                    marginTop: 10,
                    marginBottom: 10
                  }}
                >
                  <Box fontWeight={800}>{level_title}</Box>
                </Typography>
                <Typography
                  component="div"
                  style={{
                    marginTop: 20,
                    marginBottom: 20,
                    textShadow: "1px 1px rgba(0, 0, 0, 0.034)"
                  }}
                  variant="body1"
                >
                  Listen to the audio clipping carefully, and complete the
                  sentence
                </Typography>

                <Grid container spacing={3}>
                  <Grid container item xs={12}>
                    <Grid item xs={12}>
                      <Paper className={classes.infoPaper}>
                        <Typography
                          component="div"
                          variant="body1"
                          style={{ color: "#000" }}
                        >
                          Number of Audio Clips
                        </Typography>
                        <Typography
                          component="div"
                          style={{
                            marginTop: 2,
                            marginBottom: 2
                          }}
                          color="primary"
                        >
                          <Box fontWeight={800}>{num_of_audio_clips}</Box>
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                  <Grid container item xs={12}>
                    <Grid item xs={12}>
                      <Paper className={classes.infoPaper}>
                        <Typography
                          component="div"
                          variant="body1"
                          style={{ color: "#000" }}
                        >
                          Approx. time given to answer each clip
                        </Typography>
                        <Typography
                          component="div"
                          style={{
                            marginTop: 2,
                            marginBottom: 2
                          }}
                          color="primary"
                        >
                          <Box fontWeight={800}>{time_to_respond}</Box>
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                  <Grid container item xs={12}>
                    <Grid item xs={12}>
                      <Paper className={classes.infoPaper}>
                        <Typography
                          component="div"
                          variant="body1"
                          style={{ color: "#000" }}
                        >
                          Estimated time to complete the section
                        </Typography>
                        <Typography
                          component="div"
                          style={{
                            marginTop: 2,
                            marginBottom: 2
                          }}
                          color="primary"
                        >
                          <Box fontWeight={800}>{section_time}</Box>
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>

                {/*   <Typography component="div"
                  style={{
                    marginTop: 5,
                    textShadow: "1px 1px rgba(0, 0, 0, 0.034)"
                  }}
                >
                  <Box fontWeight={800}>{this.state.audioState}</Box>
                </Typography> */}
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
                onClick={() => this.gotoLevel(next_level_name)}
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
  }

  render() {
    const {
      url,
      playing,
      controls,
      light,
      volume,
      muted,
      loop,
      played,
      loaded,
      duration,
      playbackRate,
      pip
    } = this.state;
    const SEPARATOR = " · ";
    const { classes, rootTree } = this.props;
    return (
      <React.Fragment>
        {this.state.showAudioTest ? (
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
                  {/* <div> inside the popup box!</div> */}
                  {/* <AlertDialog
                ref={alertRef => {
                  this.alertRef = alertRef;
                }}
              /> */}
                  <ReactPlayer
                    ref={this.ref}
                    className="react-player"
                    width="1"
                    height="1"
                    url={url}
                    playing={playing}
                    controls={controls}
                    light={light}
                    // loop={loop}
                    // playbackRate={playbackRate}
                    // volume={volume}
                    // muted={muted}
                    onReady={this.onAudioPlayerReady}
                    onStart={this.startAudio}
                    //onPlay={this.handlePlay}
                    //onPause={this.handlePause}
                    onBuffer={() => console.log("onBuffer")}
                    onSeek={e => console.log("onSeek", e)}
                    onEnded={this.handleEnded}
                    onError={e => this.handleError(e)}
                    onProgress={this.handleProgress}
                    onDuration={this.handleDuration}
                  />
                </Box>
              </Paper>
            </div>
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
            </Grid>
          </Grid>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(
  withStyles(styles)(inject("rootTree")(observer(AudioTest)))
);
