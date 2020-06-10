import React, { Component, Fragment } from "react";

export const AppContext = React.createContext({
  emailID: "",
  isUserRegisteredForEngagement: false,
  setEmailID: () => {},
  setIsUserRegisteredForEngagement: () => {},
});

export class AppContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailID: "",
      isUserRegisteredForEngagement: false,
      setEmailID: (emailID) => {
        this.setState({
          emailID: emailID,
        });
      },
      setIsUserRegisteredForEngagement: (isAnEngagementUser)=>{
        this.setState({
          isUserRegisteredForEngagement: isAnEngagementUser
        })
      }
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
