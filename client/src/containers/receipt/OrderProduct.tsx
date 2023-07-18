/* eslint-disable @next/next/no-img-element */
import { gql, useQuery } from "@apollo/client";
import React from "react";
import { NumericFormat } from "react-number-format";
import {
  Header,
  Table,
  TableBody,
  TableContent,
  TableHead,
  TableRow,
} from "../../components/tables";
import truncate from "../../helper/truncate";

const tableList = [
  { title: "Name", className: "w-52 md:w-20" },
  { title: "Price", className: "w-20" },
  { title: "Quantity", className: "w-24" },
  { title: "Total Price", className: "w-20" },
];

export const ProductQuery = gql`
  query ProductById($id: ID!) {
    productById(id: $id) {
      id
      title
      category
      description
      image {
        url
      }
      price
      stock
    }
  }
`;
export const ProductsQuery = gql`
  query ProductsById($ids: [ID!]) {
    productsById(ids: $ids) {
      id
      title
      category
      description
      image
      price
      stock
      currency {
        symbol
      }
    }
  }
`;

const OrderProduct = ({ products: items }: any) => {
  const ids = items.map((p: any) => p.id);

  const { data } = useQuery(ProductsQuery, {
    variables: { ids },
  });

  const products = data?.productsById;
  return (
    <div className="w-[95%] md:w-[80%] overflow-hidden">
      {products?.length > 0 && (
        <Table headerComponent={<Header title="Products" showSearch={false} />}>
          <TableHead
            tableList={tableList}
            disableDivider={products?.length === 0}
          />
          <TableBody disableDivider>
            {products.map((product: any, index: number) => (
              <Card
                key={index}
                {...product}
                quantity={
                  items.find((item: any) => item.id === product.id)?.quantity
                }
              />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

const Card = ({ id, quantity, price, image, title, currency }: any) => {
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
