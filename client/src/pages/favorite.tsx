import { gql, useMutation, useQuery } from "@apollo/client";
import { HeartSlash } from "iconsax-react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import InfiniteScroll from "../components/InfiniteScroll";
import LoginCard from "../components/LoginCard";
import Card from "../containers/home/Card";
import { HtmlDivElement } from "../containers/home/Cards";
import Layouts from "../layout/Layouts";
import { selectUser } from "../redux/features/userSlice";
import ReactLoading from "react-loading";
import Button from "../components/Button";


const FavoritesQuery = gql`
  query Favorites($input: FavoriteInput) {
    favorites(input: $input) {
      totalItems
      results {
        id
        title
        category
        image {
          url
        }
        price
        stock
        rating
        description
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
      msg
    }
  }
`;

const Favorite: NextPage = () => {
  const user = useSelector(selectUser)
  const { data, loading, refetch, fetchMore } = useQuery(FavoritesQuery, {
    variables: { input: { offset: 0, limit: 10 } },
  });

  const [removeAll] = useMutation(RemoveAllMutation);

  const containerRef = useRef<HtmlDivElement | any>();

  const router = useRouter();

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        input: {
          offset: data?.favorites.results.length,
        },
      },
    });
  };

  return (
    <Layouts ref={containerRef}>
      <Head>
        <title>Favorite</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header
        title="Saved Items"
        subtitle={
          user && data?.favorites.results.length >= 1 ? (
            <p
              onClick={() => {
                removeAll();
                refetch();
              }}
              className="text-blue-500 hover:underline cursor-pointer px-3 py-2"
            >
              Remove all
            </p>
          ) : (
            <p className=""></p>
          )
        }
      />
      {user ? (
        <div className="h-full">
          {!loading ? (
            data?.favorites.results.length >= 1 ? (
              <InfiniteScroll
                containerRef={containerRef}
                hasMore={
                  data?.favorites.results.length < data?.favorites.totalItems
                }
                next={handleFetchMore}
                className={`${
                  data?.favorites.results.length <= 3
                    ? " flex mx-10 flex-wrap md:flex-nowrap"
                    : "flex flex-wrap justify-center"
                } transition-all duration-300 ease w-full`}
                loader={<Loader />}
              >
                {data?.favorites.results.map((props: any, i: number) => (
                  <div key={i}>
                    <Card
                      {...props}
                      refetchAll={() => refetch()}
                      isFavouriteCard
                    />
                  </div>
                ))}
              </InfiniteScroll>
            ) : (
              <div className="flex-[0.35] ml-[5px] h-[80%] grid place-items-center">
                <div className="flex items-center justify-center flex-col">
                  <HeartSlash
                    size={100}
                    className="text-neutral-700 dark:text-neutral-400"
                  />
                  <p className="text-[1.2rem] text-slate-900 dark:text-white">
                    No saved Item
                  </p>

                  <div
                    className="w-[80%] h-[40px] bg-primary rounded-xl flex items-center justify-center m-[10px]  "
                    onClick={() => router.back()}
                  >
                    <p className="text-white text-[1rem] p-[8px]">Go Back</p>
                  </div>
                </div>
              </div>
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
