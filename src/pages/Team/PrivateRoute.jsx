import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/useAuthContext";

const PrivateRoute = ({ children }) => {
  const { user, authIsReady } = useAuthContext();

  if (!authIsReady) {
    return <p>Carregando...</p>;
  }

  if (!user) {
    return <Navigate to="/login-client" />;
  }

  return children;
};

export default PrivateRoute;
