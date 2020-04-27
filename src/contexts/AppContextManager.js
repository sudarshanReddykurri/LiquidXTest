import React, { Component, Fragment } from "react";

export const AppContext = React.createContext({
  emailID: "",
  setEmailID: () => {},
});

export class AppContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailID: "",
      setEmailID: (emailID) => {
        this.setState({
          emailID: emailID,
        });
      },
    };
  }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}
