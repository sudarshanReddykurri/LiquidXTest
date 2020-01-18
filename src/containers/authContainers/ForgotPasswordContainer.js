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
// import jumpTo from "../../services/navigation";
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
  email: Yup.string("Enter your email")
    .trim()
    .email("Enter a valid email")
    .required("Email is a required field")
});

class ForgotPasswordContainer extends Component {
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
            Forgot Password
          </Typography>
          <br />
          <Typography variant="subtitle">
            Forgot your account’s password or having trouble logging into your
            Account? Enter your email address and we’ll send you the recovery
            code.
          </Typography>
          <form className={classes.form} noValidate>
            <Formik
              initialValues={{ email: "" }}
              validationSchema={validationSchema}
              onSubmit={(values, actions) => {
                let data = { email_id: values.email.toLowerCase().trim() };
                actions.setFieldTouched("email");
                actions.setSubmitting(true);
                apiCall
                  .forgotPassword(data)
                  .then(res => {
                    console.log("TCL: App -> componentDidMount -> rsp", res);
                    actions.setSubmitting(false);
                    if (res.status === 200) {
                      this.props.history.push({
                        pathname: `/otpverify/${data.email_id}`,
                        state: {
                          from: this.props.location.pathname
                        }
                      });
                      //jumpTo(`/otpverify/${data.email_id}`);
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

export default withRouter(withStyles(styles)(ForgotPasswordContainer));
