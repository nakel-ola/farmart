import clsx from "clsx";
import { AnimatePresence } from "framer-motion";
import { ReactNode, Ref, RefObject, forwardRef, useState } from "react";
import { useSelector } from "react-redux";
import CartCard from "../components/CartCard";
import FilterCard from "../components/FilterCard";
import MenuCard from "../components/MenuCard";
import Navbar from "../components/Navbar";
import PopupTemplate from "../components/PopupTemplate";
import Sidebar from "../components/Sidebar";
import { selectDialog } from "../redux/features/dialogSlice";

type Props = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
};
const Layouts = forwardRef(
  (
    { children, className, disabled = false }: Props,
    ref: Ref<HTMLDivElement>
  ) => {
    const [toggle, setToggle] = useState(false);

    const dialogState = useSelector(selectDialog);

    return (
      <div className="h-screen bg-white dark:bg-dark overflow-hidden transition-all duration-300 ease-in-out w-[100vw] 2xl:w-fit">
        <Navbar toggle={toggle} setToggle={setToggle} />
        {toggle && <MenuCard toggle={toggle} setToggle={setToggle} />}
        <main className="flex h-[calc(100vh-60px)] justify-between overflow-hidden transition-all duration-300 ease-in-out">
          <Sidebar />
          <div
            ref={ref}
            className={clsx(
              "relative w-full lg:flex-1 2xl:w-[805px] h-full md:mr-[5px] overflow-y-scroll lg:rounded-tl-xl 2xl:rounded-t-xl bg-slate-100 overflow-x-hidden dark:bg-neutral-800 scrollbar transition-all duration-300 ease-in-out",
              className
            )}
          >
            {children}
          </div>
        </main>

        <AnimatePresence>
          {dialogState.cart.open && <CartCard />}

          {dialogState.filter.open && <FilterCard />}
        </AnimatePresence>
      </div>
    );
  }
);

Layouts.displayName = "Layouts";
export default Layouts;
