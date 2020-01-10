import React from "react";
import { Route, Redirect } from "react-router-dom";
import authService from "../services/auth/authService";

function PrivateRoute({ component: Component, path, ...rest }) {
  console.log(Component);
  console.log({ ...rest });

  return (
    <Route
      path={path}
      {...rest}
      render={props =>
        authService.isLoggedIn() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
              // state: {
              //     prevLocation: path,
              //     error: "You need to login first!",
              //   }
            }}
          />
        )
      }
    />
  );
}
export default PrivateRoute;
