import * as React from "react";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { useAuth } from "../provider/AuthProvider";

export const Routes = () => {
  const { principal } = useAuth();

  if (!principal) {
    return <Login />;
  }
  return <Home />;
};
