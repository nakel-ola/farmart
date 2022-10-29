import clsx from "clsx";
import { useRouter } from "next/router";
import Lottie from "react-lottie-player";
import { useDispatch, useSelector } from "react-redux";
import Card from "../containers/sidecart/Card";
import Footer from "../containers/sidecart/Footer";
import lottieJson from "../database/4496-empty-cart.json";
import { removeAll, selectBasket } from "../redux/features/basketSlice";

function CartCard() {
  const basket = useSelector(selectBasket);

  const router = useRouter();
  const dispatch = useDispatch();

  return basket.length >= 1 ? (
    <div
      className={clsx(
        "flex-[0.35] mt-[5px] ml-[5px] hidden overflow-y-scroll scrollbar-style lg:inline dark:bg-neutral-800 rounded-xl bg-slate-100 transition-all duration-300 ease-in-out"
      )}
      style={{
        height:
          router.pathname === "/checkout" || "/cart"
            ? "calc(100vh - 280px)"
            : "calc(100vh - 200px)",
      }}
    >
      <div className="flex bg-white dark:bg-dark items-center justify-between px-[10px] p-[5px]">
        <p className="font-[1.2rem] font-[600] text-black dark:text-white">
          {router.pathname === "/checkout" || "/cart" ? "Summary" : "Cart"}{" "}
        </p>
        {router.pathname === "/checkout" || "/cart" ? (
          <div className="bg-white dark:bg-dark w-[35px] h-[35px] flex items-center justify-center rounded-lg">
            <p className="text-black dark:text-white">{basket.length}</p>
          </div>
        ) : (
          <p
            className="text-primary cursor-pointer hover:underline"
            onClick={() => dispatch(removeAll())}
          >
            Clear ({basket.length})
          </p>
        )}
      </div>
      {basket.map((item, i) => (
        <Card key={item.id + i} {...item} />
      ))}
      <Footer toggle />
    </div>
  ) : (
    <div className="flex-[0.35] mt-[5px] ml-[5px] hidden lg:grid h-full place-items-center transition-all duration-300 ease">
      <div className="flex items-center justify-center flex-col">
        <Lottie
          loop={false}
          animationData={lottieJson}
          play
          style={{ width: 250, height: 250 }}
        />
        <p className="text-[1.2rem] text-slate-900 dark:text-white/90">
          Cart Empty
        </p>
      </div>
    </div>
  );
}

export default CartCard;
