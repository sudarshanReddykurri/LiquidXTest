import React from "react";
import { Route, Redirect } from "react-router-dom";
import authService from "../services/auth/authService";

function NoAuthRoute({ component: Component, path, ...rest }) {
  console.log(Component);
  console.log({ ...rest });

  return (
    <Route
      path={path}
      {...rest}
      render={props =>
        authService.isLoggedIn() ? (
          <Redirect
            to={{
              pathname: "/home",
              state: { from: props.location }
              //   state: {
              //     prevLocation: path,
              //     error: "You need to login first!"
              //   }
            }}
          />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
}
export default NoAuthRoute;
