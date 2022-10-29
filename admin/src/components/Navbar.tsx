import clsx from "clsx";
import {
  ArrowLeft,
  HambergerMenu,
  Moon,
  ShoppingBag,
  Sun1,
} from "iconsax-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import ProductNav from "../containers/products/ProductNav";
import useWindowResizeListener from "../hooks/useWindowResizeListener";
import { selectUser } from "../redux/features/userSlice";
import { useTheme } from "../styles/theme";

interface NavbarProps {
  toggle: boolean;
  setToggle(value: boolean): void;
}

let mainPath = [
  "/dashboard",
  "/orders",
  "/products",
  "/customers",
  "/employees",
];

const Navbar = ({ toggle, setToggle }: NavbarProps) => {
  const router = useRouter();

  const screenSize = useWindowResizeListener();
  const user = useSelector(selectUser);


  useEffect(() => {
    if (screenSize <= 900) setToggle(false);
    else setToggle(true);
  }, [screenSize,setToggle]);

  const capitalizeFirstLetter = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1);
  
  let canEdit = user?.level === "Gold" || user?.level === "Silver";
  

  return (
    <div className="w-full h-[60px] bg-white dark:bg-dark flex items-center justify-between">
      <div className={toggle ? "flex items-center flex-[0.2]" : "hidden"}>
        <div className=" flex items-center w-fit m-2 rounded-md">
          <div className={`h-[50px] shrink-0 flex items-center justify-center`}>
            <ShoppingBag size={35} variant="Bold" className="text-primary" />
            <p className="text-primary font-bold text-2xl pl-2">Grocery</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-between ">
        <div className="flex items-center">
          <button
            className={clsx("mx-2  h-[35px] w-[35px] flex items-center justify-center lg:hidden hover:bg-slate-100 dark:hover:bg-neutral-800 hover:scale-105 active:scale-95 rounded-full", toggle ? "ml-16" : "")}
            onClick={() =>
              mainPath.includes(router.pathname)
                ? setToggle(!toggle)
                : router.back()
            }
          >
            {mainPath.includes(router.pathname) ? (
              toggle ? (
                <IoClose className="text-[25px] text-black dark:text-white" />
              ) : (
                <HambergerMenu
                  size={25}
                  className="text-[25px] text-black dark:text-white"
                />
              )
            ) : (
              <ArrowLeft
                size={25}
                className="text-[25px] text-black dark:text-white"
              />
            )}
          </button>

          <p className="text-black hidden lg:inline dark:text-white lg:ml-2 font-[500] text-[1.2rem]">
            {capitalizeFirstLetter(
              router.pathname === "/"
                ? "dashboard"
                : router.pathname.split("/")[1]
            )}
          </p>
        </div>

        <div className="flex flex-1 justify-between items-center">
          <div className="ml-auto" />
          {(router.pathname === "/products" && canEdit) && <ProductNav />}
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

const ThemeToggle = () => {
  const { systemTheme, theme, setTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  const handleClick = () => {
    const isDark = currentTheme === "dark";
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="relative min-w-[65px] max-h-[30px] bg-slate-100 dark:bg-neutral-800 m-2 rounded-full">
      <div className="relative flex items-center justify-between w-full h-full z-[1]">
        <button
          className="m-[2px] h-[28px] w-[28px] flex items-center justify-center rounded-full"
          onClick={handleClick}
        >
          <Sun1 size={20} className="text-xl text-black dark:text-white" />
        </button>

        <button
          className="m-[2px] h-[28px] w-[28px] flex items-center justify-center rounded-full"
          onClick={handleClick}
        >
          <Moon size={20} className="text-xl text-black dark:text-white" />
        </button>
      </div>

      <div
        className={`absolute top-[50%] translate-y-[-50%] h-[28px] w-[28px] bg-white dark:bg-dark rounded-full transition-all duration-300 ${
          currentTheme === "dark" ? "left-[35px]" : "left-[2px]"
        }`}
      ></div>
    </div>
  );
};
export default Navbar;
