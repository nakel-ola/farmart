import { ApolloQueryResult } from "@apollo/client";
import { useRouter } from "next/router";
import { RefObject } from "react";
import { useSelector } from "react-redux";
import { Product } from "../../../typing";
import InfiniteScroll from "../../components/InfiniteScroll";
import { Loader } from "../../pages/favorite";
import { selectCatagory } from "../../redux/features/categorySlice";
import Card from "./Card";
import Header from "./Header";

type Props = {
  refetch: any;
  products: Product[];
  fetchMore: any;
  containerRef: RefObject<HTMLDivElement>;
  totalItems: number;
};
const CardsContainer = ({
  refetch,
  products,
  fetchMore,
  containerRef,
  totalItems,
}: Props) => {
  const router = useRouter();

  const categories = useSelector(selectCatagory);
  const genre = router.query.genre?.toString();

  const category = categories.find((category: { name: string }, i: number) => {
    if (
      category.name.toLowerCase() === "all" &&
      "/" === router.pathname &&
      !genre
    ) {
      return category;
    }
    if (
      "/" === router.pathname &&
      genre &&
      category.name.toLowerCase() === genre.toLowerCase()
    ) {
      return category;
    }
  });

  const data = category
    ? category.name.toLowerCase() === "all"
      ? products
      : products.filter((product: any) => product.category.includes(genre))
    : [];

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        input: {
          genre,
          offset: products.length,
          limit: 10,
        },
      },
    });
  };

  return (
    <div className="mb-8 w-[95%]">
      <Header categories={[...categories.map((category) => category.name)]} />
      <InfiniteScroll
        containerRef={containerRef}
        hasMore={products.length < totalItems}
        next={handleFetchMore}
        className={` ${
          data.length <= 3 ? " flex" : "flex flex-wrap justify-center"
        } transition-all duration-300 ease w-full`}
        loader={<Loader />}
      >
        {data.map((item: any, index: number) => (
          <Card
            key={index}
            {...item}
            refetchAll={() => refetch({ input: { genre } })}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default CardsContainer;
