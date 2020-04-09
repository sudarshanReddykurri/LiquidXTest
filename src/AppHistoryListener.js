import React, { Component, Fragment } from "react";
//import history from "./utils/history";
// import { createBrowserHistory } from 'history';
import { withRouter } from "react-router-dom";
import ReactGA from "react-ga";
import appConfig from "./configs/appConfig";
import App from "./App";

class AppHistoryListener extends Component {
  constructor(props) {
    super(props);
    ReactGA.initialize(appConfig.trackingId);
  }
  componentDidMount() {
    this.unlisten = this.props.history.listen((location, action) =>
      console.log("History changed!", location, action)
    );
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    return (
        <App />
    );
  }
}

export default withRouter(AppHistoryListener);
