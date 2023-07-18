import { gql, useMutation, useQuery } from "@apollo/client";
import { AnimatePresence } from "framer-motion";
import { HeartSlash } from "iconsax-react";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import React, { useRef, useState } from "react";
import ReactLoading from "react-loading";
import { Product } from "../../typing";
import Button from "../components/Button";
import DeleteCard from "../components/DeleteCard";
import Header from "../components/Header";
import InfiniteScroll from "../components/InfiniteScroll";
import LoginCard from "../components/LoginCard";
import Card from "../containers/home/Card";
import { HtmlDivElement } from "../containers/home/Cards";
import Layouts from "../layout/Layouts";
import { FavoritesResponse } from "../types/graphql.types";

const FavoritesQuery = gql`
  query Favorites($input: FavoriteInput) {
    favorites(input: $input) {
      totalItems
      results {
        id
        title
        image
        price
        stock
        favorite
        description
        discount
        currency {
          symbol
        }
      }
    }
  }
`;

const RemoveAllMutation = gql`
  mutation RemoveAllFromFavorites {
    removeAllFromFavorites {
      message
    }
  }
`;

const Favorite: NextPage = () => {
  const { data: sessionData } = useSession();
  const user = sessionData?.user;

  const [data, setData] = useState<FavoritesResponse["favorites"] | null>(null);
  const [toggle, setToggle] = useState(false);

  const { loading, refetch, fetchMore } = useQuery<FavoritesResponse>(
    FavoritesQuery,
    {
      variables: { input: { offset: 0, limit: 10 } },
      onCompleted: (data) => setData({ ...data.favorites }),
      onError: (err) => console.table(err),
    }
  );

  const onClose = () => setToggle(false);

  const [removeAll, { loading: removeAllLoading }] = useMutation(
    RemoveAllMutation,
    {
      onCompleted: () => {
        refetch();
        onClose();
      },
      onError: (err) => console.table(err),
    }
  );

  const containerRef = useRef<HtmlDivElement | any>();

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        input: {
          offset: data?.results.length,
        },
      },
    });
  };

  const updateFavorite = (id: string, args: boolean) => {
    if (!data) return;
    let newProducts = [...data?.results];

    const inx = newProducts.findIndex((p) => p.id === id);

    if (inx === -1) return;

    const product = { ...newProducts[inx], favorite: args };

    newProducts[inx] = product;

    setData({ ...data, results: newProducts });
  };

  return (
    <>
      <Layouts ref={containerRef}>
        <Head>
          <title>Favorite</title>
        </Head>

        <Header
          title="Saved Items"
          subtitle={
            user && data && data.results.length >= 1 ? (
              <button onClick={() => setToggle(true)}>
                <p className="text-blue-500 hover:underline cursor-pointer px-3 py-2">
                  Remove all
                </p>
              </button>
            ) : (
              <></>
            )
          }
        />
        {user ? (
          <div className="h-full flex items-center">
            {!loading ? (
              data && (
                <CardsContainer
                  data={data.results}
                  containerRef={containerRef}
                  handleFetchMore={handleFetchMore}
                  totalItems={data.totalItems}
                  updateFavorite={updateFavorite}
                />
              )
            ) : (
              <div className="w-full h-[80%] grid place-items-center">
                <ReactLoading type="spinningBubbles" />
              </div>
            )}
          </div>
        ) : (
          <LoginCard />
        )}
      </Layouts>

      <AnimatePresence>
        {toggle && (
          <DeleteCard
            loading={removeAllLoading}
            message="Are you sure you want to delete all favorite ?"
            onClose={onClose}
            onDelete={removeAll}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Favorite;

export const Loader = () => {
  return (
    <div className="min-h-[20px] w-full flex items-center justify-center p-[10px]">
      <Button className="bg-transparent text-primary">Loading More..</Button>
    </div>
  );
};

type Props = {
  data: Product[];
  containerRef: any;
  totalItems: number;
  handleFetchMore: () => void;
  updateFavorite: (id: string, args: boolean) => void;
};

const CardsContainer = (props: Props) => {
  const { containerRef, data, totalItems, handleFetchMore, updateFavorite } =
    props;
  return (
    <div className="my-[20px] w-[calc(100%-20px)] mr-5 h-full pb-2 ml-5">
      {data.length > 0 ? (
        <InfiniteScroll
          containerRef={containerRef}
          hasMore={data.length < totalItems}
          next={handleFetchMore}
          className={`grid grid-cols-2 gap-2 md:grid-cols-4 transition-all duration-300 ease w-full`}
          loader={<Loader />}
        >
          {data.map(
            (item: Product, index: number) =>
              item.favorite && (
                <Card
                  key={index}
                  {...item}
                  updateFavorite={updateFavorite}
                  isFavouriteCard
                />
              )
          )}
        </InfiniteScroll>
      ) : (
        <div className="grid my-10 place-items-center">
          <div className="flex items-center justify-center flex-col">
            <HeartSlash
              size={100}
              className="text-neutral-700 dark:text-neutral-400"
            />
            <p className="text-neutral-700 dark:text-neutral-400 text-lg font-semibold my-1">
              No saved Item
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
