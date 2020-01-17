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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rootTree: null
    };
    this.ref = React.createRef();
    document.title = "PerspectAI";
  }

  componentDidMount() {
    const { rootTree } = setUpRootStore();
    this.setState({
      rootTree
    });
  }

  render() {
    const { rootTree } = this.state;
    if (!rootTree) return null;
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
