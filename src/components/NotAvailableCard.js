import React from "react";
import PropTypes from "prop-types";
import { Box, ButtonBase } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import RefreshIcon from "@material-ui/icons/Refresh";
import WarningIcon from "@material-ui/icons/Warning";
import Footer from "./Footer";

const styles = theme => ({
  paper: {
    maxWidth: 936,
    margin: "auto",
    overflow: "hidden"
  },
  searchBar: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)"
  },
  searchInput: {
    fontSize: theme.typography.fontSize
  },
  block: {
    display: "block"
  },
  addUser: {
    marginRight: theme.spacing(1)
  },
  contentWrapper: {
    margin: "40px 16px"
  },
  imageSrc: {
    width: 125,
    aspectRatio: 3.4
  }
});

const StoreImages = [
  {
    image: require("../assets/images/google-play-badge.png"),
    title: "PlayStore",
    url:
      "https://play.google.com/store/apps/details?id=com.loopreality.perspectai"
  },
  {
    image: require("../assets/images/appstore-badge.png"),
    title: "AppStore",
    url: "https://apps.apple.com/us/app/perspectai/id1449024326"
  }
];

function NotAvailableCard(props) {
  const { classes } = props;

  return (
    <div
      style={{
        height: "100%"
      }}
    >
      <Paper className={classes.paper}>
        <AppBar
          className={classes.searchBar}
          position="static"
          color="default"
          elevation={0}
        >
          <Toolbar>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <WarningIcon
                  className={classes.block}
                  color="#ff0"
                ></WarningIcon>
              </Grid>
              <Grid item xs>
                <Typography color="textSecondary" align="center">
                  Sorry, this content isn't available in mobile browsers yet
                </Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <div className={classes.contentWrapper}>
          <Typography color="textSecondary" align="center">
            Please take this assessment either by opening the same link in the
            desktop/laptop or try downloading the PerspectAI app from the store.
          </Typography>
          <br />
          <Grid container spacing={2} alignItems="center" justify="center">
            {StoreImages.map(image => (
              <Grid item>
                <ButtonBase
                  focusRipple
                  key={image.title}
                  className={classes.image}
                  onClick={() =>
                    (window.open("", "_new").location.href = image.url)
                  }
                >
                  <img src={image.image} className={classes.imageSrc}></img>
                </ButtonBase>
              </Grid>
            ))}
          </Grid>
        </div>
      </Paper>
    </div>
  );
}

NotAvailableCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NotAvailableCard);
