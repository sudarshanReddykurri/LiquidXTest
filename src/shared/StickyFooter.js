import React from "react";
import {
  Container,
  CssBaseline,
  Link,
  Typography,
  withStyles
} from "@material-ui/core";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://perspect.ai/">
        Perspect AI
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const styles = theme => ({
  root: {
    // position: "fixed",
    // left: 0,
    // bottom: 0,
    width: "100%",
    // minHeight: "38vh"
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2)
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: "auto",
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.grey[800]
        : theme.palette.grey[200]
  }
});

const StickyFooter = withStyles(styles)(({ classes }) => (
  <div className={classes.root}>
    <CssBaseline />
    {/* <Container component="main" className={classes.main} maxWidth="sm">
      <Typography variant="h2" component="h1" gutterBottom>
        Sticky footer
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        {"Pin a footer to the bottom of the viewport."}
        {"The footer will move as the main element of the page grows."}
      </Typography>
      <Typography variant="body1">Sticky footer placeholder.</Typography>
    </Container> */}
    <footer className={classes.footer}>
      <Container maxWidth="sm">
        <Typography variant="body1" align="center">
         All rights reserved
        </Typography>
        <Copyright />
      </Container>
    </footer>
  </div>
));

export default StickyFooter;