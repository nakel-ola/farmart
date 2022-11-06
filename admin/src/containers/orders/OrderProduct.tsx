/* eslint-disable @next/next/no-img-element */
import { gql, useQuery } from "@apollo/client";
import React from "react";
import NumberFormat from "react-number-format";
import Table from "../../components/Table";
import TableContent from "../../components/TableContent";
import TableHeader from "../../components/TableHeader";
import TableList from "../../components/TableList";
import TableRow from "../../components/TableRow";
import truncate from "../../helper/truncate";

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

const items = ["Name", "Price", "Quantity", "Total Price"];

const OrderProduct = ({ products }: any) => {
  return (
    <div className="w-[95%] md:w-[80%] overflow-hidden">
      <Table>
        <TableHeader title="Products" showSearch={false} tableList={items} />

        <TableList>
          {products.map((product: any, index: number) => (
            <Card key={index} {...product} />
          ))}
        </TableList>
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
    <TableRow>
      <TableContent>
        <div className="flex items-center">
          <img
            src={item?.image?.url}
            alt=""
            className="h-[40px] w-[40px] rounded-lg object-cover"
          />
          <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap ml-2">
            {truncate(item?.title ?? "", 8)}
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
            <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap ml-2">
              {value}
            </p>
          )}
        />
      </TableContent>
      <TableContent>
        <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap ml-2">
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
            <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap ml-2">
              {value}
            </p>
          )}
        />
      </TableContent>
    </TableRow>
  );
};
export default OrderProduct;
