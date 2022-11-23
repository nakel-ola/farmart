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
        <Provider store={store}>
          <ApolloProvider client={client}>
            <Wrapper>
              <Toaster />

              <Component {...pageProps} />
              {loading && <PageLoader />}
            </Wrapper>
          </ApolloProvider>
        </Provider>
      </ThemeProvider>
    </>
  );
}

// export const UserQuery = gql`
//   query User {
//     user {
//       ... on User {
//         id
//         email
//         name
//         photoUrl
//         blocked
//         gender
//         birthday
//         phoneNumber
//         createdAt
//         updatedAt
//       }

//       ... on ErrorMsg {
//         error
//       }
//     }
//   }
// `;

// export const CategoriesQuery = gql`
//   query Categories {
//     categories {
//       name
//     }
//   }
// `;
export default MyApp;
