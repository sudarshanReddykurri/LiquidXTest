import React from "react";
import { Switch, Route, Link } from "react-router-dom";

import {
  AppBar,
  Button,
  IconButton,
  SvgIcon,
  Toolbar,
  Typography,
  withStyles
} from "@material-ui/core";
import { AccountCircle, MenuIcon } from "@material-ui/icons";

const styles = theme => ({
  root: { flexGrow: 1 },
  flex: { flex: 1 },
  menuButton: { marginLeft: -2, marginRight: 20 },
  marginRight: { marginRight: 2 }
});

const NavBar = ({ classes, onLogOut }) => {
  return (
    <div className={classes.root}>
      {" "}
      <AppBar position="fixed">
        {" "}
        <Toolbar>
          {" "}
          <IconButton
          className={classes.menuButton}
          color="inherit"
          aria-label="Menu"
        >
          {" "}
          {/* <MenuIcon />{" "} */}
        </IconButton>{" "}
          <Typography variant="h6" color="inherit" className={classes.flex}>
            {" "}
            PerspectAI{" "}
          </Typography>{" "}
          <Button color="inherit" component={Link} to="/home">
            Assessments
          </Button>{" "}
          {/* <Button color="inherit" component={Link} to="/about">
            About
          </Button>{" "} */}
          {/* <Button color="inherit" onClick={onLogOut}>
            Logout
          </Button>{" "} */}
          <IconButton
          className={classes.marginRight}
            edge="end"
            aria-label="account of current user"
            aria-controls={"primary-search-account-menu"}
            // onClick={handleProfileMenuOpen}
            color="inherit"
            component={Link}
            to="/about"
          >
            <AccountCircle />
          </IconButton>
          <IconButton
          className={classes.marginRight}
            edge="end"
            aria-label="Logout"
            // onClick={handleProfileMenuOpen}
            color="inherit"
            onClick={onLogOut}
          >
            <SvgIcon>
              <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
            </SvgIcon>
          </IconButton>
        </Toolbar>{" "}
      </AppBar>{" "}
    </div>
  );
};

export default withStyles(styles)(NavBar);
