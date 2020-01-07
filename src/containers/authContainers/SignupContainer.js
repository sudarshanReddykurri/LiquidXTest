// keyboardpicker: https://github.com/mui-org/material-ui-pickers/issues/1320

import React, { Component } from "react";
import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  TextField,
  Checkbox,
  Grid,
  Box,
  Typography,
  withStyles,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  FormHelperText
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";
import { Link } from "react-router-dom";
import StickyFooter from "../../shared/StickyFooter";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import perspectAILogo from "../../assets/images/PerspectAI-Logo.svg";

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
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  formLabel: {
    display: "flex",
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    textAlign: "left"
  },
  formControl: {
    margin: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
});

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First Name is a required field")
    .min(2, "Your First Name is too short")
    .max(20, "Your First Name is too Long"),
  lastName: Yup.string()
    .required("Last Name is a required field")
    .min(2, "Your Last Name is too short")
    .max(20, "Your Last Name is too Long"),
  email: Yup.string("Enter your email")
    .trim()
    .email("Enter a valid email")
    .required("Email is a required field"),
  mobileNumber: Yup.number().required("Mobile Number is a required field"),
  licenseKey: Yup.string()
    .required("License Key is a required field")
    .min(6, "Your License Key is not valid")
    .max(20, "Please enter a valid License Key"),
  password: Yup.string()
    .required("Password is a Required Field")
    .min(4, "Password is too short")
    .max(12, "Try a shorter password"),
  confirmPassword: Yup.string()
    .required("Confirm Password is a Required Field")
    .test("passwords-match", "Passwords should match", function(value) {
      return this.parent.password === value;
    }),
  dateOfBirth: Yup.string()
    .required("Date of birth is a required field")
    .test("dateofbirth", "You must be above 18  to signup", value => {
      return moment().diff(moment(value), "years") >= 18;
    }),
  gender: Yup.string()
    .required("Gender is a required field")

});

class SignupContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: null,
      selectedGender: null
    };
  }

  handleDateChange = date => {
    this.setState({
      selectedDate: date
    });
  };

  handleGenderChange = eventValue => {
    this.setState({
      selectedGender: eventValue
    });
  };

  render() {
    // Styling
    const { classes } = this.props;
    return (
      <div>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <img
              src={perspectAILogo}
              alt="PerspectAI Logo"
              class={classes.avatar}
            />
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <form className={classes.form} noValidate>
              <Formik
                initialValues={{
                  firstName: "",
                  lastName: "",
                  email: "",
                  mobileNumber: "",
                  licenseKey: "",
                  password: "",
                  confirmPassword: "",
                  dateOfBirth: "",
                  gender: ""
                }}
                validationSchema={validationSchema}
                onSubmit={(values, actions) => {
                  actions.setFieldTouched("firstName");
                  actions.setFieldTouched("lastName");
                  actions.setFieldTouched("email");
                  actions.setFieldTouched("mobileNumber");
                  actions.setFieldTouched("password");
                  actions.setFieldTouched("confirmPassword");
                  actions.setFieldTouched("dateOfBirth");
                  actions.setFieldTouched("gender");
                  actions.setSubmitting(true);
                }}
                render={formikProps => (
                  <React.Fragment>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          autoComplete="firstName"
                          name="firstName"
                          variant="outlined"
                          required
                          fullWidth
                          id="firstName"
                          label="First Name"
                          autoFocus
                          helperText={
                            formikProps.touched.firstName
                              ? formikProps.errors.firstName
                              : ""
                          }
                          error={
                            formikProps.touched.firstName &&
                            Boolean(formikProps.errors.firstName)
                          }
                          onChange={formikProps.handleChange("firstName")}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          variant="outlined"
                          required
                          fullWidth
                          id="lastName"
                          label="Last Name"
                          name="lastName"
                          autoComplete="lastName"
                          helperText={
                            formikProps.touched.lastName
                              ? formikProps.errors.lastName
                              : ""
                          }
                          error={
                            formikProps.touched.lastName &&
                            Boolean(formikProps.errors.lastName)
                          }
                          onChange={formikProps.handleChange("lastName")}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          variant="outlined"
                          required
                          fullWidth
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
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
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          variant="outlined"
                          required
                          fullWidth
                          id="mobileNumber"
                          label="Phone Number"
                          name="mobileNumber"
                          type="number"
                          helperText={
                            formikProps.touched.mobileNumber
                              ? formikProps.errors.mobileNumber
                              : ""
                          }
                          error={
                            formikProps.touched.mobileNumber &&
                            Boolean(formikProps.errors.mobileNumber)
                          }
                          onChange={formikProps.handleChange("mobileNumber")}
                        />
                      </Grid>
                      <Grid item xs={12}>
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
                      </Grid>
                      <Grid item xs={12}>
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
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          variant="outlined"
                          required
                          fullWidth
                          name="licenseKey"
                          label="Licence Key"
                          id="licenseKey"
                          helperText={
                            formikProps.touched.licenseKey
                              ? formikProps.errors.licenseKey
                              : ""
                          }
                          error={
                            formikProps.touched.licenseKey &&
                            Boolean(formikProps.errors.licenseKey)
                          }
                          onChange={formikProps.handleChange("licenseKey")}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          {/* <Grid container justify="space-around"> */}
                          <KeyboardDatePicker
                            required
                            fullWidth
                            margin="normal"
                            id="dateOfBirth"
                            label="Date of birth"
                            format="dd/MM/yyyy"
                            value={this.state.selectedDate}
                            onChange={date => {
                              // this.togglePicker(false);
                              this.handleDateChange(date);
                              formikProps.setFieldValue("dateOfBirth", date);
                            }}
                            KeyboardButtonProps={{
                              "aria-label": "change date"
                            }}
                            helperText={
                              formikProps.touched.dateOfBirth
                                ? formikProps.errors.dateOfBirth
                                : ""
                            }
                            error={
                              formikProps.touched.dateOfBirth &&
                              Boolean(formikProps.errors.dateOfBirth)
                            }
                          />
                          {/* </Grid> */}
                        </MuiPickersUtilsProvider>
                      </Grid>
                      <FormControl
                        component="fieldset"
                        className={classes.formControl}
                      >
                        <FormLabel
                          component="legend"
                          className={classes.formLabel}
                          required
                        >
                          Gender
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-label="gender"
                          name="gender"
                          value={this.state.selectedGender}
                          onChange={
                            event => {
                              // this.togglePicker(false);
                              this.handleDateChange(event.target.value);
                              formikProps.setFieldValue("gender", event.target.value);
                            }}
                          touched={
                            formikProps.touched.gender
                              ? formikProps.errors.gender
                              : ""
                          }
                          error={
                            formikProps.touched.gender &&
                            Boolean(formikProps.errors.gender)
                          }
                        >
                          <FormControlLabel
                            value="female"
                            control={<Radio color="primary" />}
                            label="Female"
                            labelPlacement="end"
                          />
                          <FormControlLabel
                            value="male"
                            control={<Radio color="primary" />}
                            label="Male"
                            labelPlacement="end"
                          />
                          <FormControlLabel
                            value="other"
                            control={<Radio color="primary" />}
                            label="Other"
                            labelPlacement="end"
                          />
                        </RadioGroup>
                      </FormControl>
                      <Grid item xs={12}>
                        <Typography variant="body2" component="h2" gutterBottom>
                          By signing up you agree to our terms and conditions
                        </Typography>
                      </Grid>
                    </Grid>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      onClick={formikProps.handleSubmit}
                    >
                      Sign Up
                    </Button>
                  </React.Fragment>
                )}
              />
              <Grid container justify="flex-end">
                <Grid item>
                  <Link to="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
          <br />
          <br />
        </Container>
        <StickyFooter />
      </div>
    );
  }
}

export default withStyles(styles)(SignupContainer);
