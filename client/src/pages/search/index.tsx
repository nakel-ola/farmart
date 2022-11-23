import { gql, useQuery } from "@apollo/client";
import { Sort } from "iconsax-react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import ReactLoading from "react-loading";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header";
import Cards from "../../containers/search/Cards";
import setting from "../../data/setting";
import isEqual from "../../helper/isEqual";
import usePrevious from "../../hooks/usePrevious";
import Layouts from "../../layout/Layouts";
import { add } from "../../redux/features/dialogSlice";
import { selectFilter } from "../../redux/features/filterSlice";

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
  const dispatch = useDispatch();


  const filter = useSelector(selectFilter);

  const ref = useRef<HTMLDivElement>(null);

  let prevFilter = usePrevious(filter);

  console.log(router)

  const { data, loading, fetchMore, refetch } = useQuery(SearchQuery, {
    variables: {
      input: {
        search: router.query.q,
        offset: 0,
        limit,
        outOfStock: false,
        ...filter,
      },
    },
    fetchPolicy: "network-only",
    onCompleted: (data) => console.log(data),
    onError: (data) => console.table(data),
  });

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        input: {
          search: router.query.q,
          offset: data.productSearch.results.length,
          limit,
          outOfStock: false,
        },
      },
    });
  };

  useEffect(() => {
    if (!isEqual(filter, prevFilter)) {
      refetch({
        input: {
          search: router.query.q,
          offset: 0,
          limit,
          outOfStock: false,
          ...filter,
        },
      });
    }
  }, [filter, prevFilter, refetch, router.query.q]);

  return (
    <Layouts ref={ref}>
      <Head>
        <title>Search | {router.query.q}</title>
      </Head>

      {loading ? (
        <div className="w-full h-full grid place-items-center">
          <Header />
          <ReactLoading type="spinningBubbles" color={setting.primary} />
        </div>
      ) : (
        data && (
          <div className="mb-2">
            <Header
              title={`${data.productSearch.totalItems} products found`}
              subtitle={
                <button
                  type="button"
                  className="ml-2 h-[35px] w-[35px] flex items-center justify-center rounded-full hover:bg-white hover:dark:bg-dark md:mr-2"
                  onClick={() =>
                    dispatch(add({ data: null, open: true, type: "filter" }))
                  }
                >
                  <Sort className="text-black dark:text-white" />
                </button>
              }
            />
            <div className="mt-8 w-full grid place-items-center transition-all duration-300 ease">
              <Cards
                data={data.productSearch.results}
                totalItems={data.productSearch.totalItems}
                handleFetchMore={handleFetchMore}
                containerRef={ref}
              />
            </div>
          </div>
        )
      )}
    </Layouts>
  );
};

export default Search;
