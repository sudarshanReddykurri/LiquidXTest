import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  title: {
    margin: 0,
    padding: theme.spacing(2),
    minWidth: 400
  },
  content: {
    color: "#000",
    fontSize: 14
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

class AlertDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      title: "",
      message: ""
    };
    this.handleOpenDialog = this.handleOpenDialog.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
  }

  handleOpenDialog(title, message) {
    this.setState({
      openDialog: true,
      title,
      message
    });
  }

  handleCloseDialog() {
    this.setState({
      openDialog: false,
      title: "",
      message: ""
    });
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Dialog
          maxWidth={"md"}
          open={this.state.openDialog}
          onClose={this.handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" className={classes.title}>{this.state.title}</DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              className={classes.content}
            >
              {this.state.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog} color="primary">
              OK
            </Button>
            {/* <Button onClick={this.handleOpenDialog} color="primary" autoFocus>
              Agree
            </Button> */}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(AlertDialog);
