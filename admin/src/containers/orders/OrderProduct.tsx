/* eslint-disable @next/next/no-img-element */
import { gql, useQuery } from "@apollo/client";
import React from "react";
import NumberFormat from "react-number-format";
import { Table, TableBody, TableHead,TableRow,TableContent } from "../../components/tables";
import truncate from "../../helper/truncate";
import Header from "../products/Header";

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
      rating
    }
  }
`;

export const ProductByIdQuery = gql`
  query ProductById($id: ID!) {
    productById(id: $id) {
      id
      title
      category
      description
      image {
        url
      }
      currency {
        symbol
      }
      price
      stock
      rating
    }
  }
`;

const tableList = [
  { title: "Name",className: "w-52 md:w-20" },
  { title: "Price", className: "w-20" },
  { title: "Quantity",className: "w-24" },
  { title: "Total Price",className: "w-20" },
];

const OrderProduct = ({ products }: any) => {
  return (
    <div className="w-[95%] md:w-[80%] overflow-hidden">
      <Table headerComponent={<Header title="Products" showSearch={false} />}>
        <TableHead
          tableList={tableList}
          disableDivider={products.length === 0}
        />
        <TableBody disableDivider>
          {products.map((product: any, index: number) => (
            <Card key={index} {...product} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const Card = ({ id, quantity, price }: any) => {
  const { data } = useQuery(ProductByIdQuery, {
    variables: { id },
  });

  const item = data?.productById;

  return (
    <TableRow className="cursor-pointer">
      <TableContent>
        <div className="flex items-center w-36 md:w-fit">
          <img
            src={item?.image?.url}
            alt=""
            className="h-[40px] w-[40px] rounded-lg object-cover shrink-0"
          />
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap ml-2">
            {truncate(item?.title ?? "", 18)}
          </p>
        </div>
      </TableContent>

      <TableContent>
        <NumberFormat
          value={item?.price.toFixed(2)}
          displayType="text"
          thousandSeparator
          prefix={item?.currency?.symbol}
          renderText={(value) => (
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
              {value}
            </p>
          )}
        />
      </TableContent>
      <TableContent>
        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
          {quantity}
        </p>
      </TableContent>
      <TableContent>
        <NumberFormat
          className="bg-transparent border-transparent outline-transparent"
          value={(price * quantity).toFixed(2)}
          displayType="text"
          prefix={item?.currency?.symbol}
          thousandSeparator
          renderText={(value) => (
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
              {value}
            </p>
          )}
        />
      </TableContent>
    </TableRow>
  );
};
export default OrderProduct;
