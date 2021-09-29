import Head from "next/head";

export default function Layout({ children, ...props }) {
  return (
    <main className="max-w-4xl mx-auto text-base md:text-2xl" {...props}>
      <Head>
        <meta name="viewport" content="width=device-width" />
        <meta charSet="utf-8" />
        <title>Cranes (for special wallets)</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </Head>
      {children}
    </main>
  );
}
