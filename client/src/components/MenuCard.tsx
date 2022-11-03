import {
  ShoppingBag,
} from "iconsax-react";
import { useRouter } from "next/router";
import { useRef } from "react";
import { IoClose } from "react-icons/io5";
import useOnClickOutside from "../hooks/useOnClickOutside";
import SidebarContent from "./SidebarContent";

const MenuCard = ({
  toggle,
  setToggle,
}: {
  toggle: boolean;
  setToggle(value: boolean): void;
}) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setToggle(false));
  return (
    <div
      className={
        toggle
          ? "fixed top-0 right-0 h-screen w-full md:hidden bg-black/50 z-[9999999]"
          : "-z-50"
      }
    >
      <div ref={ref} className="h-full bg-white dark:bg-dark w-[70%] px-2">
        <div className="h-[60px] py-[10px] flex items-center justify-between">
          <div
            className="h-[50px] shrink-0 flex items-center justify-center"
            onClick={() => router.push("/")}
          >
            <ShoppingBag size={35} variant="Bold" className="text-primary" />
            <p className="text-primary font-bold text-xl pl-2">Farmart</p>
          </div>
          <button
            className="h-[35px] w-[35px] m-2 hover:bg-slate-100 hover:dark:bg-neutral-800 flex items-center justify-center rounded-full"
            onClick={() => setToggle(false)}
          >
            <IoClose
              size={30}
              className="text-4xl text-black dark:text-white"
            />
          </button>
        </div>

        <div className="h-[calc(100%-60px)] flex flex-col justify-between py-[20px]">
          <SidebarContent />
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
