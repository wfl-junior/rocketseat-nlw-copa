import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { Box, NativeBaseProvider } from "native-base";
import { Fragment } from "react";
import { StatusBar } from "react-native";
import { Loading } from "~/components/Loading";
import { AuthContextProvider } from "~/contexts/AuthContext";
import { Pools } from "~/screens/Pools";
import { theme } from "~/styles/theme";

const App: React.FC = () => {
  const [areFontsReady] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  return (
    <Fragment>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />

      <NativeBaseProvider theme={theme}>
        <AuthContextProvider>
          <Box flex={1} bgColor="gray.900">
            {areFontsReady ? <Pools /> : <Loading />}
          </Box>
        </AuthContextProvider>
      </NativeBaseProvider>
    </Fragment>
  );
};

export default App;
