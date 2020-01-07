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
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Formik } from "formik";
import * as Yup from "yup";
import perspectAILogo from "../../assets/images/PerspectAI-Logo.svg";
import apiCall from "../../services/apiCalls/apiService";
import jumpTo from "../../services/navigation";

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
  fcm_token: "web"
};
class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    // const { UserStore } = this.props;
    // console.log("UserStore", UserStore);
  }

  render() {
    // Styling
    const { classes, rootTree } = this.props;
    if (!rootTree) return null;

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
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

          <Typography component="h1" variant="h5">
            Login
          </Typography>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
              actions.setFieldTouched("email");
              actions.setFieldTouched("password");
              actions.setSubmitting(true);
              data.login_id = values.email;
              data.passwd = values.password;

              apiCall
                .userLogin(data)
                .then(res => {
                  console.log("TCL: App -> componentDidMount -> rsp", res);
                  actions.setSubmitting(false);
                  if (res.status == 200) {
                    const { rootTree } = this.props;
                    if (!rootTree) return null;
                    let userData = res.data.data;
                    console.log("TCL: LoginContainer -> render -> userData", userData);

                    rootTree.user.updateUser(
                      userData.userId,
                      userData.fullName,
                      userData.emailId,
                      userData.gender,
                      parseInt(userData.mobileNo),
                      userData.DOB,
                      userData.registrationImages,
                      userData.auth_token,
                      userData.acc_lvl
                    );

                    jumpTo("/home");

                  }
                })
                .catch(err => {
                  console.log("TCL: App -> componentDidMount -> err", err);
                  actions.setSubmitting(false);
                });
            }}
            render={formikProps => (
              <React.Fragment>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  helperText={
                    formikProps.touched.email ? formikProps.errors.email : ""
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
        </div>
      </Container>
    );
  }
}

// export default withStyles(styles)(LoginContainer);

/* this is how you use the HeroStore by
    injecting it to your component. 
    The Store can be found in the Provider */
export default withStyles(styles)(inject("rootTree")(observer(LoginContainer)));
