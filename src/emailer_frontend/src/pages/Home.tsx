import React from "react";
import { EmailForm } from "../components/EmailForm";
import { KeyForm } from "../components/KeyForm";
import { useAuth } from "../provider/AuthProvider";
import { useKeys } from "../provider/KeyProvider";

export const Home = () => {
  const { hasKey } = useKeys();
  const { logout } = useAuth();

  return (
    <>
      <a className="logout" onClick={() => logout()}>
        Logout
      </a>
      {hasKey ? <EmailForm /> : <KeyForm />}
    </>
  );
};
