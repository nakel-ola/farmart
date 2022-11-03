import clsx from "clsx";
import { useRouter } from "next/router";
import { NumericFormat } from "react-number-format";
import { useDispatch, useSelector } from "react-redux";
import Card from "../containers/sidecart/Card";
import { getBasketTotal, selectBasket } from "../redux/features/basketSlice";
import { remove } from "../redux/features/dialogSlice";
import Button from "./Button";
import Divider from "./Divider";
import EmptyCart from "./EmptyCart";
import PopupTemplate from "./PopupTemplate";

function CartCard() {
  const basket = useSelector(selectBasket);
  const dispatch = useDispatch();

  const close = () => dispatch(remove({ type: "cart" }));

  return (
    <PopupTemplate
      title="Cart"
      position="right"
      className="h-[calc(85vh-45px)] overflow-hidden scrollbar-hide"
      containerClassName="mt-5"
      onOutsideClick={close}
    >
      {basket.length >= 1 ? (
        <>
          <div
            className={clsx(
              "overflow-y-scroll transition-all duration-300 ease-in-out rounded-xl h-[calc(100%-40px)]"
            )}
          >
            {basket.map((item, i) => (
              <div key={item.id + i}>
                <Card {...item} />
                {basket.length - 1 !== i && <Divider />}
              </div>
            ))}
          </div>
          <Footer />
        </>
      ) : (
        <div className="h-full rounded-xl">
          <EmptyCart disabled />
        </div>
      )}
    </PopupTemplate>
  );
}

const Footer = () => {
  const router = useRouter();
  const basket = useSelector(selectBasket);
  const dispatch = useDispatch();

  return (
    <div className="hidden md:grid place-items-center w-full dark:bg-dark bg-white h-[45px] border-t-[1px] border-t-slate-100 dark:border-t-neutral-800">
      <div className="w-[90%] flex items-center justify-between">
        <div className="flex items-center">
          <strong className="text-black dark:text-white">Total: </strong>
          <NumericFormat
            displayType="text"
            value={getBasketTotal(basket).toFixed(2)}
            prefix="$"
            renderText={(value) => (
              <p className="text-neutral-700 dark:text-neutral-400 pl-2">
                {value}
              </p>
            )}
          />
        </div>
        <Button
          className="bg-primary text-white"
          onClick={() => {
            router.push("/checkout");
            dispatch(remove({ type: "cart" }))
          }}
        >
          Checkout
        </Button>
      </div>
    </div>
  );
};

export default CartCard;
