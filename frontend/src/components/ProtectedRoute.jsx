import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, user } = useUser();
  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }

  const isAuthority = user?.publicMetadata?.role === "authority";

  if (isAuthority) {
    return <Navigate to="/authority" />;
  }
  return children;
};

export default ProtectedRoute;
