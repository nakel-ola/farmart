/* eslint-disable @next/next/no-img-element */
import { gql, useQuery } from "@apollo/client";
import React from "react";
import { NumericFormat } from "react-number-format";
import Table from "../../components/Table";
import TableContent from "../../components/TableContent";
import TableHeader from "../../components/TableHeader";
import TableList from "../../components/TableList";
import TableRow from "../../components/TableRow";
import truncate from "../../helper/truncate";

const tableList = ["Name", "Price", "Quantity", "Total Price"];

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
      rating
    }
  }
`;

const OrderProduct = ({ products }: any) => {
  return (
    <div className="h-full w-full flex items-center flex-col overflow-hidden">
      <div className="w-[95%] md:w-[80%] -mt-4">
        <Table>
          <TableHeader
            title="Products"
            showSearch={false}
            tableList={tableList}
          />
          <TableList>
            {products?.map((product: any, index: number) => (
              <Card key={index} {...product} />
            ))}
          </TableList>
        </Table>
      </div>
    </div>
  );
};

const Card = ({ id, quantity, price }: any) => {
  const { data } = useQuery(ProductQuery, {
    variables: { id },
  });

  const item = data?.productById;

  return item ? (
    <TableRow>
      <TableContent>
        <div className="flex items-center">
          <img
            src={item.image.url}
            alt=""
            className="h-[40px] w-[40px] rounded-lg object-cover"
          />
          <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap ml-2">
            {truncate(item.title, 8)}
          </p>
        </div>
      </TableContent>

      <TableContent>
        <NumericFormat
          thousandSeparator
          displayType="text"
          value={Number(item?.price).toFixed(2)}
          prefix="$"
          renderText={(value: string) => (
            <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap ml-2">
              {value}
            </p>
          )}
        />
      </TableContent>
      <TableContent>
        <p className="text-base font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
          {quantity}
        </p>
      </TableContent>
      <TableContent>
        <NumericFormat
          thousandSeparator
          displayType="text"
          value={Number(price * quantity).toFixed(2)}
          prefix="$"
          renderText={(value: string) => (
            <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap ml-2">
              {value}
            </p>
          )}
        />
      </TableContent>
    </TableRow>
  ) : null;
};
export default OrderProduct;
