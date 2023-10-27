import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

function PublicRoute({ children }) {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  const loadedComponent = userInfo ? (
    <Navigate
      to={location?.state?.from ? location?.state?.from : "/dashboard"}
    />
  ) : (
    children
  );
  return <div>{loadedComponent}</div>;
}

export default PublicRoute;
