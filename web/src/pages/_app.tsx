import type { NextPage } from "next";
import type { AppProps } from "next/app";
import "../styles/globals.css";

const App: NextPage<AppProps> = ({ Component, pageProps }) => (
  <Component {...pageProps} />
);

export default App;
