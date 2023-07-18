/* eslint-disable @next/next/no-img-element */
import React from "react";
import { NumericFormat } from "react-number-format";
import { useSelector } from "react-redux";
import Button from "../../components/Button";
import Table from "../../components/Table";
import TableContent from "../../components/TableContent";
import TableHeader from "../../components/TableHeader";
import TableList from "../../components/TableList";
import TableRow from "../../components/TableRow";
import calculateDiscount from "../../helper/calculateDiscount";
import truncate from "../../helper/truncate";
import { RootState } from "../../redux/store";
import DetailsTemplate, { ItemDetails } from "../receipt/DetailsTemplate";
import { useSession } from "next-auth/react";

const tableList = ["Name", "Price", "Quantity", "Total Price"];

const Summary = ({
  paymentMethod,
  deliveryMethod,
  totalPrice,
  address,
  handleCheckout,
  pickup,
  shippingFee,
}: any) => {

  const { data } = useSession();
  const { basket, coupon } = useSelector((store: RootState) => store.basket);
  const user = data?.user;
  let price = Number(
    (coupon ? calculateDiscount(totalPrice, coupon?.discount) : totalPrice) +
      shippingFee ?? 0
  ).toFixed(2);
  const items: ItemDetails[][] = [
    [
      {
        name: "Name",
        value: deliveryMethod === "Pickup Station" ? user?.name : address?.name,
      },
      {
        name: "Total price",
        value: (
          <NumericFormat
            displayType="text"
            value={price}
            prefix="$"
            renderText={(value) => (
              <p className="text-neutral-700 dark:text-neutral-400">{value}</p>
            )}
          />
        ),
      },
    ],
    [
      {
        name: "Payment method",
        value: paymentMethod,
      },
      {
        name: "Delivery method",
        value: deliveryMethod,
      },
    ],
    [
      {
        name: "Phone Number",
        value:
          deliveryMethod === "Pickup Station"
            ? user?.phoneNumber
            : [address?.phoneNumber, address?.phoneNumber2].join(","),
      },
      {
        name:
          deliveryMethod === "Pickup Station"
            ? "Pickup Station"
            : "Delivery Address",
        value:
          deliveryMethod === "Pickup Station"
            ? pickup
            : [
                address?.street,
                address?.city,
                address?.state,
                address?.country,
              ].join(", "),
      },
    ],
  ];
  return (
    <>
      <DetailsTemplate title="Order Info" className="mt-4" list={items} />
      <div className="w-[95%] md:w-[80%] -mt-4">
        <Table>
          <TableHeader
            title="Products"
            showSearch={false}
            tableList={tableList}
          />

          <TableList>
            {basket?.map((product: any, index: number) => (
              <Card key={index} {...product} />
            ))}
          </TableList>
        </Table>
      </div>
      <div className="w-full grid place-items-center -mt-8">
        <Button onClick={handleCheckout}>Confirm</Button>
      </div>
    </>
  );
};

const Card = ({
  image,
  title,
  price,
  quantity,
}: {
  image: any;
  title: string;
  price: number;
  quantity: number;
}) => {
  return (
    <TableRow>
      <TableContent>
        <div className="flex items-center">
          <img
            src={image.url}
            alt=""
            className="h-[40px] w-[40px] rounded-lg object-cover"
          />
          <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap ml-2">
            {truncate(title, 8)}
          </p>
        </div>
      </TableContent>
      <TableContent>
        <NumericFormat
          thousandSeparator
          displayType="text"
          value={Number(price).toFixed(2)}
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
  );
};
export default Summary;
