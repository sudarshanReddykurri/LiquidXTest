import React, { Component } from "react";
import {
  Avatar,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Grid,
  Paper,
  Typography,
  withStyles
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import DescriptionIcon from "@material-ui/icons/Description";
import { flexbox } from "@material-ui/system";
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
  card: {
    maxWidth: 345,
    margin: "auto",
    transition: "0.3s",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
      boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
    }
  },
  avatar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: theme.spacing.unit * 3
  },
  media: {
    paddingTop: "56.25%"
  },
  content: {
    textAlign: "center",
    padding: theme.spacing.unit * 3
  },
  divider: {
    margin: `${theme.spacing.unit * 1}px 0`
  },
  heading: {
    fontWeight: "bold"
  },
  subheading: {
    lineHeight: 1.8
  },
  avatar: {
    display: "inline-block",
    border: "2px solid white",
    "&:not(:first-of-type)": {
      marginLeft: -theme.spacing.unit
    }
  },
  controls: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 3, 2, 3),
    justifyContent: "space-between"
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
  large: {
    width: theme.spacing(9),
    height: theme.spacing(9),
  }
});

class AboutContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "demo",
      emailId: "demo@gmail.com",
      number: "9191919191"
    };
   // console.log("this.props.rootTree",this.props)
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid
        container
        spacing={0}
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={6}>
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
                  Your Account
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
            </Card>
          </div>
        </Grid>
      </Grid>
    );
  }
}

// export default withRouter(withStyles(styles)((observer(AboutContainer))));

export default withRouter(withStyles(styles)(inject("rootTree")(observer(AboutContainer))))
