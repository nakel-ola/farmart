import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Router } from "next/router";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import PageLoader from "../components/PageLoader";
import { useApollo } from "../hooks/useApollo";
import Wrapper from "../layout/Wrapper";
import { wrapper } from "../redux/store";
import "../styles/globals.css";
import { ThemeProvider } from "../styles/theme";
import { SessionProvider } from "next-auth/react";



function MyApp({ Component, ...others }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(others);

  const { pageProps } = props;
  const client = useApollo((pageProps as any)?.initialApolloState);

  const [loading, setLoading] = useState(false);

  Router.events.on("routeChangeStart", () => setLoading(true));
  Router.events.on("routeChangeError", () => setLoading(false));
  Router.events.on("routeChangeComplete", () => setLoading(false));

  return (
    <>
      <Head>
        <link rel="icon" href="/color-logo.png" />
      </Head>
      <ThemeProvider
        enableSystem={true}
        attribute="class"
        storageKey="farmart-theme"
        defaultTheme="light"
      >
        <SessionProvider session={props.pageProps.session}>
          <Provider store={store}>
            <ApolloProvider client={client}>
              <Wrapper>
                <Toaster />

                <Component {...pageProps} />
                {loading && <PageLoader />}
              </Wrapper>
            </ApolloProvider>
          </Provider>
        </SessionProvider>
      </ThemeProvider>
    </>
  );
}
export default MyApp;
