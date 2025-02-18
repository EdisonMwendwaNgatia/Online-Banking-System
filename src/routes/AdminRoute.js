// src/components/AdminRoute.js
import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const AdminRoute = ({ element: Component, ...rest }) => {
  const { currentUser } = useContext(AuthContext);

  // Assuming admin status is stored in the user's metadata or Firebase DB
  const isAdmin = currentUser && currentUser.email === "admin@example.com"; // Replace with your condition

  return (
    <Route
      {...rest}
      element={isAdmin ? <Component /> : <Redirect to="/dashboard" />}
    />
  );
};

export default AdminRoute;
