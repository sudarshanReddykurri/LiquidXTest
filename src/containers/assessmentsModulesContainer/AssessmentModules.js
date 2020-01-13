import React, { Component } from "react";
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

const screens = {
  LOADING: "loading_screen",
  SHOWMODULES: "show_modules_screen",
  ACTIVATETIMER: "show_activate_timer_screen",
  DEACTIVATETIMER: "show_deactivate_timer_screen"
};

const GameData = Modules;
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

class AssessmentModules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gamenumber: 1,
      open: false,
      currentScreenName: "loading_screen",
      activationTime: -1,
      expiryTime: -1
    };
    this.onActivateAssessments = this.onActivateAssessments.bind(this);
    this.fetchAssessmentModules();
  }
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
          user.currentAssessment.setup_games(
            game_play_order,
            games_to_play,
            completed_games,
            activation_time,
            end_date
          );
        }
        Game_Play.length = 0;

        user.currentAssessment.getGamePlayOrder().map(game_key => {
          Game_Play.push(GameData[game_key]);
        });
        console.log(
          "TCL: AssessmentModules -> fetchAssessmentModules -> Game_Play.length",
          Game_Play.length
        );
        this.moveToScreenBasedOnTimeValidation();
        // this.setState({
        //   currentScreenName: "show_modules_screen"
        // });
      });
  }

  onUserLogout = () => {
    console.log("onUserLogout");
    //let hello = localStorage.getItem("@rootStoreKey");
    //console.log("TCL: AssessmentHomeContainer -> onUserLogout -> hello", hello.user);
    authService.logout().then(res => {
      console.log("TCL: AssessmentModules -> onUserLogout -> res", res);
      this.props.history.push("/login");
    });
  };

  handleClickOpen(index) {
    console.log("index value : " + index);
    this.setState({
      gamenumber: index,
      open: true
    });
  }

  handleClose = () => {
    this.setState({
      open: false
    });
  };

  onActivateAssessments(){
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
    return (
      <Grid container spacing={4}>
        {Game_Play.map((Game, index) => (
          <Grid item key={Game} xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.cardMedia}
                image={Game.module_icon_path}
                title="Image title"
              />
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  {Game.module_name}
                </Typography>
              </CardContent>
              <CardActions style={{ justifyContent: "center" }}>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => this.handleClickOpen(index)}
                >
                  Start Game
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
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
            {/* Hero unit */}
            <div className={classes.heroContent}></div>
            <Container className={classes.cardGrid} maxWidth="md">
              {/* End hero unit */}
              {this.getScreen(this.state.currentScreenName)}
            </Container>
            <Dialog
              fullScreen
              open={this.state.open}
              onClose={this.handleClose}
              TransitionComponent={Transition}
            >
              <AppBar className={classes.appBar}>
                <Toolbar>
                  <Typography variant="h5" className={classes.title}>
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
            </Dialog>
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
    paddingTop: "56.25%" // 16:9
  },
  cardContent: {
    flexGrow: 1
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
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  link: {
    margin: theme.spacing(1, 1.5)
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6)
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
