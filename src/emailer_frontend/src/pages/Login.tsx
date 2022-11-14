import React from "react";
import { useAuth } from "../provider/AuthProvider";
import IcLogo from "../../assets/ic_logo.svg";

export const Login = () => {
  const { login } = useAuth();

  return (
    <div className="login">
      <h1>IC Emailer</h1>

      <div className="logo">
        <IcLogo />
        Internet Identity
      </div>

      <button onClick={() => login()}>Login With Internet Identity</button>
    </div>
  );
};
