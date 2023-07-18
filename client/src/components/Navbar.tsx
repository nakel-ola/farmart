import { ArrowLeft, HambergerMenu, ShoppingBag } from "iconsax-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import ModeToggle from "./ModeToggle";
import SearchCard from "./SearchCard";

const CartIcon = dynamic(() => import("./CartIcon"));

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
          className="mx-2 h-[35px] w-[35px] flex items-center lg:hidden justify-center hover:bg-slate-100 dark:hover:bg-neutral-800 hover:scale-105 active:scale-95 rounded-full"
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
        {!mainPath.includes(router.pathname) && (
          <button
            className="mr-2 h-[35px] w-[35px] hidden items-center lg:flex justify-center hover:bg-slate-100 dark:hover:bg-neutral-800 hover:scale-105 active:scale-95 rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft
              size={25}
              className="text-[25px] text-black dark:text-white"
            />
          </button>
        )}
        <SearchCard />
      </div>

      <div className=" bg-white dark:bg-dark flex items-center justify-p-[8px]">
        <CartIcon />
        <ModeToggle />
      </div>
    </div>
  );
}

export default Navbar;
