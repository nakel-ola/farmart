import clsx from "clsx";
import { forwardRef, ReactNode, Ref, RefObject, useState } from "react";
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
      <div className="h-screen bg-white dark:bg-dark overflow-hidden transition-all duration-300 ease-in-out">
        <Navbar toggle={toggle} setToggle={setToggle} />
        {toggle && <MenuCard toggle={toggle} setToggle={setToggle} />}
        <main className="flex h-[calc(100vh-55px)] justify-between overflow-hidden transition-all duration-300 ease-in-out">
          <Sidebar />
          <div
            ref={ref}
            className={clsx(
              "relative flex-1 md:mr-[5px] mt-[5px] overflow-y-scroll md:rounded-tl-xl bg-slate-100 overflow-x-hidden dark:bg-neutral-800  scrollbar-style transition-all duration-300 ease-in-out",
              className
            )}
          >
            {children}
          </div>
        </main>

        {dialogState.cart.open && <CartCard />}

        {dialogState.filter.open && <FilterCard />}
      </div>
    );
  }
);

Layouts.displayName = "Layouts";
export default Layouts;
