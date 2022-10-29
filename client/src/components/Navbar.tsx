import {
  ArrowLeft,
  HambergerMenu,
  ShoppingBag,
  ShoppingCart,
} from "iconsax-react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectBasket } from "../redux/features/basketSlice";
import { selectUser } from "../redux/features/userSlice";
import Avatar from "./Avatar";
import CategoryTab from "./CategoryTab";
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

  const { category } = useSelector((store: any) => store.category);
  const user = useSelector(selectUser);
  const basket = useSelector(selectBasket);

  return (
    <div className="px-[5px] h-[60px] bg-white dark:bg-dark sticky top-0 z-10 flex items-center justify-between">
      {/* logo */}

      <div className="flex items-center">
        <button
          className="m-2 md:hidden"
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
          className="w-[50px] h-[50px] shrink-0 flex items-center justify-center"
          onClick={() => router.push("/")}
        >
          <ShoppingBag size={35} variant="Bold" className="text-primary" />
        </div>
      </div>

      {/* search bar */}

      <div className="flex items-center flex-1 ml-[10px] md:mr-[20px]">
        {category.length > 0 && router.pathname === "/" && (
          <CategoryTab items={category} />
        )}

        <SearchCard />

        <div className="md:hidden ml-auto flex items-center">
          <button onClick={() => router.push("/cart")} className="relative">
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

          <ModeToggle />
        </div>
      </div>

      {/* user Info */}

      <div className="flex-[0.35] bg-white dark:bg-dark hidden lg:flex items-center justify-between p-[8px]">
        <div className="flex flex-1">
          <Avatar
            src={user?.photoUrl!}
            alt={user?.name}
            onClick={() => user && router.push("/profile")}
          />
          <div
            className="flex items-center ml-[8px]"
            onClick={() => user && router.push("/profile")}
          >
            <div className="cursor-pointer">
              <p className="text-[0.8rem] font-bold text-slate-800 dark:text-slate-100 ">
                {user ? user?.name : "Visitor"}
              </p>
              <p className="text-[0.8rem] text-slate-500 dark:text-gray-300">
                {user ? user?.email : "User"}
              </p>
            </div>
          </div>
        </div>

        <ModeToggle />
      </div>
    </div>
  );
}
export default Navbar;
