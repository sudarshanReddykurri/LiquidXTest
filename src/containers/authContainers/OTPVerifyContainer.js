// https://medium.com/@ilonacodes/why-formik-with-react-e640c1934d6
import React, { Component, Fragment } from "react";
import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Container,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  withStyles
} from "@material-ui/core";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import perspectAILogo from "../../assets/images/PerspectAI-Logo.svg";
import apiCall from "../../services/apiCalls/apiService";
import { withRouter } from "react-router-dom";
import AlertDialog from "../../components/AlertDialog";

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(10),
    width: "80%",
    height: "80%"
    // backgroundColor: theme.palette.secondary.main,
  },
  card: {
    width: 345,
    height: 120,
    maxWidth: 345
  },
  media: {
    width: "100%",
    height: "100%"
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
});

const validationSchema = Yup.object().shape({
  otp: Yup.number()
    .required("OTP is a required field")
    .min(6, "Please enter a valid OTP code")
});

class OTPVerifyContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showOTPField: false
    };
  }

  componentDidMount() {
    console.log("{this.props.match.params.id", this.props.match.params.emailId);
    if (
      this.props.history.location.state &&
      this.props.history.location.state.from === "/forgot"
    ) {
      this.setState({
        showOTPField: true
      });
    }
  }

  render() {
    // Styling
    const { classes } = this.props;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <AlertDialog
          ref={alertRef => {
            this.alertRef = alertRef;
          }}
        />
        <div className={classes.paper}>
          {/* <Avatar
        alt="PerspectAI Logo"
        src={perspectAILogo}
        className={classes.avatar}
      /> */}
          {/* <LockOutlinedIcon /> */}
          <img
            src={perspectAILogo}
            alt="PerspectAI Logo"
            class={classes.avatar}
          />
          {/* <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image={require('../../assets/images/PerspectAI-Logo.svg')}
          title="PerspectAI Logo"
        />  
      </Card> */}
          {this.state.showOTPField && (
            <Fragment>
              <Typography component="h1" variant="h5">
                Enter the OTP here
              </Typography>
              <br />
              <Typography variant="subtitle">
                The recovery code is sent to your registered email-id
              </Typography>
              {/* <form className={classes.form} noValidate> */}
                <Formik
                  initialValues={{ otp: "" }}
                  validationSchema={validationSchema}
                  onSubmit={(values, actions) => {
                    actions.setFieldTouched("otp");
                    actions.setSubmitting(true);
                    apiCall
                      .verifyOTP(this.props.match.params.emailId, values.otp)
                      .then(res => {
                        console.log(
                          "TCL: App -> componentDidMount -> rsp",
                          res
                        );
                        actions.setSubmitting(false);
                        if (res.status === 200) {
                          //jumpTo("/updatePassword");
                          this.props.history.push({
                            pathname: `/updatePassword/${this.props.match.params.emailId}/${values.otp}`,
                            state: {
                              from: this.props.location.pathname
                            }
                          });
                        }
                      })
                      .catch(err => {
                        console.log(
                          "TCL: App -> componentDidMount -> err",
                          err
                        );
                        console.log(err.response);
                        const { status, data } = err.response;
                        this.alertRef.handleOpenDialog(
                          `Failed processing request`,
                          data.message
                        );
                        actions.setSubmitting(false);
                      });
                  }}
                  render={formikProps => (
                    <React.Fragment>
                    <Form>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="otp"
                        label="Enter your OTP"
                        name="otp"
                        type="number"
                        autoFocus
                        helperText={
                          formikProps.touched.otp ? formikProps.errors.otp : ""
                        }
                        error={
                          formikProps.touched.otp &&
                          Boolean(formikProps.errors.otp)
                        }
                        onChange={formikProps.handleChange("otp")}
                      />
                      {/* <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        /> */}
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={formikProps.handleSubmit}
                        disabled={formikProps.isSubmitting}
                      >
                        Submit
                      </Button>
                      </Form>
                    </React.Fragment>
                  )}
                />
              {/* </form> */}
            </Fragment>
          )}
          {!this.state.showOTPField && (
            <Fragment>
              <Typography component="h1" variant="h5">
                Error Found
              </Typography>
              <br />
              <br />
              <Typography variant="subtitle">
                Didn't find the registered email-id to send OTP. Go back to
                forgot password.
              </Typography>
              <br />
              <br />
              <Link to="/forgot" variant="body2">
                Go to forgot password?
              </Link>
            </Fragment>
          )}
        </div>
      </Container>
    );
  }
}

export default withRouter(withStyles(styles)(OTPVerifyContainer));
