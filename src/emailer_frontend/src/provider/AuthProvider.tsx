import * as React from "react";
import { actorClient } from "../services/actorClient";
import { AuthManager } from "../services/authClient";
import { useKeys } from "./KeyProvider";

interface Auth {
  principal: string;
  logout: () => void;
  login: () => void;
}

export const AuthContext = React.createContext<Auth>({
  principal: "",
  logout: () => {
    throw new Error("AuthProvider is required");
  },
  login: () => {
    throw new Error("AuthProvider is required");
  },
});

export const useAuth = (): Auth => React.useContext(AuthContext);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const [authClient, setAuthClient] = React.useState<AuthManager | null>();
  const [principal, setPrincipal] = React.useState<string>();

  const { setHasKey } = useKeys();

  React.useEffect(() => {
    setAuthClient(new AuthManager());
  }, []);

  const login = async () => {
    await authClient?.login();
    const whoami = await (await actorClient.whoami()).toText();
    setPrincipal(whoami);
  };

  const logout = async () => {
    await authClient?.logout();
    setPrincipal(undefined);
    setHasKey(false);
  };

  return (
    <AuthContext.Provider
      value={{
        principal,
        logout,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
