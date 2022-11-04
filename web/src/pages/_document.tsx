import type { NextPage } from "next";
import { Head, Html, Main, NextScript } from "next/document";

const Document: NextPage = () => (
  <Html>
    <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
        rel="stylesheet"
      />
    </Head>

    <body className="bg-app bg-gray-900 bg-cover bg-no-repeat antialiased">
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
