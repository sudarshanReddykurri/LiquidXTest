import React, { Component, Fragment } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
  Container,
  CssBaseline,
  Divider,
  Grid,
  Paper,
  SvgIcon,
  Typography,
  withStyles,
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import DescriptionIcon from "@material-ui/icons/Description";
import { flexbox } from "@material-ui/system";
import { deepOrange, deepPurple } from "@material-ui/core/colors";
import { withRouter } from "react-router-dom";
import NavBar from "../shared/NavBar";
import authService from "../services/auth/authService";
import { initGA, PageViewOnlyPath, Event } from "../analytics/Tracking";

const styles = (theme) => ({
  card: {
    maxWidth: 450,
    margin: "auto",
    transition: "0.3s",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
      boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
    },
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    flexGrow: 1,
  },
  avatar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: theme.spacing.unit * 3,
  },
  margin: {
    margin: theme.spacing(1),
  },
  media: {
    paddingTop: "56.25%",
  },
  content: {
    textAlign: "center",
    padding: theme.spacing.unit * 3,
  },
  divider: {
    margin: `${theme.spacing.unit * 1}px 0`,
  },
  heading: {
    fontWeight: "bold",
  },
  subheading: {
    lineHeight: 1.8,
  },
  avatar: {
    display: "inline-block",
    border: "2px solid white",
    "&:not(:first-of-type)": {
      marginLeft: -theme.spacing.unit,
    },
  },
  controls: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 3, 2, 3),
    justifyContent: "space-between",
  },
  logout: {},
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
  large: {
    width: theme.spacing(9),
    height: theme.spacing(9),
    fontSize: 28,
  },
});

class AboutContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "demo",
      emailId: "demo@gmail.com",
      number: "9191919191",
    };
    // console.log("this.props.rootTree",this.props)
  }

  onUserLogout = () => {
    console.log("onUserLogout");
    //let hello = localStorage.getItem("@rootStoreKey");
    //console.log("TCL: AssessmentHomeContainer -> onUserLogout -> hello", hello.user);
    authService.logout().then((res) => {
      console.log("TCL: AssessmentHomeContainer -> onUserLogout -> res", res);
      Event("USER", "User logged out in about screen", "AboutContainer");
      this.props.history.push("/login");
      PageViewOnlyPath("/login");
      window.location.reload();
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <CssBaseline />
        <NavBar onLogOut={this.onUserLogout} />
        <Container className={classes.cardGrid}>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justify="center"
            style={{ minHeight: "80vh" }}
          >
            <Grid item xs={12}>
              <div className="App">
                <Card className={classes.card}>
                  <br />
                  <br />
                  <div className={classes.avatar}>
                    <Avatar className={[classes.purple, classes.large]}>
                      {this.props.rootTree.user.fullName.charAt(0)}
                    </Avatar>
                  </div>
                  {/* <CardMedia
                className={classes.media}
                image={
                  "https://image.freepik.com/free-photo/river-foggy-mountains-landscape_1204-511.jpg"
                }
              /> */}
                  <CardContent className={classes.content}>
                    <Typography
                      className={"MuiTypography--heading"}
                      variant={"h6"}
                      gutterBottom
                    >
                      Profile Details
                    </Typography>
                    {/* <Typography
              className={"MuiTypography--subheading"}
              variant={"caption"}
            >
              We are going to learn different kinds of species in nature that live
              together to form amazing environment.
            </Typography>
            <Divider className={classes.divider} light /> */}
                  </CardContent>
                  <div className={classes.controls}>
                    <Typography
                      className={"MuiTypography-body1"}
                      variant={"caption"}
                      align="left"
                    >
                      Name
                    </Typography>
                    <Typography
                      className={"MuiTypography--subheading"}
                      variant={"caption"}
                      align="right"
                    >
                      {this.props.rootTree.user.fullName}
                    </Typography>
                  </div>
                  {/* <Divider className={classes.divider} light /> */}
                  <div className={classes.controls}>
                    <Typography
                      className={"MuiTypography--subheading"}
                      variant={"caption"}
                      align="left"
                    >
                      Email
                    </Typography>
                    <Typography
                      className={"MuiTypography--subheading"}
                      variant={"caption"}
                      align="right"
                    >
                      {this.props.rootTree.user.emailId}
                      {/* {this.state.emailId} */}
                    </Typography>
                  </div>
                  {/* <Divider className={classes.divider} light /> */}
                  <div className={classes.controls}>
                    <Typography
                      className={"MuiTypography--subheading"}
                      variant={"caption"}
                      align={"left"}
                    >
                      Mobile
                    </Typography>
                    <Typography
                      className={"MuiTypography--subheading"}
                      variant={"caption"}
                      align="right"
                    >
                      {this.props.rootTree.user.mobileNo}
                    </Typography>
                  </div>
                  <Box align="center">
                    <Button
                      onClick={this.onUserLogout}
                      variant="outlined"
                      color="primary"
                      size="small"
                      className={[classes.button, classes.margin]}
                      startIcon={
                        <SvgIcon>
                          <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
                        </SvgIcon>
                      }
                    >
                      Logout
                    </Button>
                  </Box>
                  <br />
                  <br />
                </Card>
              </div>
            </Grid>
          </Grid>
        </Container>
        {/* <StickyFooter /> */}
      </Fragment>
    );
  }
}

export default withRouter(
  withStyles(styles)(inject("rootTree")(observer(AboutContainer)))
);
