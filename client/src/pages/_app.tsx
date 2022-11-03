import { ApolloProvider, gql } from "@apollo/client";
import cookies from "next-cookies";
import type { AppProps } from "next/app";
import { Router } from "next/router";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import PageLoader from "../components/PageLoader";
import { initializeApollo, useApollo } from "../hooks/useApollo";
import Wrapper from "../layout/Wrapper";
import { add } from "../redux/features/categorySlice";
import { login, setCookies } from "../redux/features/userSlice";
import { RootState, wrapper,persistor } from "../redux/store";
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
    <Provider store={store}>
      <PersistGate persistor={persistor(store)} loading={<PageLoader fill />}>
        <ApolloProvider client={client}>
          <ThemeProvider
            enableSystem={true}
            attribute="class"
            storageKey="wujo-theme"
            defaultTheme="light"
          >
            <Wrapper>
              <Toaster />

              <Component {...pageProps} />
              {loading && <PageLoader />}
            </Wrapper>
          </ThemeProvider>
        </ApolloProvider>
      </PersistGate>
    </Provider>
  );
}

export const UserQuery = gql`
  query User {
    user {
      ... on User {
        id
        email
        name
        photoUrl
        blocked
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

export const CategoriesQuery = gql`
  query Categories {
    categories {
      name
    }
  }
`;

MyApp.getInitialProps = wrapper.getInitialPageProps(
  (store) => async (ctx: any) => {
    const token = cookies(ctx.ctx);
    const apolloClient = initializeApollo();

    const newStore: RootState = store.getState();

    if (newStore.category.category.length === 0) {
      await apolloClient
        .query({
          query: CategoriesQuery,
        })
        .then((result: any) => {
          store.dispatch(add([{ name: "All" }, ...result.data.categories]));
        });
    }

    if (token?.grocery && !newStore.user.cookies) {
      store.dispatch(setCookies({ grocery: token.grocery }));
    }

    if (token?.grocery && !newStore?.user?.user) {
      await apolloClient
        .query({
          query: UserQuery,
        })
        .then((result: any) => {
          if (result.user?.__typename !== "ErrorMsg") {
            store.dispatch(login(result.user));
          }
        });
    }

    return {
      initialApolloState: apolloClient.cache.extract(),
    };
  }
);
export default MyApp;
