import type { ObservableQuery } from "@apollo/client";
import clsx from "clsx";
import { useRouter } from "next/router";
import { FC, RefObject } from "react";
import { useSelector } from "react-redux";
import { Product } from "../../../typing";
import InfiniteScroll from "../../components/InfiniteScroll";
import and from "../../helper/and";
import { Loader } from "../../pages/favorite";
import { selectCatagory } from "../../redux/features/categorySlice";
import Card from "./Card";
import Header from "./Header";

type Props = {
  refetch: any;
  products: Product[];
  fetchMore: ObservableQuery["fetchMore"];
  containerRef: RefObject<HTMLDivElement>;
  totalItems: number;
  updateFavorite: (id: string, args: boolean) => void;
};

const CardsContainer: FC<Props> = (props) => {
  const { products, fetchMore, containerRef, totalItems, updateFavorite } =
    props;
  const router = useRouter();

  const categories = useSelector(selectCatagory);
  const genre = router.query.genre?.toString();
  const isPath = "/" === router.pathname;

  const category = categories.find((category) => {
    if (and(isPath, category.name.toLowerCase() === "all", !genre))
      return category;

    if (
      and(isPath, genre, category.name.toLowerCase() === genre?.toLowerCase())
    )
      return category;
  });

  const data = category
    ? category.name.toLowerCase() === "all"
      ? products
      : products.filter((product: any) => product.category.includes(genre))
    : [];

  const handleFetchMore = () => {
    fetchMore({
      variables: { input: { genre, offset: products.length, limit: 10 } },
    });
  };

  return (
    <div className="mb-8 w-[calc(100%-20px)] mx-5 ">
      <Header categories={[...categories.map((category) => category.name)]} />
      <InfiniteScroll
        containerRef={containerRef}
        hasMore={products.length < totalItems}
        next={handleFetchMore}
        className={clsx(
          "transition-all duration-300 ease w-full grid grid-cols-2 gap-2 md:grid-cols-4",
        )}
        loader={<Loader />}
      >
        {data.map((item: any, index: number) => (
          <Card key={index} {...item} updateFavorite={updateFavorite} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default CardsContainer;
