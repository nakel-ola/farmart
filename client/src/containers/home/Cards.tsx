import { NetworkStatus, gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { RefObject, useEffect, useState } from "react";
import ReactLoading from "react-loading";
import setting from "../../data/setting";
import usePrevious from "../../hooks/usePrevious";
import { ProductsQuerys } from "../../types/graphql.types";
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
        image
        price
        slug
        stock
        favorite
        rating {
          name
          value
        }
        discount
        currency {
          symbol
        }
      }
    }
  }
`;

interface Props {
  containerRef: RefObject<HTMLDivElement>;
}
const Cards: React.FC<Props> = ({ containerRef }) => {
  const router = useRouter();

  const genre = router.query.genre;

  const prevGenre = usePrevious(genre);

  const [data, setData] = useState<ProductsQuerys["products"] | null>(null);

  const { refetch, fetchMore, networkStatus } = useQuery<ProductsQuerys>(
    ProductQuery,
    {
      variables: { input: { genre, offset: 0, limit: 10 } },
      notifyOnNetworkStatusChange: true,
      onCompleted: (data) => setData(data.products),
      onError: (err) => console.table(err),
    }
  );

  const updateFavorite = (id: string, favorite: boolean) => {
    if (!data) return;
    let newProducts = [...data?.results];

    const inx = newProducts.findIndex((p) => p.id === id);

    if (inx === -1) return;

    newProducts[inx] = { ...newProducts[inx], favorite };

    setData({ ...data, results: newProducts });
  };

  useEffect(() => {
    if (prevGenre === genre) return;

    refetch({ input: { genre, offset: 0, limit: 10 } });
  }, [genre, prevGenre, refetch]);

  return networkStatus === NetworkStatus.loading ? (
    <div className="w-full flex items-center justify-center">
      <ReactLoading type="spinningBubbles" color={setting.primary} />
    </div>
  ) : (
    <div className="w-full flex items-center transition-all duration-300 ease">
      <CardsContainer
        products={data?.results ?? []}
        totalItems={data?.totalItems ?? 0}
        refetch={refetch}
        fetchMore={fetchMore}
        containerRef={containerRef}
        updateFavorite={updateFavorite}
      />
    </div>
  );
};

export interface HtmlDivElement {
  current: HTMLDivElement;
}
export default Cards;
