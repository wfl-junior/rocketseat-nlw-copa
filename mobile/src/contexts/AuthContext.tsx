import * as AuthSession from "expo-auth-session";
import { useAuthRequest } from "expo-auth-session/build/providers/Google";
import * as WebBrowser from "expo-web-browser";
import { createContext, useCallback, useContext, useState } from "react";

WebBrowser.maybeCompleteAuthSession();

interface UserDTO {
  name: string;
  avatarUrl?: string | null;
}

interface AuthContextData {
  user: UserDTO | null;
  signIn: () => Promise<void>;
  isSigningIn: boolean;
}

const AuthContext = createContext({} as AuthContextData);
export const useAuthContext = () => useContext(AuthContext);

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [user, setUser] = useState<UserDTO | null>(null);
  const [, , promptAsync] = useAuthRequest({
    clientId: process.env.GOOGLE_CLIENT_ID,
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ["profile", "email"],
  });

  const signIn: AuthContextData["signIn"] = useCallback(async () => {
    setIsSigningIn(true);

    try {
      const response = await promptAsync();

      if (
        response?.type === "success" &&
        response.authentication?.accessToken
      ) {
        console.log("success");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSigningIn(false);
    }
  }, [promptAsync]);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        isSigningIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
