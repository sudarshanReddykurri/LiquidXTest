import React, { Component } from "react";
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { registerNav } from "./services/navigation";
import AppRoutes from "./routes";
import NavBar from "./shared/NavBar";
import apiCall from "./services/apiCalls/apiService";
import { setUpRootStore } from './store/setup';
import { Provider } from "mobx-react";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rootTree : null
    };
    this.ref = React.createRef();
    document.title = "PerspectAI"
  }

  componentDidMount() {
    const {rootTree} = setUpRootStore();
    this.setState({
      rootTree
    });

    console.log("ref", this.ref);
    let data = {};
    data.device_id = "1234";
    data.device_model = "not know";
    data.screen_size = "120*240";
    data.ram = "3gb";
    data.login_id = "sudarshan@loopreality.com";
    data.passwd = "ssss";
    data.os_version = "1";
    data.screen_dpi = "1";
    data.version = "2.01.10";
    data.fcm_token = "lol";

    apiCall
      .userLogin(data)
      .then(rsp => {
        // if you want to have one result across the app for an action, you can handle the result of this promise inside of the eventService.js file.  This will allow you to provide repeatable functioanlity across your app for events that will be used often.
        //if the event will need custom functionality, simply return the promise from the eventService.js file and handle it in the component
        console.log("TCL: App -> componentDidMount -> rsp", rsp);
      })
      .catch(err => {
        // handle your error here
        console.log("TCL: App -> componentDidMount -> err", err);
      });
  }

  render() {
    const { rootTree } = this.state;
    if(!rootTree) return null
    return (
      <Provider rootTree={rootTree}>
      <AppRoutes
        ref={routerRef => {
          // this.ref = routerRef;
          registerNav(routerRef);
        }}
      ></AppRoutes>
      </Provider>
    );
  }
}

export default App;
