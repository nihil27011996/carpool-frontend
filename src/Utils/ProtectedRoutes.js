import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { isSessionValid } from "./session";
export const ProtectedRoutes = ({ children, allowedRoles = [] }) => {
  const { userData } = useSelector((state) => state.user);
  const auth = useSelector((state) => state.authUser);
  const location = useLocation();
  const checkAuthentication = () => {
    // Assuming you want to handle different roles differently or extend the logic
    return allowedRoles.includes(userData?.commuterType);
  };
  const isAuthenticated = checkAuthentication();

  if (!isAuthenticated) {
    // Redirect to the login page, but save the current location they were
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
};
