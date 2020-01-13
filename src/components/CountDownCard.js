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

class CountDownCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeLeft: 0
    };
  }

  componentDidMount() {
    this.updateTimeLeft();
    if (this.props.data) {
      this.timer = setInterval(() => {
        this.updateTimeLeft();
      }, 1000);
    } else {
      this.setState({ timeLeft: 0 });
    }
  }

  updateTimeLeft() {
    const now = new Date();
    const timeLeft = this.props.data * 1000 - now.getTime();
    console.log("Time:" + now.getTime());
    console.log("timeLeft:" + timeLeft);
    if (timeLeft <= 0) {
      clearInterval(this.timer);
      console.log("Timer Cleared");
      // Send back callback event here
      this.props.timerFinishCallback();
    }
    this.setState({ timeLeft });
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { classes } = this.props;
    const { timeLeft } = this.state;

    const checkDate = new Date(this.props.data * 1000);
    const now = new Date();
    const res = Math.abs(checkDate - now) / 1000;

    const seconds = Math.floor(res % 60);
    const minutes = Math.floor(res / 60) % 60;
    const hours = Math.floor(res / 3600) % 24;
    const days = Math.floor(res / 86400);
    const NoData = timeLeft <= 0;
    return (
      <Box className={classes.progressBar}>
        <Typography className={classes.pageTitle} component="h1" align="center">
          <Box fontWeight="fontWeightBold" fontSize={24}>
            {this.props.title}
          </Box>
        </Typography>
        <br />
        <Typography align="center">
          <Box fontWeight="fontWeightRegular" fontSize={16}>
            {days +
              "days" +
              hours +
              "hours" +
              minutes +
              "minutes" +
              seconds +
              "seconds"}
            {/* You no longer have access to the assessments assigned to you. Please
            contact your administrator in case of any questions. */}
          </Box>
        </Typography>
        <Typography align="center">
          <Box fontWeight="fontWeightRegular" fontSize={12}>
            {this.props.disclaimer}
          </Box>
        </Typography>
      </Box>
    );
  }
}

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

export default withStyles(styles)(CountDownCard);
