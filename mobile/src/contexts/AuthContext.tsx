import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import { useAuthRequest } from "expo-auth-session/build/providers/Google";
import * as WebBrowser from "expo-web-browser";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
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
const accessTokenStorageKey = "@nlw-copa/access-token";

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [isSigningIn, setIsSigningIn] = useState(true);
  const [user, setUser] = useState<UserDTO | null>(null);
  const [, , promptAsync] = useAuthRequest({
    clientId: process.env.GOOGLE_CLIENT_ID,
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    AsyncStorage.getItem(accessTokenStorageKey)
      .then(async accessToken => {
        if (!accessToken) return;

        api.defaults.headers.authorization = `Bearer ${accessToken}`;
        const { data } = await api.get<{ user: UserDTO }>("/auth/me");
        setUser(data.user);
      })
      .catch(console.log)
      .finally(() => setIsSigningIn(false));
  }, []);

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
        AsyncStorage.setItem(accessTokenStorageKey, accessToken).catch(
          console.log,
        );
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
