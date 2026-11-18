import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/web-icon.png" type="image/png" />
        <link rel="shortcut icon" href="/web-icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/web-icon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
