import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { NativeBaseProvider } from "native-base";
import { Fragment } from "react";
import { StatusBar } from "react-native";
import { Loading } from "~/components/Loading";
import { AuthContextProvider } from "~/contexts/AuthContext";
import { Routes } from "~/routes";
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
          {areFontsReady ? <Routes /> : <Loading />}
        </AuthContextProvider>
      </NativeBaseProvider>
    </Fragment>
  );
};

export default App;
