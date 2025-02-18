// src/components/PrivateRoute.js
import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { currentUser } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      element={currentUser ? <Component /> : <Redirect to="/login" />}
    />
  );
};

export default PrivateRoute;
