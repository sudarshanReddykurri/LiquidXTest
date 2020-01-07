import React, { Component } from "react";
import {
  AppBar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  CssBaseline,
  Grid,
  Toolbar,
  Typography,
  makeStyles,
  Link,
  Slide,
  Dialog
} from "@material-ui/core";
// import Logo from "../assets/4-04.png";
import NavBar from "../../shared/NavBar";
import ReactUnityBridge from "./reactUnityBridge";
import { Modules } from "./gameModules";
import { height, width } from "@material-ui/system";

const useStyles = makeStyles(theme => ({
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
}));
const GameData = Modules;

let game_play_order = [
  "mob-01",
  "mob-06",
  "mob-05",
  "mob-02",
  // "mob-12",
  "mob-11",
  "mob-10",
  "mob-09",
  "mob-08",
  "mob-03",
  "mob-07",
  "mob-04"
];

let Game_Play = [];
class AssessmentModules extends Component {
  constructor(props) {
    super(props);
    this.state = { gamenumber: 0 };
  }
  componentWillMount = () => {
    game_play_order.map(game_key => {
      Game_Play.push(GameData[game_key]);
    });
    console.log("HELLO " + Game_Play.length);
  };

  render() {
    return (
      <div>
        <Main_UI />
      </div>
    );
  }
}

export default AssessmentModules;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function FullScreenDialog() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  function handleClickOpen() {
    //setState({ gamenumber: num})
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open full-screen dialog
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h5" className={classes.title}>
              PerspectAI
            </Typography>
            <Button color="inherit" onClick={handleClose}>
              Close
            </Button>
          </Toolbar>
        </AppBar>
        <Container>
          <Typography component="h1" variant="h5">
            Unity Game will load here
          </Typography>
        </Container>
      </Dialog>
    </div>
  );
}

function Main_UI() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [gamenumber, setIndex] = React.useState(1);
  function handleClickOpen(index) {
    console.log("index value : " + index);
    setIndex(index);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }
  return (
    <React.Fragment>
      <CssBaseline />
      <NavBar />
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Hello, Tony
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              You have been assigned to play the following games by your
              organization. Make sure you are in a suitable environment to take
              the assessment.
            </Typography>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}

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
                      onClick={() => handleClickOpen(index)}
                    >
                      Start Game
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <Typography variant="h5" className={classes.title}>
                PerspectAI
              </Typography>
              <Button color="inherit" onClick={handleClose}>
                Close
              </Button>
            </Toolbar>
          </AppBar>
          <Container>
            <ReactUnityBridge intValue={gamenumber} />
          </Container>
        </Dialog>
      </main>
    </React.Fragment>
  );
}
