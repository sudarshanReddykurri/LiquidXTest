import React, { Fragment } from "react";

class FullScreenButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullscreen: false
    };
  }

  handleFullscreenChange = e => {
    let fullscreen = false;
    if (
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement ||
      document.fullscreen ||
      document.mozFullScreen ||
      document.webkitIsFullScreene ||
      document.fullScreenMode
    ) {
      fullscreen = true;
    }
    this.setState({ fullscreen });
  };

  handleToggle = e => {
    const el = document.documentElement;
    if (!this.state.fullscreen) {
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  componentDidMount() {
    document.addEventListener(
      "webkitfullscreenchange",
      this.handleFullscreenChange,
      false
    );
    document.addEventListener(
      "mozfullscreenchange",
      this.handleFullscreenChange,
      false
    );
    document.addEventListener(
      "msfullscreenchange",
      this.handleFullscreenChange,
      false
    );
    document.addEventListener(
      "MSFullscreenChange",
      this.handleFullscreenChange,
      false
    ); //IE11
    document.addEventListener(
      "fullscreenchange",
      this.handleFullscreenChange,
      false
    );
  }

  render() {
    return (
      <Fragment>
        {/* <button onClick={this.handleToggle}>Toggle Full Screen</button> */}
      </Fragment>
    );
  }

  componentWillUnmount() {
    document.removeEventListener(
      "webkitfullscreenchange",
      this.handleFullscreenChange
    );
    document.removeEventListener(
      "mozfullscreenchange",
      this.handleFullscreenChange
    );
    document.removeEventListener(
      "msfullscreenchange",
      this.handleFullscreenChange
    );
    document.removeEventListener(
      "MSFullscreenChange",
      this.handleFullscreenChange
    );
    document.removeEventListener(
      "fullscreenchange",
      this.handleFullscreenChange
    );
  }
}

export default FullScreenButton;
