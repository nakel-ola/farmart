/* eslint-disable @next/next/no-img-element */
import { gql, useQuery } from "@apollo/client";
import Head from "next/head";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Banners from "../containers/products/Banners";
import ProductCards from "../containers/products/ProductCards";
import Layout from "../layout/Layout";
import { add } from "../redux/features/categorySlice";
import { selectUser } from "../redux/features/userSlice";

const Products = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  const { data, refetch } = useQuery(CategoriesQuery, {
    onCompleted: (data) => dispatch(add(data.categories)),
  });

  let canEdit = user?.level === "Gold" || user?.level === "Silver";

  return (
    <>
      <Head>
        <title>Products</title>
      </Head>
      <Layout>
        {data && (
          <div className="flex items-center flex-col">
            <Banners
              data={data.banners}
              canEdit={canEdit}
              refetch={() => refetch()}
            />

            <ProductCards canEdit={canEdit} />
          </div>
        )}
      </Layout>
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
