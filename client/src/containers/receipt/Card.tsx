import clsx from "clsx";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
import numberFormat from "../../helper/numberFormat";
import truncate from "../../helper/truncate";
import { add } from "../../redux/features/orderSlice";

export const statusColor = (word: string) => {
  if (word === "Pending") {
    return "text-yellow-500 bg-yellow-500/10";
  }
  if (word === "Delivered") {
    return "text-green-500 bg-green-500/10";
  }

  if (word === "Cancaled") {
    return "text-red-500 bg-red-500/10";
  }
};
export const currencyConvert = (num: number) =>
  `${Math.floor(Number(num * 210))}`;

const Card = ({
  id,
  orderId,
  status,
  totalPrice,
  paymentMethod,
  deliveryMethod,
  ...other
}: any) => {
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <div
      className="flex items-center justify-around overflow-hidden bg-transparent active:scale-95 transition-all duration-300 cursor-pointer select-none"
      onClick={() => {
        dispatch(
          add({
            id,
            orderId,
            status,
            totalPrice,
            paymentMethod,
            deliveryMethod,
            ...other,
          })
        );
        router.push(`/receipt/${id}`);
      }}
    >
      <span className="m-[8px] flex-1 flex items-start justify-start overflow-hidden pl-2 ">
        <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
          {truncate(orderId, 14, "middle")}
        </p>
      </span>
      <span className="m-[8px] flex-1 flex items-start justify-start rounded-lg overflow-hidden pl-2">
        <p
          className={clsx(
            "text-[0.9rem] font-medium text-center whitespace-nowrap py-[2px] px-2 rounded-lg",
            statusColor(status)
          )}
        >
          {truncate(status, 10, "middle")}
        </p>
      </span>
      <span className="m-[8px] flex-1 flex items-start justify-start overflow-hidden pl-2">
        <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
          ₦{truncate(numberFormat(currencyConvert(totalPrice)), 10, "end")}
        </p>
      </span>
      <span className="m-[8px] flex-1 flex items-start justify-start overflow-hidden pl-2">
        <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
          {truncate("May 10,2020", 15, "middle")}
        </p>
      </span>
      <span className="m-[8px] flex-1 flex items-start justify-start overflow-hidden pl-2">
        <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
          {truncate(paymentMethod, 15, "middle")}
        </p>
      </span>
      <span className="m-[8px] flex-1 flex items-start justify-start overflow-hidden pl-2">
        <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
          {truncate(deliveryMethod, 20, "middle")}
        </p>
      </span>
    </div>
  );
};

export default Card;
