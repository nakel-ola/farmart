import axios from "axios";
import clsx from "clsx";
// import fs from "fs";
import {
  ArrowLeft,
  HambergerMenu,
  Moon,
  ShoppingBag,
  Sun1,
} from "iconsax-react";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import ProductNav from "../containers/products/ProductNav";
import { toBase64 } from "../helper/toBase64";
import useWindowResizeListener from "../hooks/useWindowResizeListener";
import { selectUser } from "../redux/features/userSlice";
import { useTheme } from "../styles/theme";
import Button from "./Button";

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

const config = {
  headers: { "content-type": "multipart/form-data" },
  onUploadProgress: (event: any) => {
    console.log(
      `Current progress:`,
      Math.round((event.loaded * 100) / event.total)
    );
  },
};

const Navbar = ({ toggle, setToggle }: NavbarProps) => {
  const router = useRouter();
  const user = useSelector(selectUser);

  const formRef = useRef<HTMLFormElement>(null);

  const capitalizeFirstLetter = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  let canEdit = user?.level === "Gold" || user?.level === "Silver";

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    let files = e.target.files;
    if (e.target.validity.valid && files && files.length > 0) {
      let formData = new FormData(formRef.current!) as any;
      const newUrl = await toBase64(files[0]);

      let file = {
        dataUrl: newUrl,
        fileName: files[0].name,
        mimeType: files[0].type,
      };

      await axios
        .post("/api/upload-url", {
          file,
        })
        .then((data) => {
          console.log(data);
          alert(data.data.url)
        });
    }
  };

  return (
    <div className="w-full h-[60px] bg-white dark:bg-dark flex items-center justify-between">
      <div className="lg:flex items-center flex-[0.2] hidden">
        <div className=" flex items-center w-fit m-2 rounded-md">
          <div className={`h-[50px] shrink-0 flex items-center justify-center`}>
            <ShoppingBag size={35} variant="Bold" className="text-primary" />
            <p className="text-primary font-bold text-2xl pl-2">Farmart</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-between ">
        <div className="flex items-center">
          <button
            className={clsx(
              "mx-2  h-[35px] w-[35px] flex items-center justify-center lg:hidden hover:bg-slate-100 dark:hover:bg-neutral-800 hover:scale-105 active:scale-95 rounded-full"
            )}
            onClick={() =>
              mainPath.includes(router.pathname)
                ? setToggle(!toggle)
                : router.back()
            }
          >
            {mainPath.includes(router.pathname) ? (
              <HambergerMenu
                size={25}
                className="text-[25px] text-black dark:text-white"
              />
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
          {/* <label htmlFor="theFiles">
            <p className="">Click me</p>
          </label> */}

          <form ref={formRef} className="">
            <input
              type="file"
              id="theFiles"
              name="theFiles"
              accept="image/*"
              multiple={false}
              className=""
              onChange={handleChange}
            />
          </form>

          {router.pathname === "/products" && canEdit && <ProductNav />}
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
    <div className="relative h-[35px] w-[35px] lg:min-w-[65px] lg:max-h-[32px] bg-slate-100 dark:bg-neutral-800 m-2 rounded-full flex items-center justify-center">
      <div className="relative hidden lg:flex items-center justify-between w-full h-full z-[1]">
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

      <button
        className="lg:hidden flex items-center justify-center"
        onClick={handleClick}
      >
        {currentTheme === "dark" ? (
          <Sun1 size={20} className="text-xl text-black dark:text-white" />
        ) : (
          <Moon size={20} className="text-xl text-black dark:text-white" />
        )}
      </button>

      <div
        className={`absolute hidden lg:block top-[50%] translate-y-[-50%] h-[28px] w-[28px] bg-white dark:bg-dark rounded-full transition-all duration-300 ${
          currentTheme === "dark" ? "left-[35px]" : "left-[3px]"
        }`}
      ></div>
    </div>
  );
};
export default Navbar;
