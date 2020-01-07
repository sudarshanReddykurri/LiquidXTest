import React from "react";
import { Link } from "react-router-dom";
import { Grid, Typography, withStyles } from "@material-ui/core";
import filter from "../assets/images/filter.svg";

const styles = theme => ({
  root: {
    padding: theme.spacing(2)
  },
  content: {
    paddingTop: 150,
    textAlign: "center"
  },
  image: {
    margin: "auto",
    marginTop: 50,
    display: "block",
    position: "relative",
    width: 200,
    height: 200
  }
});

const NotFound = withStyles(styles)(({ classes }) => (
  <div className={classes.root}>
    <Grid container justify="center" spacing={4}>
      <Grid item lg={6} xs={12}>
        <div className={classes.content}>
          <Typography variant="h2">404 page not found</Typography>
          <br />
          <Typography variant="subtitle2">
            We are sorry but the page you are looking for does not exist.
          </Typography>
          <img alt="Error Image" className={classes.image} src={filter} />
          <br />
          <br />
          <Typography variant="subtitle2">
            <Link to="/">Return to Home Page</Link>
          </Typography>
        </div>
      </Grid>
    </Grid>
  </div>
));

export default NotFound;


// Note:

// xs >= 0px
// sm >= 600px
// md >= 960px
// lg >= 1280px
// xl >= 1920px
