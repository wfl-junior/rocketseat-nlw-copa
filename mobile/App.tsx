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
import { SignIn } from "~/screens/SignIn";
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
        {areFontsReady ? <SignIn /> : <Loading />}
      </NativeBaseProvider>
    </Fragment>
  );
};

export default App;
