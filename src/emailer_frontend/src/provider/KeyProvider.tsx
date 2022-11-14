import * as React from "react";
import { actorClient } from "../services/actorClient";

interface Keys {
  hasKey: boolean;
  setHasKey: (hasKey: boolean) => void;
  removeKey: () => void;
}

export const KeyContext = React.createContext<Keys>({
  hasKey: false,
  setHasKey: () => {
    throw new Error("AuthProvider is required");
  },
  removeKey: () => {
    throw new Error("AuthProvider is required");
  },
});

export const useKeys = (): Keys => React.useContext(KeyContext);

export const KeyProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const [hasKey, setHasKey] = React.useState<boolean>();

  const checkForKey = async () => {
    try {
      const hasKeyResponse = await actorClient.hasKeyRegistered();
      setHasKey(hasKeyResponse);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    checkForKey();
  }, []);

  const removeKey = async () => {
    await actorClient.removeKey();
    setHasKey(false);
  };

  return (
    <KeyContext.Provider
      value={{
        hasKey,
        setHasKey,
        removeKey,
      }}
    >
      {children}
    </KeyContext.Provider>
  );
};
