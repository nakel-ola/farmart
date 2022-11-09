import { ApolloProvider, gql, useQuery } from "@apollo/client";
import type { AppProps } from "next/app";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Provider, useDispatch } from "react-redux";
import PageLoader from "../components/PageLoader";
import { useApollo } from "../hooks/useApollo";
import { login } from "../redux/features/userSlice";
import { wrapper } from "../redux/store";
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
    <ThemeProvider
      enableSystem={true}
      attribute="class"
      storageKey="farmart-admin-theme"
      defaultTheme="light"
    >
      <Provider store={store}>
        <ApolloProvider client={client}>
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
          <Wrapper>
            <Toaster />
            {mount && <Component {...pageProps} />}
            {loading && <PageLoader />}
          </Wrapper>
        </ApolloProvider>
      </Provider>
    </ThemeProvider>
  );
}

const Wrapper = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading } = useQuery(EmyployeeQuery, {
    onCompleted: (data) => {
      console.log(data);
      if (data.employee?.__typename === "Employee") {
        dispatch(login(data.employee));
        router.push("/dashboard");
      }

      if (data.employee?.__typename === "ErrorMsg") {
        router.push("/");
      }
    },
  });

  return <>{loading ? <PageLoader fill /> : children}</>;
};

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

export default MyApp;
