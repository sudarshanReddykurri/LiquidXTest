// @flow
import React, { Component } from "react";
import { Box, Grid, Slider, Typography, withStyles } from "@material-ui/core";

const styles = theme => ({
  root: {
    /* margin: 200px; */
    position: "fixed" /* or absolute */,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  }
});

const appendZero = number => (number < 10 ? `0${number}` : number);

const getFormattedTime = time => {
  const dateTime = new Date(0, 0, 0, 0, 0, time, 0);

  const dateTimeM = appendZero(dateTime.getMinutes());
  const dateTimeS = appendZero(dateTime.getSeconds());

  return `${dateTimeM}:${dateTimeS}`;
};

const getProgress = (currentTime, duration) =>
  parseFloat(100 * (currentTime / duration));

const getCurrentTime = (progress, duration) =>
  parseFloat((progress * duration) / 100);

function pad(n, width, z = 0) {
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const minutesAndSeconds = position => [
  pad(Math.floor(position / 60), 2),
  pad(position % 60, 2)
];

class SeekBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { trackLength, currentPosition } = this.props;
    // const elapsed = minutesAndSeconds(currentPosition);
    // const remaining = minutesAndSeconds(trackLength);
    const elapsed = appendZero(getFormattedTime(currentPosition));
    const remaining = appendZero(getFormattedTime(trackLength));

    return (
      <Grid
        container
        spacing={5}
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <Grid item xs={8} style={{ marginTop: 100 }}>
          <Slider
            disabled={true}
            onChange={
              (_, progress) => console.log("progress", progress)
              //this.handleChange(progress, this.player)
            }
            variant="determinate"
            color="secondary"
            value={getProgress(currentPosition, trackLength)}
          />
          <Grid item xs={12}>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "space-between"
              }}
            >
              <Typography>{elapsed}</Typography>
              <Typography>{remaining}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(styles)(SeekBar);
