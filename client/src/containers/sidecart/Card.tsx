/* eslint-disable @next/next/no-img-element */
import { Add, Minus } from "iconsax-react";
import React from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { Basket } from "../../../typing";
import { add, remove } from "../../redux/features/basketSlice";

function Card(props: Basket) {
  const { id, image, title, price, quantity, stock, currency, ...others } =
    props;

  const dispatch = useDispatch();

  const currencyConvert = (num: number) => `${Math.floor(Number(num * 210))}`;

  const truncate = (text: string, num: number) =>
    text.length > num ? text.substring(0, num - 1) + "..." : text;

  const increment = () => {
    if (quantity < stock) {
      dispatch(
        add({
          id,
          quantity: quantity + 1,
          image,
          title,
          price,
          stock,
          currency,
          ...others,
        })
      );
    }
  };

  // --- Decrementing Product To basket --- //
  const decrement = () => {
    if (quantity > 1) {
      dispatch(
        add({
          id,
          quantity: quantity - 1,
          image,
          title,
          price,
          stock,
          currency,
          ...others,
        })
      );
    } else {
      dispatch(remove({ id }));
    }
  };

  return (
    <div className="flex mx-[5px] my-[10px] bg-white dark:bg-dark rounded-lg relative">
      <div className="overflow-hidden rounded-lg shrink-0 m-[3px]">
        <img
          src={image?.url}
          alt=""
          className="h-20 w-24 rounded-md object-cover  hover:scale-110 transition-all duration-300 ease"
        />
      </div>
      <div className="w-full">
        <p className="text-[1rem] pl-[5px] font-[500] text-black dark:text-white">
          {truncate(title, 20)}
        </p>
        <p className="text-[1rem] pl-[5px] font-[500] text-primary">
          {currency.symbol}
          {price.toFixed(2)} x{quantity}{" "}
        </p>

        <div className="flex items-center w-[95%] justify-between ml-[5px]">
          <div className="flex my-[5px]">
            <button
              className={`flex items-center justify-center h-[20px] w-[20px] rounded-md dark:bg-primary/60 bg-primary/30`}
              onClick={decrement}
            >
              <Minus size={25} className="text-white" />
            </button>

            <div
              className={`flex items-center justify-center h-[20px] w-[20px] rounded-md text-black dark:text-white`}
            >
              <p>{quantity ?? 0}</p>
            </div>

            <button
              className={`flex items-center justify-center h-[20px] w-[20px] rounded-md bg-primary`}
              onClick={increment}
            >
              <Add size={25} className="text-white" />
            </button>
          </div>

          <button
            className={`flex items-center justify-center h-[20px] w-[20px] rounded-md bg-primary`}
            onClick={() => dispatch(remove({ id }))}
          >
            <IoClose className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
