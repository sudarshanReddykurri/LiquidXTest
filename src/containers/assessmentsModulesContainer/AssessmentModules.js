import React, { Component, Fragment } from "react";
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
  withStyles
} from "@material-ui/core";
// import Logo from "../assets/4-04.png";
import NavBar from "../../shared/NavBar";
import ReactUnityBridge from "./reactUnityBridge";
import { Modules } from "./gameModules";
import { height, width } from "@material-ui/system";
import authService from "../../services/auth/authService";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import apiCall from "../../services/apiCalls/apiService";
import CountDownCard from "../../components/CountDownCard";
import GameCard from "../../components/GameCard";

const screens = {
  LOADING: "loading_screen",
  SHOWMODULES: "show_modules_screen",
  ACTIVATETIMER: "show_activate_timer_screen",
  DEACTIVATETIMER: "show_deactivate_timer_screen"
};

// const GameData = Modules;
let timerId;
let game_play_order = [
  "mob-01",
  "mob-06",
  "mob-05",
  "mob-02",
  "mob-12",
  "mob-11",
  "mob-10",
  "mob-09",
  "mob-08",
  "mob-03",
  "mob-07",
  "mob-04"
];

let not_supported_games = ["mob-12", "mob-20"];

let Game_Play = [];
let game_to_unlock = "";

