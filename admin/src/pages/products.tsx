/* eslint-disable @next/next/no-img-element */
import { gql, useMutation, useQuery } from "@apollo/client";
import Head from "next/head";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteCard from "../components/DeleteCard";
import BannerCard from "../containers/products/BannerCard";
import Banners from "../containers/products/Banners";
import Popup from "../containers/products/Popup";
import ProductCards from "../containers/products/ProductCards";
import Layout from "../layout/Layout";
import { add } from "../redux/features/categorySlice";
import { selectDialog } from "../redux/features/dialogSlice";
import { selectUser } from "../redux/features/userSlice";

const DeleteBanner = gql`
  mutation DeleteBanner($id: ID!) {
    deleteBanner(id: $id) {
      msg
    }
  }
`;

const Products = () => {
  const dispatch = useDispatch();

  const dialog = useSelector(selectDialog);
  const user = useSelector(selectUser);


  const { data, refetch } = useQuery(CategoriesQuery, {
    onCompleted: (data) => dispatch(add(data.categories)),
  });

  const [deleteBanner, { loading }] = useMutation(DeleteBanner, {
    onCompleted: () => {
      refetch();
    },
    onError: (err) => console.table(err),
  });

  let canEdit = user?.level === "Gold" || user?.level === "Silver";
  


  return (
    <>
      <Head>
        <title>Products</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {data && (
          <div className="flex items-center flex-col">
            <Banners data={data.banners} canEdit={canEdit} />

            <div className="w-[95%] md:w-[90%]">
              <ProductCards canEdit={canEdit}/>
            </div>
          </div>
        )}
      </Layout>
      {dialog.edit.open && <Popup />}
      {dialog.delete.open && (
        <DeleteCard
          func={() => deleteBanner({ variables: { id: dialog.delete.data.id } }) }
          loading={loading}
        />
      )}
      {dialog.banner.open && <BannerCard func={() => refetch()} />}
    </>
  );
};

const CategoriesQuery = gql`
  query Categories {
    categories {
      name
    }
    banners {
      id
      image
      title
      link
      description
    }
  }
`;


export default Products;
