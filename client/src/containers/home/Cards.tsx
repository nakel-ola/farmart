import { gql, NetworkStatus, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ReactLoading from "react-loading";
import setting from "../../data/setting";
import usePrevious from "../../hooks/usePrevious";
import CardsContainer from "./CardsContainer";


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
        discount
        currency {
          symbol
        }
      }
    }
  }
`;

const Cards = ({
  containerRef,
}: {
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
  }, [genre, prevGenre, refetch]);

  return networkStatus === NetworkStatus.loading ? (
    <div className="w-full flex items-center justify-center">
      <ReactLoading type="spinningBubbles" color={setting.primary} />
    </div>
  ) : (
    <div className="w-full grid place-items-center transition-all duration-300 ease">
      <CardsContainer
        products={data?.products.results ?? []}
        totalItems={data?.products.totalItems}
        refetch={refetch}
        fetchMore={fetchMore}
        containerRef={containerRef}
      />
    </div>
  );
};

export interface HtmlDivElement {
  current: HTMLDivElement;
}
export default Cards;
