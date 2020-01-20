import React, { Component } from "react";
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
  Grid,
  Box,
  Typography,
  withStyles
} from "@material-ui/core";
import { Link } from "react-router-dom";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Formik } from "formik";
import * as Yup from "yup";
import perspectAILogo from "../../assets/images/PerspectAI-Logo.svg";
import apiCall from "../../services/apiCalls/apiService";
import authService from "../../services/auth/authService";
// import jumpTo from "../../services/navigation";
import { inject, observer } from "mobx-react";
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

const validationSchema = Yup.object({
  password: Yup.string()
    .required("Password is a Required Field")
    .min(4, "Password is too short")
    .max(12, "Try a shorter password"),
  confirmPassword: Yup.string()
    .required("Confirm Password is a Required Field")
    .test("passwords-match", "Passwords should match", function(value) {
      return this.parent.password === value;
    })
});

let data = {
  device_id: "web",
  device_model: "web",
  screen_size: "120*240",
  ram: "web",
  login_id: "",
  passwd: "",
  os_version: "web",
  screen_dpi: "web",
  version: "2.01.10",
  fcm_token: ""
};

class SetNewPasswordContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
          <img
            src={perspectAILogo}
            alt="PerspectAI Logo"
            class={classes.avatar}
          />

          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <br />
          <Typography variant="subtitle">
            Please update your new password here
          </Typography>
          <form className={classes.form} noValidate>
            <Formik
              initialValues={{ password: "", confirmPassword: "" }}
              validationSchema={validationSchema}
              onSubmit={(values, actions) => {
                console.log("values", values);
                let payload = {
                  email_id: this.props.match.params.emailId,
                  otp: this.props.match.params.otp,
                  passwd: values.confirmPassword
                };
                actions.setFieldTouched("password");
                actions.setFieldTouched("confirmPassword");
                actions.setSubmitting(true);
                apiCall
                  .afterOTPUpdateResetPassword(payload)
                  .then(res => {
                    console.log("TCL: App -> componentDidMount -> rsp", res);
                    actions.setSubmitting(false);
                    if (res.status === 200) {
                      data.login_id = this.props.match.params.emailId;
                      data.passwd = values.password;
                      apiCall
                        .userLogin(data)
                        .then(response => {
                          console.log(
                            "TCL: App -> componentDidMount -> rsp",
                            response
                          );
                          // actions.setSubmitting(false);
                          if (response.status == 200) {
                            const { rootTree } = this.props;
                            if (!rootTree) return null;
                            let userData = response.data.data;
                            console.log(
                              "TCL: LoginContainer -> render -> userData",
                              userData
                            );

                            rootTree.user.updateUser(
                              userData.userId,
                              userData.fullName,
                              userData.emailId,
                              userData.gender,
                              parseInt(userData.mobileNo),
                              userData.DOB,
                              userData.registrationImages,
                              "",
                              userData.acc_lvl
                            );

                            authService.setToken(userData.auth_token);
                            this.props.history.push("/home");
                            //jumpTo("/home");
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
                      //jumpTo("/otpverify");
                    }
                  })
                  .catch(err => {
                    console.log("TCL: App -> componentDidMount -> err", err);
                    console.log(err.response);
                    const { status, data } = err.response;
                    this.alertRef.handleOpenDialog(
                      `Failed processing request`,
                      data.message
                    );
                    actions.setSubmitting(false);
                  });

                // apiCall
                //   .forgotPassword(data)
                //   .then(res => {
                //     console.log("TCL: App -> componentDidMount -> rsp", res);
                //     actions.setSubmitting(false);
                //     if (res.status == 200) {
                //       jumpTo("/otpverify");
                //     }
                //   })
                //   .catch(err => {
                //     console.log("TCL: App -> componentDidMount -> err", err);
                //     actions.setSubmitting(false);
                //   });
              }}
              render={formikProps => (
                <React.Fragment>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    helperText={
                      formikProps.touched.password
                        ? formikProps.errors.password
                        : ""
                    }
                    error={
                      formikProps.touched.password &&
                      Boolean(formikProps.errors.password)
                    }
                    onChange={formikProps.handleChange("password")}
                  />
                  <br />
                  <br />
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    autoComplete="current-password"
                    helperText={
                      formikProps.touched.confirmPassword
                        ? formikProps.errors.confirmPassword
                        : ""
                    }
                    error={
                      formikProps.touched.confirmPassword &&
                      Boolean(formikProps.errors.confirmPassword)
                    }
                    onChange={formikProps.handleChange("confirmPassword")}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={formikProps.handleSubmit}
                    disabled={formikProps.isSubmitting}
                    // component={Link}
                    // to="/otpverify"
                  >
                    Submit
                  </Button>
                </React.Fragment>
              )}
            />
          </form>
        </div>
      </Container>
    );
  }
}

export default withRouter(
  withStyles(styles)(inject("rootTree")(observer(SetNewPasswordContainer)))
);
