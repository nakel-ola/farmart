import {
  ArrowLeft,
  HambergerMenu,
  ShoppingBag,
  ShoppingCart,
} from "iconsax-react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { selectBasket } from "../redux/features/basketSlice";
import { add } from "../redux/features/dialogSlice";
import ModeToggle from "./ModeToggle";
import SearchCard from "./SearchCard";

let mainPath = ["/", "/favorite", "/receipt", "/profile"];

function Navbar({
  toggle,
  setToggle,
}: {
  toggle: boolean;
  setToggle(value: boolean): void;
}) {
  const router = useRouter();

  return (
    <div className="px-[5px] h-[55px] bg-white dark:bg-dark sticky top-0 z-10 flex items-center justify-between">
      {/* logo */}

      <div className="flex items-center mt-2 ml-1 mb-2 w-[260px] max-w-[260px]">
        <button
          className="m-2 lg:hidden"
          onClick={(e: any) =>
            mainPath.includes(router.pathname)
              ? setToggle(!toggle)
              : router.back()
          }
        >
          {mainPath.includes(router.pathname) ? (
            <HambergerMenu className="w-6 h-6 text-black dark:text-white" />
          ) : (
            <ArrowLeft className="w-6 h-6 text-black dark:text-white" />
          )}
        </button>
        <div
          className="h-[50px] shrink-0 hidden md:flex items-center justify-center"
          onClick={() => router.push("/")}
        >
          <ShoppingBag size={35} variant="Bold" className="text-primary" />
          <p className="text-primary font-bold text-2xl pl-2">Farmart</p>
        </div>
      </div>

      <div className="flex items-center lg:justify-start justify-center flex-1">
        <SearchCard />
      </div>

      <div className=" bg-white dark:bg-dark flex items-center justify-p-[8px]">
        <CartIcon />
        <ModeToggle />
      </div>
    </div>
  );
}

const CartIcon = () => {
  const dispatch = useDispatch();
  const basket = useSelector(selectBasket);

  return (
    <button
      onClick={() => dispatch(add({ type: "cart", open: true, data: null }))}
      className="relative h-[35px] w-[35px] bg-slate-100 dark:bg-neutral-800 rounded-full flex items-center justify-center"
    >
      <ShoppingCart
        size={25}
        className="text-black dark:text-white text-[25px] relative"
      />
      {basket.length >= 1 && (
        <span className="absolute top-[-2px] right-[-2px] w-[15px] h-[15px] rounded-full flex items-center justify-center bg-primary">
          <p className="text-white text-[0.8rem] font-[500] text-center">
            {basket.length}
          </p>
        </span>
      )}
    </button>
  );
};
export default Navbar;
