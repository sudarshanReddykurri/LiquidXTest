// https://medium.com/@ilonacodes/why-formik-with-react-e640c1934d6
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
  Link,
  Grid,
  Box,
  Typography,
  withStyles
} from "@material-ui/core";

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

const validationSchema = Yup.object().shape({
  otp: Yup.number()
    .required("OTP is a required field")
    .min(6, "Please enter a valid OTP code")
});

class OTPVerifyContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    console.log("{this.props.match.params.id",this.props.match.params.emailId)
  }

  render() {
    // Styling
    const { classes } = this.props;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
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
          <Typography component="h1" variant="h5">
            Enter the OTP here
          </Typography>
          <br />
          <Typography variant="subtitle">
            The recovery code is sent to your registered email-id
          </Typography>
          <form className={classes.form} noValidate>
            <Formik
              initialValues={{ otp: ""}}
              validationSchema={validationSchema}
              onSubmit={(values, actions) => {
                actions.setFieldTouched("otp");
                actions.setSubmitting(true);
                // apiCall
                //   .verifyOTP(data)
                //   .then(res => {
                //     console.log("TCL: App -> componentDidMount -> rsp", res);
                //     actions.setSubmitting(false);
                //     if (res.status == 200) {
                //       jumpTo("/updatePassword");
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
                      formikProps.touched.otp && Boolean(formikProps.errors.otp)
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
                </React.Fragment>
              )}
            />
          </form>
        </div>
      </Container>
    );
  }
}

export default withStyles(styles)(OTPVerifyContainer);
