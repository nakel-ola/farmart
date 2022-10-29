import type { NextPage } from "next";
import CartCard from "../containers/cart/CartCard";
import Checkout from "./checkout";

const Cart: NextPage = () => {
  return (
    <>
      <div className="hidden md:block">
        <Checkout />
      </div>
      <div className="md:hidden block">
        <CartCard />
      </div>
    </>
  );
};

export default Cart;
