import clsx from "clsx";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Card from "./Card";
import Footer from "./Footer";
import Navbar, { pathMatch } from "./Navbar";
import { selectBasket, selectCoupon } from "../../redux/features/basketSlice";
import EmptyCart from "../../components/EmptyCart";

function CartCard() {
  const basket = useSelector(selectBasket);
  const coupon = useSelector(selectCoupon);


  const router = useRouter();
  const isSummary = pathMatch.includes(router.pathname);

  return (
    <div className="hidden lg:inline flex-[0.35] rounded-xl dark:bg-dark bg-white mt-1">
      <Navbar />
      {basket.length >= 1 ? (
        <>
          <div
            className={clsx(
              "overflow-y-scroll h-full transition-all duration-300 ease-in-out rounded-xl ",
              isSummary ? coupon ? `h-[calc(100%-255px)]` : `h-[calc(100%-240px)]` : `h-[calc(100%-100px)]`
            )}
          >
            {basket.map((item, i) => (
              <Card key={item.id + i} {...item} />
            ))}
          </div>
          <Footer />
        </>
      ) : (
        <div className="h-full rounded-xl">
          <EmptyCart disabled />
        </div>
      )}
    </div>
  );
}

export default CartCard;
