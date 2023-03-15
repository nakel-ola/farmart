import { gql, useLazyQuery } from "@apollo/client";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import ReactLoading from "react-loading";
import DescriptionCard from "../../containers/details/DescriptionCard";
import Footer from "../../containers/details/Footer";
import ImageCard from "../../containers/details/ImageCard";
import LocationCard from "../../containers/details/LocationCard";
import ReviewCard from "../../containers/details/ReviewCard";
import TitleCard from "../../containers/details/TitleCard";
import setting from "../../data/setting";
import reverseSlug from "../../helper/reverseSlug";
import Layouts from "../../layout/Layouts";
import { ProductQueryType } from "../../types/graphql.types";

export const ProductQuery = gql`
  query Product($slug: String!) {
    product(slug: $slug) {
      id
      title
      category
      description
      image
      price
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
`;

function Details() {
  const router = useRouter();

  const [getFavorite, { data: item, loading, refetch }] =
    useLazyQuery<ProductQueryType>(ProductQuery);

  const data = item && item.product;

  useEffect(() => {
    if (loading && data) router.push("/_404");
  }, [loading, router, data]);

  useEffect(() => {
    if (!router.query.slug) return;
    getFavorite({
      variables: { slug: router.query.slug },
      onError: (err: any) => console.table(err),
    });
  }, [getFavorite, router.query.slug]);

  return (
    <>
      <Head>
        <title>{reverseSlug(router.query.slug?.toString())}</title>
      </Head>
      <Layouts>
        {loading ? (
          <div className="w-full h-full pt-[20px] flex items-center justify-center">
            <ReactLoading type="spinningBubbles" color={setting.primary} />
          </div>
        ) : (
          data && (
            <div className="w-full shrink-0 flex flex-col items-center justify-center m-0 md:m-[10px] lg:mt-10 md:pb-0 pb-[60px]">
              <ImageCard
                image={data.image}
                title={data.title}
                stock={data.stock}
              />

              <TitleCard
                id={data.id}
                category={data?.category}
                price={data?.price}
                currency={data?.currency}
                rating={data?.rating}
                title={data?.title}
                discount={data?.discount}
                favorite={data?.favorite}
                handleRefetch={() => refetch({ slug: router.query.slug })}
              />

              <LocationCard />

              <DescriptionCard description={data?.description} />

              <ReviewCard
                productId={data.id}
                rating={data?.rating}
                refetch={() => refetch({ slug: router.query.slug })}
              />

              {data.stock > 0 && <Footer {...data} />}
            </div>
          )
        )}
      </Layouts>
    </>
  );
}

export default Details;
