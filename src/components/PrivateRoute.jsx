import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

function PrivateRoute({ children }) {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  const loadedComponent = userInfo ? (
    children
  ) : (
    <Navigate to={"/"} state={{ from: location.pathname }} />
  );
  return <div>{loadedComponent}</div>;
}

export default PrivateRoute;
