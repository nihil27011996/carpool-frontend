import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { isSessionValid } from "./session";
export const ProtectedRoutes = ({ children, allowedRoles = [] }) => {
  const { userData } = useSelector((state) => state.user);
  const auth = useSelector((state) => state.authUser);
  const location = useLocation();
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  if (!isSessionValid(auth, userData) || !roles.includes(userData?.commuterType)) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
};
