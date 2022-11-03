import { Add, Minus, ShoppingCart } from "iconsax-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Product } from "../../../typing";
import { add, remove, selectBasket } from "../../redux/features/basketSlice";

function Footer({ id, ...other }: Product) {
  const dispatch = useDispatch();

  const basket = useSelector(selectBasket);

  const product = basket.find((b: any) => b.id === id)!;

  // --- Adding Product To basket --- //
  const addToCart = () => {
    dispatch(add({ id, ...other, quantity: 1 }));
  };

  // --- Incrementing Product To basket --- //
  const increment = () => {
    if (product?.quantity < product?.stock) {
      dispatch(add({ id, ...other, quantity: product?.quantity + 1 }));
    }
  };

  // --- Decrementing Product To basket --- //
  const decrement = () => {
    if (product?.quantity > 1) {
      dispatch(add({ id, ...other, quantity: product?.quantity - 1 }));
    } else {
      dispatch(remove({ id }));
    }
  };
  return (
    <div className="flex items-center justify-center w-full md:w-[80%] md:mt-[10px] p-[5px] pl-[8px] py-[8px] md:static fixed bottom-1 md:rounded-lg md:mb-2  bg-white dark:bg-dark md:bg-transparent md:dark:bg-transparent md:shadow-none shadow-sm dark:shadow-black/30">
      <div
        className={`md:flex-[0.2] flex-[0.5] flex items-center ${
          product
            ? "justify-between bg-transparent"
            : "justify-center bg-primary"
        }  rounded-lg h-[40px] `}
        onClick={() => !product && addToCart()}
      >
        {product ? (
          <>
            <button
              className="w-[35px] h-[35px] rounded-md dark:bg-primary/60 bg-primary/30 flex items-center justify-center mb-[2px] ml-[2px]"
              onClick={decrement}
            >
              <Minus size={25} className="text-white" />
            </button>

            <span className="flex items-center justify-center rounded-[25%] w-[30px] h-[30px]">
              <p className="p-[8px] text-[1.2rem] text-primary">
                {product?.quantity}
              </p>
            </span>

            <button
              className="flex items-center justify-center w-[35px] h-[35px] rounded-md bg-primary ml-[2px]"
              onClick={increment}
            >
              <Add size={25} className=" text-white" />
            </button>
          </>
        ) : (
          <button className="w-fit flex items-center justify-center p-[2px]">
            <ShoppingCart size={25} className="text-white ml-2" />
            <p className="text-white text-[1rem] px-[10px] font-medium whitespace-nowrap">
              {" "}
              Add To Cart{" "}
            </p>
          </button>
        )}
      </div>
    </div>
  );
}

export default Footer;
