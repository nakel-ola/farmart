import clsx from "clsx";
import React from "react";
import numberFormat from "../../helper/numberFormat";
import { currencyConvert, statusColor } from "./Card";

const OrderInfo = ({ order }: any) => {
  return (
    <div className="mb-[10px] mt-10 w-[80%] rounded-lg dark:bg-dark dark:shadow-black/30 bg-white shadow-sm overflow-hidden pb-2">
      <p className="py-[8px] pl-[15px] text-[1.2rem] text-black font-[600] dark:text-white">
        Order Info
      </p>

      <div className="py-[5px] pl-[25px] cursor-pointer flex items-center">
        <strong className="text-base font-medium text-black dark:text-white">
          Product Id:{" "}
        </strong>
        <p className="text-black dark:text-white pl-2"> {order?.orderId}</p>
      </div>
      <div className="py-[5px] pl-[25px] cursor-pointer flex items-center">
        <strong className="text-base font-medium text-black dark:text-white">
          Tracking Id:
        </strong>
        <p className="text-black dark:text-white pl-2"> {order?.trackingId}</p>
      </div>
      <div className="py-[5px] pl-[25px] cursor-pointer flex items-center">
        <strong className="text-base font-medium text-black dark:text-white">
          Status:
        </strong>
        <p
          className={clsx(
            "text-base text-center whitespace-nowrap py-[2px] px-2 rounded-lg ml-2",
            statusColor(order?.status)
          )}
        >
          {" "}
          {order?.status}
        </p>
      </div>
      <div className="py-[5px] pl-[25px] cursor-pointer flex items-center">
        <strong className="text-base font-medium text-black dark:text-white">
          Total price:
        </strong>
        <p className="text-black dark:text-white pl-2">
          ₦{numberFormat(currencyConvert(order?.totalPrice))}
        </p>
      </div>
      <div className="py-[5px] pl-[25px] cursor-pointer flex items-center">
        <strong className="text-base font-medium text-black dark:text-white">
          Payment method:{" "}
        </strong>
        <p className="text-black dark:text-white pl-2">
          {order?.paymentMethod}
        </p>
      </div>
      <div className="py-[5px] pl-[25px] cursor-pointer flex items-center">
        <strong className="text-base font-medium text-black dark:text-white">
          Delivery method:
        </strong>
        <p className="text-black dark:text-white pl-2">
          {order?.deliveryMethod}
        </p>
      </div>
      <div className="py-[5px] pl-[25px] cursor-pointer flex items-center">
        <strong className="text-base font-medium text-black dark:text-white">
          Phone Number:
        </strong>
        <p className="text-black dark:text-white pl-2">
          {order?.address?.phoneNumber}
        </p>
      </div>
      <div className="py-[5px] pl-[25px] cursor-pointer flex items-center">
        <strong className="text-base font-medium text-black dark:text-white">
          Delivery Address:
        </strong>
        <p className="text-black dark:text-white pl-2">
          {[
            order?.address.street,
            order?.address.city,
            order?.address.state,
            order?.address.country,
          ].join(", ")}
          .
        </p>
      </div>
    </div>
  );
};

export default OrderInfo;
