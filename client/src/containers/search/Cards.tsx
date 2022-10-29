import React from "react";
import { Product } from "../../../typing";
import InfiniteScroll from "../../components/InfiniteScroll";
import { Loader } from "../../pages/favorite";
import Card from "../home/Card";

type Props = {
  data: Product[];
  containerRef: any;
  totalItems: number;
  handleFetchMore: () => void;
};

const Cards = ({ containerRef, data, totalItems, handleFetchMore  }: Props) => {
  
  return (
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
        <div key={index}>
          <Card {...item} />
        </div>
      ))}
    </InfiniteScroll>
  );
};

export default Cards;
