import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Box, Button } from "@material-ui/core";
function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const styles = theme => ({
  roundedButton: {
    width: 200,
    borderRadius: 20,
    padding: theme.spacing(1, 3),
    textTransform: "capitalize"
  },
  paper: {
    position: "absolute",
    width: 500,
    [theme.breakpoints.down("sm")]: {
      width: "80%"
    },
    backgroundColor: theme.palette.background.paper,
    // border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: 0,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  }
});

class ModalWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      modalStyle: getModalStyle()
    };
  }

  handleOpen = () => {
    this.setState({
      open: true
    });
  };

  handleClose = () => {
    this.setState({
      open: false
    });
  };

  render() {
    // Styling
    const { classes } = this.props;
    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div style={this.modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">Instructions</h2>
            <p id="simple-modal-description">
              This is a <b style={{color:'#ff0000'}}>Proctored</b> test. We would be taking your pictures
              while playing the game.
            </p>
            <p id="simple-modal-description">
              The lighting in the place must be bright enough to be considered
              "daylight" quality. Overhead lighting is preferred.
            </p>
            {/* <p id="simple-modal-description">
              Make sure you <b>Maximize</b> the game tab before taking the test.
            </p> */}
            <p id="simple-modal-description">
              Play utmost attention while playing taking the assessment.
            </p>
            <p id="simple-modal-description">
              <b style={{color:'#ff0000'}}>Don't Reload</b> browser while taking the assessment.
            </p>
            <br />
            <Box align="center">
              <Button
                size="small"
                color="primary"
                variant="contained"
                onClick={this.props.proceedToGame}
                className={classes.roundedButton}
              >
                Proceed To Module
              </Button>
            </Box>
            {/* <button type="button" onClick={this.handleOpen}>
              Proceed
            </button> */}
          </div>
        </Modal>
      </div>
    );
  }
}

export default withStyles(styles)(ModalWindow);
