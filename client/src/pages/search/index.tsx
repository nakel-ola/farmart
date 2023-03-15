import { gql, useQuery } from "@apollo/client";
import { Sort } from "iconsax-react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
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
import { SearchQuerys } from "../../types/graphql.types";

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
        image
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

  const [data, setData] = useState<SearchQuerys["productSearch"] | null>(null);

  const { loading, fetchMore, refetch } = useQuery<SearchQuerys>(SearchQuery, {
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
    onCompleted: (data) => setData(data.productSearch),
    onError: (data) => console.table(data),
  });

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        input: {
          search: router.query.q,
          offset: data?.results.length,
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

  const updateFavorite = (id: string, favorite: boolean) => {
    if (!data) return;
    let newProducts = [...data?.results];

    const inx = newProducts.findIndex((p) => p.id === id);

    if (inx === -1) return;

    newProducts[inx] = { ...newProducts[inx], favorite };

    setData({ ...data, results: newProducts });
  };

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
              title={`${data.totalItems} products found`}
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
                data={data.results}
                totalItems={data.totalItems}
                handleFetchMore={handleFetchMore}
                containerRef={ref}
                updateFavorite={updateFavorite}
              />
            </div>
          </div>
        )
      )}
    </Layouts>
  );
};

export default Search;
