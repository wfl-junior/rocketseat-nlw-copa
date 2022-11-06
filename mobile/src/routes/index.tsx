import { NavigationContainer } from "@react-navigation/native";
import { Box } from "native-base";
import { useAuthContext } from "~/contexts/AuthContext";
import { SignIn } from "~/screens/SignIn";
import { AppRoutes } from "./AppRoutes";

interface RoutesProps {}

export const Routes: React.FC<RoutesProps> = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <Box flex={1} bgColor="gray.900">
      <NavigationContainer>
        {isAuthenticated ? <AppRoutes /> : <SignIn />}
      </NavigationContainer>
    </Box>
  );
};
