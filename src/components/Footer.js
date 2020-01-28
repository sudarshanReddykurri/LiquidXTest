// https://material-ui.com/components/material-icons/#material-icons
import React, { Component } from "react";
import {
  Box,
  ButtonBase,
  Grid,
  IconButton,
  Paper,
  SvgIcon,
  Typography,
  withStyles
} from "@material-ui/core";
import TwitterIcon from "@material-ui/icons/Twitter";
import FacebookIcon from "@material-ui/icons/Facebook";
import YouTubeIcon from "@material-ui/icons/YouTube";
import InstagramIcon from "@material-ui/icons/Instagram";
import LinkedInIcon from '@material-ui/icons/LinkedIn';
const StoreImages = [
  {
    image: require("../assets/images/google-play-badge.png"),
    title: "PlayStore",
    url: "https://play.google.com/store/apps/details?id=com.loopreality.perspectai"
  },
  {
    image: require("../assets/images/appstore-badge.png"),
    title: "AppStore",
    url: "https://apps.apple.com/us/app/perspectai/id1449024326"
  }
];
// https://www.linkedin.com/showcase/perspectai/
const SocialMedia = [
  {
    platform: "Facebook",
    snippet: <FacebookIcon style={{ color: "#3b5998" }} />,
    url: "https://www.facebook.com/PerspectAI/",
    color: "#3b5998"
  },
  {
    platform: "Twitter",
    snippet: <TwitterIcon style={{ color: "#00aced" }} />,
    url: "https://twitter.com/perspectAI",
    color: "#00aced"
  },
  //   {
  //     platform: "Youtube",
  //     snippet: <YouTubeIcon style={{color: '#ff3033'}} />,
  //     url: "",
  //     color: "#ff3033"
  //   },
  {
      platform: "Linkedin",
      snippet: <LinkedInIcon style={{ color: "#0077b5" }} />,
      url: "https://www.linkedin.com/showcase/perspectai/",
      color:"#0077b5"
  },
  {
    platform: "Instagram",
    snippet: <InstagramIcon style={{ color: "#C13584" }} />,
    url: "https://www.instagram.com/perspectai/",
    color: "#C13584"
  }
];

const styles = theme => ({
  root: {
    //backgroundColor: "#222222"
    // padding: theme.spacing(10)
  },
  titleBox: {
    padding: theme.spacing(3, 0, 3, 0)
  },
  image: {
    width: "100%",
    height: 50
  },
  imageSrc: {
    width: "100% !important",
    aspectRatio: 1
  },
  paper: {
    position: "relative",
    textAlign: "center",
    color: theme.palette.text.secondary,
    width: "100%",
    height: 50
  }
});

class Footer extends Component {
  constructor(props) {
    super(props);
  }

  navigateToExternalPage(url) {
    window.open('','_new').location.href=url;
  }

  render() {
    // Styling
    const { classes, rootTree } = this.props;
    return (
      <div className={classes.root}>
        <Box align="center" className={classes.titleBox}>
          <Typography
            className={"MuiTypography-body1"}
            variant={"subtitle1"}
            align="center"
          >
            MOBILE APPS
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {StoreImages.map(image => (
            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <ButtonBase
                  focusRipple
                  key={image.title}
                  className={classes.image}
                  onClick={() => this.navigateToExternalPage(image.url)}
                >
                  <img src={image.image} className={classes.imageSrc}></img>
                </ButtonBase>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <br />
        <Box align="center" className={classes.titleBox}>
          <Typography
            className={"MuiTypography-body1"}
            variant={"subtitle1"}
            align="center"
          >
            STAY IN TOUCH
          </Typography>
        </Box>
        <Box align="center">
        <Grid container spacing={0}>
          {SocialMedia.map(media => (
            <Grid item xs={3}>
              <IconButton
                className={classes.marginRight}
                edge="end"
                aria-label="Logout"
                onClick={() => this.navigateToExternalPage(media.url)}
                color="inherit"
              >
                {media.snippet}
              </IconButton>
            </Grid>
          ))}
        </Grid>
        </Box>
      </div>
    );
  }
}

export default withStyles(styles)(Footer);
