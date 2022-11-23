import { gql, useQuery } from "@apollo/client";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { useSelector } from "react-redux";
import DescriptionCard from "../../containers/details/DescriptionCard";
import Footer from "../../containers/details/Footer";
import ImageCard from "../../containers/details/ImageCard";
import LocationCard from "../../containers/details/LocationCard";
import RatingCard from "../../containers/details/RatingCard";
import ReviewCard from "../../containers/details/ReviewCard";
import TitleCard from "../../containers/details/TitleCard";
import setting from "../../data/setting";
import reverseSlug from "../../helper/reverseSlug";
import Layouts from "../../layout/Layouts";
import { selectDialog } from "../../redux/features/dialogSlice";

export const ProductQuery = gql`
  query Product($slug: String!) {
    product(slug: $slug) {
      id
      title
      category
      description
      image {
        url
      }
      price
      stock
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

  const { data: item, loading } = useQuery(ProductQuery, {
    variables: { slug: router.query.slug },
    onError: (err: any) => console.table(err),
  });

  const data = item && item.product;

  const [error, setError] = useState<string>("");
  const dialogState = useSelector(selectDialog);

  useEffect(() => {
    if (loading && data) {
      router.push("/_404");
    }
  }, [loading, router, data]);

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
                image={data?.image}
                name={data?.name}
                stock={data.stock}
              />

              <TitleCard
                category={data?.category}
                price={data?.price}
                currency={data?.currency}
                data={data}
                rating={data?.rating}
                title={data?.title}
                discount={data?.discount}
              />

              <LocationCard />

              <DescriptionCard description={data?.description} />

              <ReviewCard productId={data.id as string} rating={data?.rating} />

              {data.stock > 0 && <Footer {...data} setError={setError} />}
            </div>
          )
        )}
      </Layouts>
      {dialogState.review.open && <RatingCard title={data?.title} productId={data.id as string} />}
    </>
  );
}

export default Details;
