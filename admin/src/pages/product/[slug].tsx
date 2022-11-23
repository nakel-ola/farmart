import { gql, useMutation, useQuery } from "@apollo/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ReactLoading from "react-loading";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import DeleteCard from "../../components/DeleteCard";
import ImageCard from "../../containers/product/ImageCard";
import ProductDetails from "../../containers/product/ProductDetails";
import ReviewCard from "../../containers/product/ReviewCard";
import Popup from "../../containers/products/Popup";
import setting from "../../data/setting";
import reverseSlug from "../../helper/reverseSlug";
import Layout from "../../layout/Layout";
import { add, selectDialog } from "../../redux/features/dialogSlice";
import { selectUser } from "../../redux/features/userSlice";

export const ProductQuery = gql`
  query Product($slug: String!) {
    product(slug: $slug) {
      id
      title
      category
      description
      slug
      image {
        name
        url
      }
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
      msg
    }
  }
`;

const Product = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const dialog = useSelector(selectDialog);
  const user = useSelector(selectUser);

  const {
    data: item,
    loading,
    refetch,
  } = useQuery(ProductQuery, {
    variables: { slug: router.query.slug },
    onError: (err: any) => console.table(err),
  });

  const data = item && item.product;

  let canEdit = user?.level === "Gold" || user?.level === "Silver";

  useEffect(() => {
    if (loading && data) {
      router.push("/_404");
    }
  }, [loading, data, router]);

  const [deleteProduct, { loading: deleteLoading }] = useMutation(ProductDeleteMutation, {
    onCompleted: (data) => console.log(data),
    onError: (data) => console.table(data),
  });

  const handleDelete = async () => {
    await deleteProduct({
      variables: { id: dialog.delete.data?.id },
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
                <ImageCard image={data?.image} name={data?.name} />

                <ProductDetails data={data} canEdit={canEdit} />

                <ReviewCard productId={data.id} canEdit={canEdit} />

                {canEdit && (
                  <div className="w-[95%] md:w-[80%] grid place-items-center mb-8">
                    <Button
                      className="text-red-600 bg-red-600/10"
                      onClick={() =>
                        dispatch(
                          add({
                            open: true,
                            data: {
                              id: data.id,
                              message: "Are u sure you want to delete ?",
                            },
                            type: "delete",
                          })
                        )
                      }
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
      {dialog.edit.open && (
        <Popup func={() => refetch({ slug: router.query.slug })} />
      )}

      {dialog.delete.open && <DeleteCard func={handleDelete} loading={deleteLoading} />}
    </>
  );
};

export default Product;
