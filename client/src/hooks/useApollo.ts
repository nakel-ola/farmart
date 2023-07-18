/* eslint-disable react-hooks/rules-of-hooks */
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { useMemo } from "react";
import useApolloMerge from "./useApolloMerge";
import { getSession } from "next-auth/react";
import { setContext } from "@apollo/client/link/context";
import clean from "../helper/clean";



let apolloClient: any;

const httpLink = createUploadLink({
  uri: process.env.SERVER_URL,
  credentials: "include",
  headers: {
    "Apollo-Require-Preflight": "true",
  },
});


const authLink = setContext(async (_, { headers }) => {
  // get the authorization token from local storage

  const session = await getSession();

  const accessToken = session ? session?.user.accessToken : null;

  return {
    headers: clean({
      ...headers,
      "x-access-token": accessToken,
    }),
  };
});


const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        favorites: {
          keyArgs: ["id"],
          merge(existing = [], incoming) {
            const data = useApolloMerge(
              existing.results ?? [],
              incoming.results
            );
            const newData = {
              results: data,
              totalItems: incoming.totalItems,
            };
            return newData;
          },
        },
        products: {
          keyArgs: ["id"],
          merge(existing = [], incoming) {
            const data = useApolloMerge(
              existing.results ?? [],
              incoming.results
            );

            const newData = {
              results: data,
              totalItems: incoming.totalItems,
            };
            return newData;
          },
        },
        productSearch: {
          keyArgs: ["id"],
          merge(existing = [], incoming) {
            const data = useApolloMerge(
              existing.results ?? [],
              incoming.results
            );

            const newData = {
              search: incoming.search,
              results: data,
              totalItems: incoming.totalItems,
            };
            return newData;
          },
        },
        orders: {
          keyArgs: ["id"],
          merge(existing = [], incoming) {
            const data = useApolloMerge(
              existing.results ?? [],
              incoming.results ?? []
            );

            const newData = {
              results: data,
              totalItems: incoming.totalItems,
            };
            return newData;
          },
        },
      },
    },
  },
});

export function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: authLink.concat(httpLink),
    cache,
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState: any) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
