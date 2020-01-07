import React from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardMedia,
  CardContent,
  Typography,
  withStyles
} from "@material-ui/core";

const AssessmentCard = ({
  organizationName,
  assessmentName,
  expiryTime,
  classes,
  image,
  onPress
}) => {
  return (
    <Card className={classes.item}>
      <CardMedia className={classes.media}>
        <img src={image} alt="Assessment Assigned" />
      </CardMedia>
      <CardContent>
        <Typography component="p" variant="h6">
          {organizationName}
        </Typography>
        <br />
        <div className={classes.controls}>
          <Typography
            className={"MuiTypography-body1"}
            variant={"caption"}
            align="left"
          >
            <Box fontWeight="fontWeightBold" m={0}>
              Assessment Name:
            </Box>
          </Typography>
          <Typography
            className={"MuiTypography--subheading"}
            variant={"caption"}
            align="right"
          >
            {assessmentName}
          </Typography>
        </div>
        <div className={classes.controls}>
          <Typography
            className={"MuiTypography-body1"}
            variant={"caption"}
            align="left"
          >
            <Box fontWeight="fontWeightBold" m={0}>
              Expires at:
            </Box>
          </Typography>
          <Typography
            className={"MuiTypography--subheading"}
            variant={"caption"}
            align="right"
          >
            {expiryTime}
          </Typography>
        </div>
      </CardContent>
      <CardActions style={{ justifyContent: "center" }}>
        {/* <Fab
          variant="extended"
          size="medium"
          color="primary"
          aria-label="add"
          className={classes.margin}
          onClick={onPress}
        >
          Go to Assessment
        </Fab> */}
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={onPress}
          className={classes.roundedButton}
        >
          Go to Assessment
        </Button>
      </CardActions>
      <br />
    </Card>
  );
};

const styles = theme => ({
  item: {
    minWidth: "375px",
    // maxWidth: "300px",
    margin: "1em",
    textAlign: "center",
    boxSizing: "border-box"
  },
  media: {
    height: "200px"
  },
  controls: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 3, 2, 3),
    justifyContent: "space-between"
  },
  roundedButton: {
    borderRadius: 25,
    padding: theme.spacing(1, 3),
    textTransform: "capitalize"
  }
});

export default withStyles(styles)(AssessmentCard);
