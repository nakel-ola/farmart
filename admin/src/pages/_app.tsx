import { ApolloProvider, gql } from "@apollo/client";
import { NextPageContext } from "next";
import cookies from "next-cookies";
import type { AppProps } from "next/app";
import Head from "next/head";
import Router from "next/router";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import PageLoader from "../components/PageLoader";
import { initializeApollo, useApollo } from "../hooks/useApollo";
import { login, logout, setCookies } from "../redux/features/userSlice";
import { RootState, wrapper } from "../redux/store";
import "../styles/globals.css";
import { ThemeProvider } from "../styles/theme";

function MyApp({ Component, ...others }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(others);

  const { pageProps } = props;
  const [mount, setMount] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const client = useApollo((pageProps as any)?.initialApolloState!);

  Router.events.on("routeChangeStart", () => setLoading(true));
  Router.events.on("routeChangeError", () => setLoading(false));
  Router.events.on("routeChangeComplete", () => setLoading(false));

  useEffect(() => {
    setMount(true);
  }, []);

  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <ThemeProvider enableSystem={true} attribute="class">
          <Head>
            <link
              rel="preload"
              href="/fonts/Inter-Medium.otf"
              as="font"
              crossOrigin=""
            />
            <link
              rel="preload"
              href="/fonts/advio/Advio Bold.otf"
              as="font"
              crossOrigin=""
            />
          </Head>
          <Toaster />
          {mount && <Component {...pageProps} />}
          {loading && <PageLoader />}
        </ThemeProvider>
      </ApolloProvider>
    </Provider>
  );
}

export const EmyployeeQuery = gql`
  query Employee {
    employee {
      __typename
      ... on Employee {
        id
        email
        name
        photoUrl
        level
        gender
        birthday
        phoneNumber
        createdAt
        updatedAt
      }

      ... on ErrorMsg {
        error
      }
    }
  }
`;

MyApp.getInitialProps = wrapper.getInitialPageProps(
  (store) => async (ctx: NextPageContext) => {
    const token = cookies((ctx as any).ctx);

    const apolloClient = initializeApollo();
    
    const newStore: RootState = store.getState();

    if (token?.auth && !newStore.user.cookies) {
      store.dispatch(setCookies({ auth: token?.auth }));
    } else {
      store.dispatch(logout());
    }

    if (token?.auth && !newStore?.user?.user) {
      await apolloClient
        .query({
          query: EmyployeeQuery,
        })
        .then((result: any) => {
          if (result.employee?.__typename !== "ErrorMsg") {
            store.dispatch(login(result.employee));
          }
        });
    } else {
      store.dispatch(logout());
    }

    return {
      initialApolloState: apolloClient.cache.extract(),
    };
  }
);

export default MyApp;
