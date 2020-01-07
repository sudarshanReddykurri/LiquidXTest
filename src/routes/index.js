// https://devlinduldulao.pro/mobx-state-tree-in-a-nutshell-with-react-mobx-state-tree-code-sample/
// https://github.com/miles-till/mobx-state-tree-router-demo/blob/master/src/components/App.js
import React, { forwardRef } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  Link
} from "react-router-dom";

import createBrowserHistory from "history/createBrowserHistory";
import { RouterStore, syncHistoryWithStore } from "mobx-react-router";
import { Provider } from "mobx-react";

// import your stores here
// import UserStore from "../store/UserStore";

import LoginContainer from "../containers/authContainers/LoginContainer";
import SignupContainer from "../containers/authContainers/SignupContainer";
import ForgotPasswordContainer from "../containers/authContainers/ForgotPasswordContainer";
import OTPVerifyContainer from "../containers/authContainers/OTPVerifyContainer";
import AboutContainer from "../containers/AboutContainer";
import AssessmentModules from "../containers/assessmentsModulesContainer/AssessmentModules";
import NotFound from "../containers/NotFound";
import AssessmentHomeContainer from "../containers/assessmentsContainer/AssessmentHomeContainer";
import SetNewPasswordContainer from "../containers/authContainers/SetNewPasswordContainer";
//import { registerNav } from "../services/navigation";
// Although the page does not ever refresh, notice how
// React Router keeps the URL up to date as you navigate
// through the site. This preserves the browser history,
// making sure things like the back button and bookmarks
// work properly.

// const browserHistory = createBrowserHistory();
// Keep your MobX state in sync with react-router via a RouterStore.
// const routingStore = new RouterStore();

// Merge all your stores here.
const stores = {
  // routing: routingStore,
  // HeroStore,
  // VillainStore
  //UserStore
};

// const history = syncHistoryWithStore(browserHistory, routingStore); // sync your browserHistory and routingStore

const AppRoutes = forwardRef((props, ref) => {
  return (
    <Router ref={ref}>
      {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
      {/* <Provider {...stores}> */}
        <Switch>
          <Route  path="/signup" component={SignupContainer} />
          {/* <Route path="/" component={LoginContainer} /> */}
          <Route  path="/login" component={LoginContainer} />
          <Route
            
            path="/home"
            component={AssessmentHomeContainer}
          />
          <Route
            
            exact
            path="/forgot"
            component={ForgotPasswordContainer}
          />
          <Route
            
            exact
            path="/otpverify/:emailId"
            component={OTPVerifyContainer}
          />
          <Route
            
            exact
            path="/updatePassword"
            component={SetNewPasswordContainer}
          />
          <Route  path="/about" component={AboutContainer} />
          <Route  path="/am" component={AssessmentModules} />
          <Route  path="/am1" component={AssessmentModules} />
         
          <Redirect from="/" exact to="/login" />
          <Route  path="" component={NotFound} />
        </Switch>
      {/* </Provider> */}
    </Router>
  );
});

export default AppRoutes;
