import * as AuthSession from "expo-auth-session";
import { useAuthRequest } from "expo-auth-session/build/providers/Google";
import * as WebBrowser from "expo-web-browser";
import { createContext, useCallback, useContext, useState } from "react";
import { api } from "~/services/api";

WebBrowser.maybeCompleteAuthSession();

interface UserDTO {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  avatarUrl?: string | null;
}

interface AuthContextData {
  user: UserDTO | null;
  isAuthenticated: boolean;
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
        const {
          data: { user, accessToken },
        } = await api.post<{ user: UserDTO; accessToken: string }>(
          "/auth/login",
          undefined,
          {
            headers: {
              authorization: `Bearer ${response.authentication.accessToken}`,
            },
          },
        );

        setUser(user);
        api.defaults.headers.authorization = `Bearer ${accessToken}`;
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
        isAuthenticated: !!user,
        signIn,
        isSigningIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
