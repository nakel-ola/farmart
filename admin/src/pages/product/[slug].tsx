import { gql, useMutation, useQuery } from "@apollo/client";
import { AnimatePresence } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { ProductType } from "../../../typing";
import Button from "../../components/Button";
import DeleteCard from "../../components/DeleteCard";
import ImageCard from "../../containers/product/ImageCard";
import ProductDetails from "../../containers/product/ProductDetails";
import ReviewCard from "../../containers/product/ReviewCard";
import setting from "../../data/setting";
import reverseSlug from "../../helper/reverseSlug";
import Layout from "../../layout/Layout";
import { useSession } from "next-auth/react";

export const ProductQuery = gql`
  query Product($slug: String!) {
    product(slug: $slug) {
      id
      title
      category
      description
      slug
      image
      currency {
        name
        code
        rounding
        symbolNative
        decimalDigits
        symbol
        namePlural
      }
      price
      stock
      rating {
        name
        value
      }
      createdAt
      updatedAt
    }
  }
`;

const ProductDeleteMutation = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      message
    }
  }
`;

const Product = () => {
  const router = useRouter();
  const { data: sessionData } = useSession()
  const user = sessionData?.user;

  const [toggle, setToggle] = useState(false);

  const {
    data: item,
    loading,
    refetch,
  } = useQuery<{ product: ProductType }>(ProductQuery, {
    variables: { slug: router.query.slug },
    onError: (err: any) => console.table(err),
  });

  const data = item && item.product;

  let canEdit = user?.level === "Gold" || user?.level === "Silver";

  useEffect(() => {
    if (loading && data) router.push("/_404");
  }, [loading, data, router]);

  const [deleteProduct, { loading: deleteLoading }] = useMutation(
    ProductDeleteMutation,
    {
      onError: (data) => console.table(data),
    }
  );

  const handleDelete = async () => {
    await deleteProduct({
      variables: { id: data?.id },
      onCompleted: () => router.back(),
    });
  };
  return (
    <>
      <Layout>
        <Head>
          <title>{reverseSlug(router.query.slug?.toString())}</title>
        </Head>
        {loading ? (
          <div className="w-full h-full pt-[20px] flex items-center justify-center">
            <ReactLoading type="spinningBubbles" color={setting.primary} />
          </div>
        ) : (
          <>
            {data && (
              <div className="w-full shrink-0 flex flex-col items-center justify-center m-0 md:m-[10px] md:pb-0 ">
                <ImageCard image={data?.image} name={data.title} />

                <ProductDetails
                  data={data}
                  canEdit={canEdit}
                  refetch={(slug: string) => refetch({ slug })}
                />

                <ReviewCard productId={data.id} canEdit={canEdit} />

                {canEdit && (
                  <div className="w-[95%] md:w-[80%] grid place-items-center mb-8">
                    <Button
                      className="text-red-600 bg-red-600/10"
                      onClick={() => setToggle(true)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </Layout>
      <AnimatePresence>
        {toggle && (
          <DeleteCard
            message="Are you sure you want to delete product ?"
            onClose={() => setToggle(false)}
            onDelete={handleDelete}
            loading={deleteLoading}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Product;
