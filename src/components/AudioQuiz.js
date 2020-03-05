import React, { Component } from "react";
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
  List,
  Paper,
  Slider,
  Typography,
  withStyles
} from "@material-ui/core";

const styles = theme => ({
  roundedButton: {
    borderRadius: 25,
    padding: theme.spacing(1, 3),
    textTransform: "capitalize"
  },
  flexRowCenter: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  }
});

let questionIds = [];
let userResponses = [];
class AudioQuiz extends Component {
  constructor(props) {
    super(props);
    this.qno = 0;

    this.state = {
      tempResponses: [],
      // userResponses: [],
      totalTime: 0
    };

    this.unSubscribeTimer = null;
  }

  componentDidMount() {
    userResponses = [];
    questionIds = [];
    this.props.questions.map(function(item, index) {
      userResponses[index] = "";
    });

    this.setState(
      {
        totalTime: this.props.questions.length * 15
      },
      () => {
        this.unSubscribeTimer = setInterval(() => {
          if (this.state.totalTime === 1) {
            this.setState({
              totalTime: 0
            });
            if (this.unSubscribeTimer) clearInterval(this.unSubscribeTimer);
            this.submitResponses();
          } else {
            this.setState({
              totalTime: this.state.totalTime - 1
            });
          }
        }, 1000);
      }
    );
  }

  componentWillMount() {
    userResponses = [];
    questionIds = [];
    // this.setState({
    //   totalTime: this.props.questions.length * 20
    // })
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  componentWillUnmount() {
    if (this.unSubscribeTimer) clearInterval(this.unSubscribeTimer);
  }

  submitResponses() {
    if (this.unSubscribeTimer) {
      this.setState({
        totalTime: 0
      });
      clearInterval(this.unSubscribeTimer);
    }
    // this.setState({
    //   totalTime:0,

    // })
    this.props.responses(userResponses, questionIds);
    questionIds = [];
    userResponses = [];
  }

  render() {
    const { classes } = this.props;
    let _this = this;
    return (
      <React.Fragment>
        {" "}
        <div
          style={{
            height: "100%"
          }}
        >
          <Paper
            elevation={2}
            style={{
              PaddingTop: 0,
              height: "20%",
              borderRadius: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Typography
                variant="body2"
                style={{ color: "#000", marginRight: 10 }}
              >
                Time left to answer
              </Typography>
              <Typography
                style={{
                  marginTop: 0
                }}
                color="primary"
              >
                <Box fontWeight={800}>{this.state.totalTime} Secs</Box>
              </Typography>
            </div>
            <Typography
              variant="body2"
              style={{ color: "#000", marginTop: 20 }}
            >
              <Box align="center">
                Pick the most appropriate option based on the monologue
              </Box>
            </Typography>
          </Paper>
          <List style={{ height: "80%", overflow: "auto", zIndex: 0 }}>
            {_this.props.questions.map(function(itemQuestion, questionIndex) {
              let question = _this.props.questions[questionIndex].question;
              let q_id = _this.props.questions[questionIndex].q_id;
              let question_options =
                _this.props.questions[questionIndex].options;
              questionIds[questionIndex] = q_id;

              const options = Object.keys(question_options).map(
                (item, optionindex) => {
                  let user_res_key = question_options[item];
                  let unique_key =
                    "q" + questionIndex + "-" + "o" + optionindex;
                  return (
                    <Box align="center" key={unique_key}>
                      <Button
                        variant={
                          _this.state.tempResponses[questionIndex] ===
                          unique_key
                            ? "contained"
                            : "outlined"
                        }
                        size="small"
                        className={classes.roundedButton}
                        style={{
                          minWidth: "80%",
                          maxWidth: "80%",
                          marginRight: 10,
                          marginBottom: 10,
                          wordBreak: "break-word",
                          backgroundColor:
                            _this.state.tempResponses[questionIndex] ===
                            unique_key
                              ? "#42A5F5"
                              : "transparent",
                          borderColor: "#42A5F5"
                        }}
                        onClick={() => {
                          console.log(
                            "questionindex",
                            questionIndex,
                            "user_res_key",
                            user_res_key
                          );
                          const newTempResponses = [
                            ..._this.state.tempResponses
                          ];
                          // const newUserResponses = [...userResponses];
                          //   const newQuestionIds = [..._this.state.questionIds];
                          newTempResponses[questionIndex] = unique_key;
                          // newUserResponses[questionIndex] = user_res_key;
                          //  newQuestionIds[questionIndex] = q_id;
                          userResponses[questionIndex] = user_res_key;
                          console.log("userResponses", userResponses);
                          _this.setState({
                            tempResponses: newTempResponses
                            //  userResponses: newUserResponses
                            // questionIds: newQuestionIds
                          });
                        }}
                      >
                        {_this.capitalize(question_options[item])}
                      </Button>
                      <br />
                    </Box>                                                                                                     
                  );
                }
              );
              return (
                <Paper
                  style={{ margin: 20, paddingTop: 20, paddingBottom: 20 }} key={"paper"+"-"+questionIndex}
                >
                  <Box align="center">
                    <Typography
                      variant="body2"
                      style={{
                        color: "#000",
                        marginBottom: 20,
                        wordBreak: "break-word",
                        marginTop: 20,
                        marginLeft: 20,
                        marginRight: 20
                      }}
                    >
                      {question}
                    </Typography>
                    {options}
                  </Box>
                  <br />
                </Paper>
              );
            })}
            <Box className={[classes.flexRowCenter]}>
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => this.submitResponses()}
                className={classes.roundedButton}
                style={{
                  minWidth: 200,
                  marginBottom: 25
                }}
              >
                Submit
              </Button>
            </Box>
          </List>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(AudioQuiz);
