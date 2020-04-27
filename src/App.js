import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { registerNav } from "./services/navigation";
import AppRoutes from "./routes";
import NavBar from "./shared/NavBar";
import apiCall from "./services/apiCalls/apiService";
import { setUpRootStore } from "./store/setup";
import { Provider } from "mobx-react";
import "./App.css";
import appConfig from "./configs/appConfig";
import authService from "./services/auth/authService";
import history from "./utils/history";
// import { createBrowserHistory } from 'history';
import { initGA, PageViewOnlyPath, Event } from "./analytics/Tracking";
import { withRouter } from "react-router";
import { AppContextProvider } from "./contexts/AppContextManager";
// const history = createBrowserHistory();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rootTree: null,
    };
    // this.ref = React.createRef();
    document.title = "PerspectAI";
    initGA(appConfig.trackingId);
    // ReactGA.event({
    //   category: 'Initial Load',
    //   action: 'Initial Loading',
    //   transport: 'beacon'
    // });
  }

  componentDidMount() {
    console.log("App cdm", appConfig.appVersion);
    console.log("this.props.history", this.props.history);

    this.unlisten = this.props.history.listen((location, action) => {
      PageViewOnlyPath(location.pathname);
      console.log(
        `The current URL is ${location.pathname}${location.search}${location.hash}`
      );
      console.log(`The last navigation action was ${action}`);
    });

    if (authService.getAppVersion() != null) {
      if (authService.isAppVersionChanged(appConfig.appVersion)) {
        authService.clearCookies();
      }
    }
    authService.setAppVersion(appConfig.appVersion);
    const { rootTree } = setUpRootStore();
    this.setState({
      rootTree,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      console.log("Route change!");
      this.onRouteChanged();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    console.log("ROUTE CHANGED");
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    const { rootTree } = this.state;
    if (!rootTree) return null;
    return (
      <Provider rootTree={rootTree}>
        <AppContextProvider>
          <AppRoutes
            ref={(routerRef) => {
              // this.ref = routerRef;
              // registerNav(routerRef);
            }}
          ></AppRoutes>
        </AppContextProvider>
      </Provider>
    );
  }
}

export default withRouter(App);