const module_data = Modules;
let history = "";
class AssessmentModules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gamenumber: 1,
      open: false,
      currentScreenName: "loading_screen",
      activationTime: -1,
      expiryTime: -1,
      final_module_data: []
    };
    this.onActivateAssessments = this.onActivateAssessments.bind(this);
    console.log("history state before", this.props.history.location.state);
    if (
      this.props.history.location.state &&
      this.props.history.location.state.from === "/game"
    ) {
      console.log("history state after", this.props.history.location.state);
    }
    console.log(
      "TCL: AssessmentModules -> constructor -> localStorage.getItem('reset_game')",
      localStorage.getItem("reset_game")
    );

    // let refresh_page = localStorage.getItem("reset_game");
    // if (refresh_page === true) {
    //   console.log(
    //     "TCL: AssessmentModules -> constructor -> refresh_page",
    //     refresh_page
    //   );
    //   localStorage.setItem("reset_game", false);
    //   setTimeout(() => {
    //     window.location.reload();
    //   }, 10000);
    // } else {
    //   this.fetchAssessmentModules();
    // }
    this.fetchAssessmentModules();
  }

  // componentDidUpdate(prevProps) {
  //   // will be true
  //   const locationChanged =
  //     this.props.location.state !== prevProps.location.state;
  //     console.log("TCL: AssessmentModules -> componentDidUpdate -> prevProps.location", prevProps.location)
  //     console.log("TCL: AssessmentModules -> componentDidUpdate -> this.props.location", this.props.location)

  //     if(locationChanged)
  //       window.location.reload();
  //   // // INCORRECT, will *always* be false because history is mutable.
  //   // const locationChanged =
  //   //   this.props.history.location !== prevProps.history.location;
  // }

  componentWillMount = () => {
    // Game_Play.length = 0;
    // game_play_order.map(game_key => {
    //   Game_Play.push(GameData[game_key]);
    // });
    // console.log("HELLO " + Game_Play.length);
  };

  fetchAssessmentModules() {
    const { user } = this.props.rootTree;
    apiCall
      .getAssessmentModules(user.userId, user.currentAssessment.assessmentId)
      .then(res => {
        console.log(
          "TCL: AssessmentModules -> fetchAssessmentModules -> res",
          res.data,
          user.userId,
          user.currentAssessment.assessmentId
        );
        if (res.status == 200) {
          const {
            game_play_order,
            games_to_play,
            completed_games,
            activation_time,
            end_date
          } = res.data;
          user.currentAssessment.clear_games();
          user.currentAssessment.setup_games(
            game_play_order,
            games_to_play,
            completed_games,
            activation_time,
            end_date
          );
          setTimeout(() => {
            this.setModuleOrder();
          }, 200);
        }
      });
  }

  setModuleOrder() {
    const { currentAssessment } = this.props.rootTree.user;
    let temp_module_data = [];
    // user played all the games check
    if (
      currentAssessment.game_play_order.length ==
      currentAssessment.complete_games.length
    ) {
      game_to_unlock = "";
    } else {
      game_to_unlock = currentAssessment.games_to_play[0];
    }
    console.log(
      "TCL: AssessmentModules -> setModuleOrder -> game_to_unlock",
      game_to_unlock
    );
    currentAssessment.game_play_order.map(game_key => {
      console.log(" module_data[game_key]" + game_key);
      let complete_game_index_found = currentAssessment.complete_games.indexOf(
        game_key
      );
      let games_to_unlock_index_found = -1;
      if (game_to_unlock === game_key) {
        games_to_unlock_index_found = 0;
      } else {
        games_to_unlock_index_found = -1;
      }
      if (complete_game_index_found != -1) {
        module_data[game_key]["module_status"] = "completed";
      } else if (games_to_unlock_index_found != -1) {
        module_data[game_key]["module_status"] = "unlocked";
      } else {
        module_data[game_key]["module_status"] = "locked";
      }
      temp_module_data.push(module_data[game_key]);
    });
    //currentAssessment.update_games_to_play(temp_module_data);
    this.state.final_module_data.length = 0;
    this.setState({
      final_module_data: this.state.final_module_data.concat(temp_module_data)
    });
    console.log(
      "TCL: AssessmentModules -> setModuleOrder -> this.state.final_module_data",
      this.state.final_module_data
    );
    this.moveToScreenBasedOnTimeValidation();
  }

  onUserLogout = () => {
    console.log("onUserLogout");
    //let hello = localStorage.getItem("@rootStoreKey");
    //console.log("TCL: AssessmentHomeContainer -> onUserLogout -> hello", hello.user);
    authService.logout().then(res => {
      console.log("TCL: AssessmentModules -> onUserLogout -> res", res);
      this.props.history.push("/login");
      window.location.reload();
    });
  };

  handleClickOpen(index) {
    console.log("index value : " + index);
    const { currentAssessment } = this.props.rootTree.user;
    currentAssessment.update_current_game(
      this.state.final_module_data[index]["key"]
    );
    console.log(
      "TCL: AssessmentModules -> handleClickOpen -> this.state.final_module_data[index]['key']",
      this.state.final_module_data[index]["key"]
    );
    this.props.history.push("/game");

    // this.setState({
    //   gamenumber: index,
    //   open: true
    // });
  }

  handleClose = () => {
    this.setState({
      open: false
    });
  };

  onActivateAssessments() {
    this.moveToScreenBasedOnTimeValidation();
  }

  epochTimeToHumanReadableTime(expiryTime) {
    if (timerId) {
      clearInterval(timerId);
    }

    timerId = setInterval(() => {
      const expiryDate = new Date(expiryTime * 1000);
      const now = new Date();
      const res = Math.abs(expiryDate - now) / 1000;
      const timeLeft = expiryTime * 1000 - now.getTime();
      const NoData = timeLeft <= 0;
      const seconds = NoData ? "-" : Math.floor(res % 60);
      const minutes = NoData ? "-" : Math.floor(res / 60) % 60;
      const hours = NoData ? "-" : Math.floor(res / 3600) % 24;
      const days = NoData ? "-" : Math.floor(res / 86400);
      this.setState({
        expiryTime:
          days + " d  " + hours + " h  " + minutes + " m  " + seconds + " s  "
      });
      console.log("timerId", timerId);
      if (timeLeft <= 0) {
        console.log("clear time");
        clearInterval(timerId);
        this.onExpired();
      }
    }, 1000);
  }

  moveToScreenBasedOnTimeValidation() {
    const { currentAssessment } = this.props.rootTree.user;
    let screenToRender = "loading_screen";
    if (
      currentAssessment.activationTime * 1000 > new Date().getTime() &&
      currentAssessment.activationTime != -1
    ) {
      screenToRender = "show_activate_timer_screen";
    } else if (
      currentAssessment.expiryTime * 1000 < new Date().getTime() &&
      currentAssessment.expiryTime != -1
    ) {
      screenToRender = "show_deactivate_timer_screen";
    } else {
      // this.props.activateTimerInAssessmentScreen(true);
      // this.props.updateExpiryTimeInAssessmentScreen(this.state.expiryTime);
      screenToRender = "show_modules_screen";
    }

    console.log("screenToRender", screenToRender);
    this.setState({
      currentScreenName: screenToRender
    });
  }

  showLoader() {
    const { classes } = this.props;
    return (
      <Box className={classes.progressBar}>
        <Typography className={classes.pageTitle} component="h1" align="center">
          <Box fontWeight="fontWeightBold" fontSize={24}>
            <CircularProgress /> Loading Modules
          </Box>
        </Typography>
        <br />
        <Typography align="center">
          <Box fontWeight="fontWeightRegular" fontSize={16}>
            Please wait while we are loading the modules
          </Box>
        </Typography>
      </Box>
    );
  }

  showModules() {
    const { classes } = this.props;
    //const { games_to_play } = this.props.rootTree.user.currentAssessment;
    return (
      <Fragment>
        <Typography align="center" component="h1">
          <Box fontWeight="fontWeightBold" fontSize={24}>
            Assigned Modules
          </Box>
        </Typography>
        <br />
        <Typography align="center" component="body2">
          <Box fontWeight="fontWeightRegular">
            Assessments are timed. Try to finish all the assessment alloted to you with in the time. 
            {/* Your assessment will expire in 12/09/2020 */}
          </Box>
        </Typography>
        <br />
        <Grid container spacing={4}>
          {this.state.final_module_data.map((Game, index) => (
            <Grid item key={Game} xs={12} sm={6} md={4}>
              <GameCard
                key={index}
                icon_path={Game.module_icon_path}
                assessmentName={Game.module_name}
                card_status={Game.module_status}
                is_module_supported={
                  Game.module_source === "unity" ? true : false
                }
                // classes={classes}
                onPress={() => this.handleClickOpen(index)}
              ></GameCard>
            </Grid>
          ))}
        </Grid>
      </Fragment>
    );
  }

  showActivateTimerScreen() {
    const { classes, rootTree } = this.props;
    return (
      <CountDownCard
        title={`Your assessments will be unlocked in`}
        data={rootTree.user.currentAssessment.activationTime}
        timerFinishCallback={this.onActivateAssessments}
        disclaimer={`** Please re-visit the app when your assessments are unlocked.`}
      ></CountDownCard>
    );
  }

  showDeactivatedScreen() {
    const { classes } = this.props;
    return (
      <Box className={classes.progressBar}>
        <Typography className={classes.pageTitle} component="h1" align="center">
          <Box fontWeight="fontWeightBold" fontSize={24}>
            Your assessments have expired.
          </Box>
        </Typography>
        <br />
        <Typography align="center">
          <Box fontWeight="fontWeightRegular" fontSize={16}>
            You no longer have access to the assessments assigned to you. Please
            contact your administrator in case of any questions.
          </Box>
        </Typography>
      </Box>
    );
  }

  getScreen(level_name) {
    // Here we can set the template to render based on level_name
    switch (level_name) {
      case screens.LOADING:
        return this.showLoader();
      case screens.SHOWMODULES:
        return this.showModules();
      case screens.ACTIVATETIMER:
        return this.showActivateTimerScreen();
      case screens.DEACTIVATETIMER:
        return this.showDeactivatedScreen();
      default:
        return <div>Something went wrong. Please try later</div>;
    }
  }

  render() {
    const { classes, rootTree } = this.props;
    return (
      <div>
        <NavBar onLogOut={this.onUserLogout} />
        <React.Fragment>
          <CssBaseline />

          <main>
          <div className={classes.heroContent}></div>
            <Container className={classes.cardGrid} maxWidth="md">
              {this.getScreen(this.state.currentScreenName)}
            </Container>
            {/* <Dialog
              fullScreen
              open={this.state.open}
              onClose={this.handleClose}
              TransitionComponent={Transition}
            >
              <AppBar className={classes.appBar}>
                <Toolbar>
                  <Typography variant="h5" className={classes.logoTitle}>
                    PerspectAI
                  </Typography>
                  <Button color="inherit" onClick={this.handleClose}>
                    Close
                  </Button>
                </Toolbar>
              </AppBar>
              <Container>
                <ReactUnityBridge intValue={this.state.gamenumber} />
              </Container>
            </Dialog> */}
          </main>
        </React.Fragment>
      </div>
    );
  }
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const styles = theme => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  /* heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6)
  }, */
  heroButtons: {
    marginTop: theme.spacing(4)
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    height: "180px",
    paddingTop: "10px" // 16:9
  },
  cardContent: {
    flexGrow: 1,
    justifyContent: "center",
    margin: "auto"
  },
  /*  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6)
  }, */
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    },
    ul: {
      margin: 0,
      padding: 0
    },
    li: {
      listStyle: "none"
    }
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    position: "relative"
  },
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  toolbarTitle: {
    flexGrow: 1
  },
  logoTitle: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  link: {
    margin: theme.spacing(1, 1.5)
  },
  heroContent: {
    padding: theme.spacing(1, 0, 6)
  },
  cardHeader: {
    backgroundColor: theme.palette.grey[200]
  },
  cardPricing: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: theme.spacing(2)
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6)
    }
  }
});

export default withRouter(
  withStyles(styles)(inject("rootTree")(observer(AssessmentModules)))
);
