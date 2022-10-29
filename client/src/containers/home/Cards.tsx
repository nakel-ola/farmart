import { gql, NetworkStatus, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ReactLoading from "react-loading";
import InfiniteScroll from "../../components/InfiniteScroll";
import setting from "../../data/setting";
import useChange from "../../hooks/useChange";
import usePrevious from "../../hooks/usePrevious";
import { Loader } from "../../pages/favorite";
import Card from "./Card";

const ProductQuery = gql`
  query Products($input: ProductsInput) {
    products(input: $input) {
      totalItems
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

const Cards = ({
  categories,
  containerRef,
}: {
  categories: any[];
  containerRef: any;
}) => {
  const router = useRouter();

  const genre = router.query.genre;

  const prevGenre = usePrevious(genre);

  const { data, refetch, fetchMore, networkStatus } = useQuery(ProductQuery, {
    variables: { input: { genre, offset: 0, limit: 10 } },
    notifyOnNetworkStatusChange: true,
    onError: (err) => console.log(err),
  });

  const isFetchingMore = networkStatus === NetworkStatus.fetchMore;

  useEffect(() => {
    if (prevGenre !== genre) {
      refetch({
        input: { genre, offset: 0, limit: 10 },
      });
    }
  }, [genre]);

  return networkStatus === NetworkStatus.loading ? (
    <div className="w-full pt-[20px] flex items-center justify-center">
      <ReactLoading type="spinningBubbles" color={setting.primary} />
    </div>
  ) : (
    <div className="pt-[1px] w-full grid place-items-center transition-all duration-300 ease">
      <CardsContainer
        products={data?.products.results ?? []}
        totalItems={data?.products.totalItems}
        refetch={refetch}
        genre={genre}
        fetchMore={fetchMore}
        categories={[
          "All",
          ...categories.map((item: { name: string }) => item.name),
        ]}
        isFetchingMore={isFetchingMore}
        containerRef={containerRef}
      />
    </div>
  );
};

export interface HtmlDivElement {
  current: HTMLDivElement;
}

const CardsContainer = ({
  refetch,
  products,
  fetchMore,
  genre,
  categories,
  isFetchingMore,
  containerRef,
  totalItems,
}: any) => {
  const router = useRouter();

  const category = categories.find((category: any, i: number) => {
    if (category.toLowerCase() === "all" && "/" === router.pathname && !genre) {
      return category;
    } else if (
      "/" === router.pathname &&
      genre &&
      category.toLowerCase() === genre.toLowerCase()
    ) {
      return category;
    }
  });

  const data =
    category.toLowerCase() === "all"
      ? products
      : products.filter((product: any) => product.category.includes(genre));

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
    <div className="pb-[40px] w-full md:pd-0">
      <InfiniteScroll
        containerRef={containerRef}
        hasMore={products.length < totalItems}
        next={handleFetchMore}
        className={`${
          data.length <= 3 ? " flex" : "flex flex-wrap justify-center"
        } transition-all duration-300 ease w-full`}
        loader={<Loader />}
      >
        {data.map((item: any, index: number) => (
          <div key={index} className="transition-all duration-300 ease">
            <Card {...item} refetchAll={() => refetch({ input: { genre } })} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};
export default Cards;
