import { ShoppingCart } from "iconsax-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Button from "../../components/Button";
import EmptyCart from "../../components/EmptyCart";
import { selectBasket } from "../../redux/features/basketSlice";
import Card from "./Card";
import Footer from "./Footer";
import Navbar from "./Navbar";

const CartCard: NextPage = () => {
  const basket = useSelector(selectBasket);
  const router = useRouter();

  return (
    <div className={`${basket.length === 0 && "h-screen"}`}>
      <Navbar />
      {basket.length >= 1 ? (
        <div className="dark:bg-neutral-800 bg-slate-100 h-screen overflow-y-scroll">
          <div className="py-[60px]">
            {basket.map((item, i) => (
              <Card key={item.id + i} {...item} />
            ))}
          </div>
          <Footer />
        </div>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
};

export default CartCard;
