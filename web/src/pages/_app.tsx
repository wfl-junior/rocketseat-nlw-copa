import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";

const App: NextPage<AppProps> = ({ Component, pageProps }) => (
  <div className="flex min-h-screen flex-col">
    <ToastContainer theme="dark" />
    <Component {...pageProps} />
  </div>
);

export default App;
