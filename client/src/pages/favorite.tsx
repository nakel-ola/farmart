import { gql, useMutation, useQuery } from "@apollo/client";
import { Heart, HeartSlash } from "iconsax-react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import ReactLoading from "react-loading";
import { useSelector } from "react-redux";
import { Product } from "../../typing";
import Button from "../components/Button";
import Header from "../components/Header";
import InfiniteScroll from "../components/InfiniteScroll";
import LoginCard from "../components/LoginCard";
import Card from "../containers/home/Card";
import { HtmlDivElement } from "../containers/home/Cards";
import Cards from "../containers/search/Cards";
import Layouts from "../layout/Layouts";
import { selectUser } from "../redux/features/userSlice";

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
  const user = useSelector(selectUser);
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
        <div className="h-full grid place-items-center">
          {!loading ? (
            data?.favorites && (
              <CardsContainer
                data={data?.favorites.results}
                containerRef={containerRef}
                handleFetchMore={handleFetchMore}
                totalItems={data?.favorites.totalItems}
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
};

const CardsContainer = ({
  containerRef,
  data,
  totalItems,
  handleFetchMore,
}: Props) => {
  return (
    <div className="my-[20px] w-[95%] pb-2">
      {data.length > 0 ? (
        <InfiniteScroll
          containerRef={containerRef}
          hasMore={data.length < totalItems}
          next={handleFetchMore}
          className={`${
            data.length <= 3 ? " flex mx-10" : "flex flex-wrap justify-center"
          } transition-all duration-300 ease w-full`}
          loader={<Loader />}
        >
          {data.map((item: Product, index: number) => (
            <Card key={index} {...item} />
          ))}
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
