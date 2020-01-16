import React from "react";
import { Switch, Route, Link } from "react-router-dom";

import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
  withStyles
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

const styles = theme => ({
  root: { flexGrow: 1 },
  flex: { flex: 1 },
  menuButton: { marginLeft: -12, marginRight: 20 }
});

const NavBar = ({ classes, onLogOut }) => {
  return (
    <div className={classes.root}>
      {" "}
      <AppBar position="fixed">
        {" "}
        <Toolbar>
          {" "}
          {/* <IconButton
          className={classes.menuButton}
          color="inherit"
          aria-label="Menu"
        >
          {" "}
          <MenuIcon />{" "}
        </IconButton>{" "} */}
          <Typography variant="title" color="inherit" className={classes.flex}>
            {" "}
            PerspectAI{" "}
          </Typography>{" "}
          <Button color="inherit" component={Link} to="/home">
            Assessments
          </Button>{" "}
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>{" "}
          <Button color="inherit" onClick={onLogOut}>
            Logout
          </Button>{" "}
        </Toolbar>{" "}
      </AppBar>{" "}
    </div>
  );
};

export default withStyles(styles)(NavBar);
