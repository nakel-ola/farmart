import { gql, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import ReactLoading from "react-loading";
import Header from "../../components/Header";
import Cards from "../../containers/search/Cards";
import setting from "../../data/setting";
import Layouts from "../../layout/Layouts";

const SearchQuery = gql`
  query ProductSearch($input: ProductSearchInput!) {
    productSearch(input: $input) {
      totalItems
      search
      results {
        id
        title
        category
        description
        image {
          url
        }
        price
        slug
        stock
        rating
        currency {
          symbol
        }
      }
    }
  }
`;

let limit = 10;

const Search: NextPage = () => {
  const router = useRouter();

  const ref = useRef<HTMLDivElement>(null);

  const { data, loading, fetchMore } = useQuery(SearchQuery, {
    variables: {
      input: { search: router.query.id, offset: 0, limit, outOfStock: false },
    },
    fetchPolicy: "network-only",
  });

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        input: {
          search: router.query.id,
          offset: data.productSearch.results.length,
          limit,
          outOfStock: false,
        },
      },
    });
  };

  return (
    <Layouts ref={ref}>
      <Head>
        <title>Search {router.query.id}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {loading ? (
        <div className="w-full h-full grid place-items-center">
          <ReactLoading type="spinningBubbles" color={setting.primary} />
        </div>
      ) : data && data.productSearch.results.length > 0 ? (
        <div className="mb-2">
          <Header
            title={`Search result for "${router.query.id}"`}
            subtitle={
              <p className="text-[1.5rem] font-[600] text-black dark:text-white">
                ({data.productSearch.totalItems})
              </p>
            }
          />
          <Cards
            data={data.productSearch.results}
            totalItems={data.productSearch.totalItems}
            handleFetchMore={handleFetchMore}
            containerRef={ref}
          />
        </div>
      ) : (
        <div className="w-full flex items-center justify-center py-[5px]">
          <p className="text-[1.5rem] font-[600]  text-black dark:text-white">
            No results for "{router.query.id}"
          </p>
        </div>
      )}
    </Layouts>
  );
};

export default Search;
