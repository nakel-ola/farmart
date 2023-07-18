import { Bag2 } from "iconsax-react";
import React from "react";
import { Product } from "../../../typing";
import InfiniteScroll from "../../components/InfiniteScroll";
import { Loader } from "../../pages/favorite";
import Card from "../home/Card";

type Props = {
  data: Product[];
  containerRef: any;
  totalItems: number;
  handleFetchMore(): void;
  updateFavorite(id: string, favorite: boolean): void
};

const Cards = (props: Props) => {
  const { containerRef, data, totalItems, handleFetchMore,updateFavorite } = props;
  return (
    <div className="mb-[40px] w-[95%] pb-2 ">
      {data.length > 0 ? (
        <InfiniteScroll
          containerRef={containerRef}
          hasMore={data.length < totalItems}
          next={handleFetchMore}
          className={`grid grid-cols-2 gap-2 md:grid-cols-4 transition-all duration-300 ease w-full`}
          loader={<Loader />}
        >
          {data.map((item: Product, index: number) => (
            <Card key={index} {...item} updateFavorite={updateFavorite} />
          ))}
        </InfiniteScroll>
      ) : (
        <div className="grid my-10 place-items-center">
          <div className="flex items-center justify-center flex-col">
            <Bag2
              size={100}
              className="text-neutral-700 dark:text-neutral-400"
            />
            <p className="text-neutral-700 dark:text-neutral-400 text-lg font-semibold my-1">
              No Product Found
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
