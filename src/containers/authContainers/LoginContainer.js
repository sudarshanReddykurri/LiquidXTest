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
  Grid,
  Box,
  Typography,
  withStyles
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { Redirect, Link } from "react-router-dom";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import perspectAILogo from "../../assets/images/PerspectAI-Logo.svg";
import apiCall from "../../services/apiCalls/apiService";
import authService from "../../services/auth/authService";
//import jumpTo from "../../services/navigation";
// or we can use withRouter higher order component from react-router-dom
import { withRouter } from "react-router-dom";
import AlertDialog from "../../components/AlertDialog";
import Footer from "../../components/Footer";
import StickyFooter from "../../shared/StickyFooter";
import { PageViewOnlyPath, Event } from "../../analytics/Tracking";
import { isThisSecond } from "date-fns";
import { AppContext } from "../../contexts/AppContextManager";
// import "../../styles.css";
// This will give history prop which we can use to navigate

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
  email: Yup.string("Enter your email")
    .trim()
    .email("Enter a valid email")
    .required("Email is a required field"),
  password: Yup.string("")
    .min(2, "Password must contain at least 2 characters")
    .required("Password is a required field")
});

const validationSchema_01 = Yup.object({
  workemail: Yup.string("Enter your work email")
    .trim()
    .email("Enter a valid email")
    .required("Email is a required field")
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
class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserOnboarded: false
    };
    this.alertRef = null;
  }

  async componentDidMount() {
    // this.alertRef.handleOpenDialog("Error","Not Found Not found not found not found not found");
    // const { UserStore } = this.props;
    // console.log("UserStore", UserStore);
  }

  render() {
    // Styling
    const { classes, rootTree } = this.props;
    if (!rootTree) return null;

    // if (fromLocation.state && fromLocation.state.nextPathname) {

    // }
    // let { from } = this.props.location.state || { from: { pathname: "/" } };
    // console.log(from);
    // if (authService.isLoggedIn()) return <Redirect to={from} />;

    return (
      <Fragment>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <AlertDialog
            ref={alertRef => {
              this.alertRef = alertRef;
            }}
          />
          {/* <p>{rootTree.user.companyName}</p> */}
          <div>
            <img
              src={perspectAILogo}
              alt="PerspectAI Logo"
              style={{
                margin: 40,
                marginTop: 140,
                marginBottom: 60,
                width: "80%"
              }}
            />
            {!this.state.isUserOnboarded && (
              <AppContext.Consumer>
                {({ setEmailID, setIsUserRegisteredForEngagement }) => (
                  <React.Fragment>
                    <Typography component="h1" variant="h5">
                      Login
                    </Typography>
                    <Formik
                      initialValues={{ workemail: "" }}
                      validationSchema={validationSchema_01}
                      onSubmit={(values, actions) => {
                        actions.setFieldTouched("workemail");
                        actions.setSubmitting(true);
                        let temp_email = values.workemail.toLowerCase().trim();
                        Event("USER", "User tries to login", "LoginContainer");

                        apiCall
                          .userExists(temp_email)
                          .then(res => {
                            console.log(
                              "TCL: App -> componentDidMount -> rsp",
                              res
                            );
                            actions.setSubmitting(false);
                            if (res.status === 200) {
                              const { rootTree } = this.props;
                              if (!rootTree) return null;
                              if (res.data.exists) {
                                data.login_id = temp_email;
                                setIsUserRegisteredForEngagement(
                                  res.data.bc19_user
                                );
                                this.setState({
                                  isUserOnboarded: true
                                });
                              } else {
                                setEmailID(temp_email);
                                if (res.data.bc19_user) {
                                  setIsUserRegisteredForEngagement(
                                    res.data.bc19_user
                                  );
                                  this.props.history.push("/signupBC19");
                                  PageViewOnlyPath("/signupBC19");
                                } else {
                                  this.props.history.push("/signup");
                                  PageViewOnlyPath("/signup");
                                }

                                //setIsUserRegisteredForEngagement();
                              }
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
                              `Authentication Failed`,
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
                              id="workemail"
                              label="Enter Your Work Email"
                              name="workemail"
                              autoComplete="workemail"
                              autoFocus
                              helperText={
                                formikProps.touched.workemail
                                  ? formikProps.errors.workemail
                                  : ""
                              }
                              error={
                                formikProps.touched.workemail &&
                                Boolean(formikProps.errors.workemail)
                              }
                              onChange={formikProps.handleChange("workemail")}
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
                              // to="/about"
                            >
                              Submit
                            </Button>
                          </Form>
                        </React.Fragment>
                      )}
                    />
                  </React.Fragment>
                )}
              </AppContext.Consumer>
            )}

            {this.state.isUserOnboarded && (
              <AppContext.Consumer>
                {({ isUserRegisteredForEngagement }) => (
                  <React.Fragment>
                    <Typography component="h1" variant="h5">
                      Login
                    </Typography>
                    <Formik
                      initialValues={{ email: data.login_id, password: "" }}
                      validationSchema={validationSchema}
                      onSubmit={(values, actions) => {
                        actions.setFieldTouched("email");
                        actions.setFieldTouched("password");
                        actions.setSubmitting(true);
                        data.login_id = values.email;
                        data.passwd = values.password;

                        Event("USER", "User tries to login", "LoginContainer");

                        apiCall
                          .userLogin(data)
                          .then(res => {
                            console.log(
                              "TCL: App -> componentDidMount -> rsp",
                              res
                            );
                            actions.setSubmitting(false);
                            if (res.status === 200) {
                              const { rootTree } = this.props;
                              if (!rootTree) return null;
                              let userData = res.data.data;
                              console.log(
                                "TCL: LoginContainer -> render -> userData",
                                userData
                              );

                              rootTree.user.updateUser(
                                userData.userId,
                                userData.fullName,
                                userData.emailId,
                                userData.hasOwnProperty("gender") &&
                                  userData.gender
                                  ? userData.gender
                                  : "",
                                userData.hasOwnProperty("mobileNo") &&
                                  userData.mobileNo
                                  ? parseInt(userData.mobileNo)
                                  : 0,
                                userData.DOB,
                                userData.registrationImages,
                                "",
                                userData.acc_lvl
                              );
                              console.log(
                                "isUserRegisteredForEngagement",
                                isUserRegisteredForEngagement
                              );
                              authService.setToken(userData.auth_token);
                              if (isUserRegisteredForEngagement) {
                                this.props.history.push("/home");
                                PageViewOnlyPath("/home");
                              } else {
                                if (userData.registrationImages) {
                                  this.props.history.push("/home");
                                  PageViewOnlyPath("/home");
                                } else {
                                  this.props.history.push("/image_register");
                                  PageViewOnlyPath("/image_register");
                                }
                              }

                              //jumpTo("/home");
                            }
                          })
                          .catch(err => {
                            console.log(
                              "TCL: App -> componentDidMount -> err",
                              err
                            );
                            console.log(err.response);
                            const { data } = err.response;
                            this.alertRef.handleOpenDialog(
                              `Authentication Failed`,
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
                              defaultValue={data.login_id}
                              required
                              fullWidth
                              id="email"
                              label="Enter Your Work Email"
                              name="email"
                              autoComplete="email"
                              autoFocus
                              helperText={
                                formikProps.touched.email
                                  ? formikProps.errors.email
                                  : ""
                              }
                              error={
                                formikProps.touched.email &&
                                Boolean(formikProps.errors.email)
                              }
                              onChange={formikProps.handleChange("email")}
                            />
                            <TextField
                              variant="outlined"
                              margin="normal"
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
                              // component={Link}
                              // to="/about"
                            >
                              Login
                            </Button>
                          </Form>
                        </React.Fragment>
                      )}
                    />

                    <Grid container>
                      <Grid item xs>
                        <Link to="/forgot" variant="body2">
                          Forgot password?
                        </Link>
                      </Grid>
                      <Grid item>
                        <Link to="/signup" variant="body2">
                          {"Don't have an account? Sign Up"}
                        </Link>
                      </Grid>
                    </Grid>
                  </React.Fragment>
                )}
              </AppContext.Consumer>
            )}
          </div>
        </Container>
        <div
          style={{
            height: 250
          }}
        ></div>
        <Container component="main" maxWidth="xs">
          {" "}
          <Footer />
        </Container>
        <div
          style={{
            height: 50
          }}
        ></div>
        <StickyFooter />
      </Fragment>
    );
  }
}

// export default withStyles(styles)(LoginContainer);

/* this is how you use the HeroStore by
    injecting it to your component. 
    The Store can be found in the Provider */
export default withRouter(
  withStyles(styles)(inject("rootTree")(observer(LoginContainer)))
);
