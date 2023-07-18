/* eslint-disable @next/next/no-img-element */
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { OrderProduct as OrderProductType, ProductType } from "../../../typing";
import {
  Table,
  TableBody,
  TableContent,
  TableHead,
  TableRow,
} from "../../components/tables";
import Header from "../../components/tables/Header";
import truncate from "../../helper/truncate";

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
      rating
    }
  }
`;

export const ProductsByIdQuery = gql`
  query ProductsById($ids: [ID!]) {
    productsById(ids: $ids) {
      id
      title
      category
      description
      image
      currency {
        symbol
      }
      price
      stock
    }
  }
`;

const tableList = [
  { title: "Name", className: "w-52 md:w-20" },
  { title: "Price", className: "w-20" },
  { title: "Quantity", className: "w-24" },
  { title: "Total Price", className: "w-20" },
];

interface Item extends ProductType {
  quantity: number;
}

interface Props {
  products: OrderProductType[];
}
const OrderProduct: React.FC<Props> = ({ products }) => {
  const { data } = useQuery<{ productsById: ProductType[] }>(
    ProductsByIdQuery,
    {
      variables: {
        ids: products.map((p) => p.id),
      },
      onError: (err: any) => console,
    }
  );

  const items = data?.productsById;

  return (
    <div className="w-[95%] md:w-[80%] overflow-hidden">
      {items && (
        <Table headerComponent={<Header title="Products" showSearch={false} />}>
          <TableHead
            tableList={tableList}
            disableDivider={products.length === 0}
          />
          <TableBody disableDivider>
            {items.map((item, index: number) => (
              <Card
                key={index}
                {...item}
                quantity={products.find((p) => p.id === item.id)?.quantity!}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

const Card = (props: Item) => {
  const { id, quantity, price, image, title, currency } = props;

  return (
    <TableRow className="cursor-pointer">
      <TableContent>
        <div className="flex items-center w-36 md:w-fit">
          <img
            src={image}
            alt=""
            className="h-[40px] w-[40px] rounded-lg object-cover shrink-0"
          />
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap ml-2">
            {truncate(title ?? "", 18)}
          </p>
        </div>
      </TableContent>

      <TableContent>
        <NumericFormat
          value={price.toFixed(2)}
          displayType="text"
          thousandSeparator
          prefix={currency?.symbol}
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
        <NumericFormat
          className="bg-transparent border-transparent outline-transparent"
          value={(price * quantity).toFixed(2)}
          displayType="text"
          prefix={currency?.symbol}
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
