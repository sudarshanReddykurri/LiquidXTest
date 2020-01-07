import React, { Component, Fragment } from "react";
import AssessmentCard from "../../components/assessmentCard";
import {
  Box,
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

class AssessmentHomeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assessmentsList: [],
      isLoading: true
    };
    this.fetchAssessments();
  }

  fetchAssessments = async () => {
    const { classes, rootTree } = this.props;

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

          res.data.assessmnets.map((assessment, index) => {
            console.log(
              "TCL: AssessmentHomeContainer -> fetchAssessments -> assessment",
              assessment
            );

            rootTree.user.newAssessment(
              assessment.org_name,
              assessment.assmt_name,
              assessment.end_date,
              assessment.logo_url
            );
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

  componentWillMount = () => {};

  componentDidMount() {}

  render() {
    const { classes, rootTree } = this.props;
    if (!rootTree) return null;
    return (
      <Fragment>
        <CssBaseline />
        <NavBar />
        <Container className={classes.cardGrid}>
          <Typography className={classes.pageTitle} component="h1">
            <Box fontWeight="fontWeightBold" fontSize={24}>
              Assessments
            </Box>
          </Typography>
          <Typography align="center">
            <Box fontWeight="fontWeightRegular" fontSize={16}>
              Below are the assessments alloted to you. Try to finish the
              assignments within the alloted time
            </Box>
          </Typography>
          <br />
          <Grid container spacing={24} justify="center" direction="row">
            {rootTree.user.getAssessments().map((assessment, index) => {
              return (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <AssessmentCard
                    key={assessment.id}
                    organizationName={assessment.companyName}
                    assessmentName={assessment.assessmentName}
                    expiryTime={epochToJsDate(assessment.expiryTime)}
                    image={assessment.logoUrl}
                  ></AssessmentCard>
                </Grid>
              );
            })}
          </Grid>
        </Container>
        <StickyFooter />
      </Fragment>
    );
  }
}

const styles = theme => ({
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

export default withStyles(styles)(
  inject("rootTree")(observer(AssessmentHomeContainer))
);
