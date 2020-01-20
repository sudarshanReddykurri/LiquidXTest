import React, { Component, Fragment } from "react";
import AssessmentCard from "../../components/assessmentCard";
import {
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  withStyles,
  Typography
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import NavBar from "../../shared/NavBar";
import StickyFooter from "../../shared/StickyFooter";
import { epochToJsDate } from "../../utils/timeUtils";
import apiCall from "../../services/apiCalls/apiService";
import authService from "../../services/auth/authService";
import { withRouter } from "react-router-dom";

class AssessmentHomeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assessmentsList: [],
      isLoading: true,
      isFetchingAssessment: false,
      totalAssessments: 0
    };
    console.log("AssessmentHomeContainer");
    this.fetchAssessments();
  }

  componentDidMount() {}

  fetchAssessments = async () => {
    const { classes, rootTree } = this.props;
    console.log("fetchAssessments");
    // rootTree.user.currentAssessment.update_games_to_play();
    if (!rootTree) return null;

    apiCall
      .getUserAssessments(rootTree.user.userId)
      .then(res => {
        console.log(
          "TCL: AssessmentHomeContainer -> fetchAssessments -> rsp",
          res
        );

        if (res.status == 200) {
          rootTree.user.clearAllAssessments();
          this.setState({
            totalAssessments: res.data.assessmnets.length
          });
          res.data.assessmnets.map((assessment, index) => {
            console.log(
              "TCL: AssessmentHomeContainer -> fetchAssessments -> assessment",
              assessment
            );

            rootTree.user.newAssessment(
              assessment.org_name,
              assessment.assmt_id,
              assessment.assmt_name,
              assessment.end_date,
              assessment.logo_url
            );
          });
          this.setState({
            isLoading: false
          });
        }
      })
      .catch(err => {
        console.log(
          "TCL: AssessmentHomeContainer -> fetchAssessments -> err",
          err
        );
      });
  };

  goToAssessment(assessment) {
    const { rootTree } = this.props;
    // this.setState(
    //   {
    //     isFetchingAssessment: true
    //   },
    //   () => {
    //     console.log("isFetchingAssessment");
    //   }
    // );
    const {
      id,
      assessmentId,
      assessmentName,
      companyName,
      expiryTime,
      logoUrl
    } = assessment;
    rootTree.user.currentAssessment.update_current_assessment_info(
      assessmentId,
      assessmentName,
      companyName,
      expiryTime,
      logoUrl
    );
    // Store.AssessmentId = assmt_id;
    this.props.history.push("/am");
  }

  // openAssessments(assessmentDetails){
  //   this.props.history.push("/am")
  // }

  onUserLogout = () => {
    console.log("onUserLogout");
    //let hello = localStorage.getItem("@rootStoreKey");
    //console.log("TCL: AssessmentHomeContainer -> onUserLogout -> hello", hello.user);
    authService.logout().then(res => {
      console.log("TCL: AssessmentHomeContainer -> onUserLogout -> res", res);
      this.props.history.push("/login");
      window.location.reload();
    });
  };

  componentWillMount = () => {};

  componentDidMount() {}

  render() {
    const { classes, rootTree } = this.props;
    if (!rootTree) return null;
    return (
      <Fragment>
        <CssBaseline />
        <NavBar onLogOut={this.onUserLogout} />
        <Container className={classes.cardGrid}>
          {this.state.isLoading ? (
            <Box className={classes.progressBar}>
              <CircularProgress />
              <Typography className={classes.pageTitle} component="h1">
                <Box fontWeight="fontWeightBold" fontSize={24}>
                  Loading Assessments
                </Box>
              </Typography>
              <Typography align="center">
                <Box fontWeight="fontWeightRegular" fontSize={16}>
                  Please wait while we are loading the assignments
                </Box>
              </Typography>
            </Box>
          ) : (
            <Fragment>
              <Typography className={classes.pageTitle} component="h1">
                <Box fontWeight="fontWeightBold" fontSize={24}>
                  Your Assessments
                </Box>
              </Typography>
              <Typography align="center">
                <Box fontWeight="fontWeightRegular" fontSize={16}>
                  Below are the assessments alloted to you. Try to finish the
                  assignments within the alloted time
                </Box>
              </Typography>
              <br />
              <Grid
                container
                spacing={24}
                justify={
                  this.state.totalAssessments < 2 ? "center" : "flex-start"
                }
                direction="row"
              >
                {rootTree.user.getAssessments().map((assessment, index) => {
                  return (
                    <Grid item key={index} xs={12} sm={6} md={4}>
                      <AssessmentCard
                        key={assessment.id}
                        organizationName={assessment.companyName}
                        assessmentName={assessment.assessmentName}
                        expiryTime={epochToJsDate(assessment.expiryTime)}
                        image={assessment.logoUrl}
                        onPress={() => this.goToAssessment(assessment)}
                      ></AssessmentCard>
                    </Grid>
                  );
                })}
              </Grid>
            </Fragment>
          )}
        </Container>
        {/* <StickyFooter /> */}
      </Fragment>
    );
  }
}

const styles = theme => ({
  progressBar: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  pageTitle: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    textAlign: "center"
  }
});

export default withRouter(
  withStyles(styles)(inject("rootTree")(observer(AssessmentHomeContainer)))
);
