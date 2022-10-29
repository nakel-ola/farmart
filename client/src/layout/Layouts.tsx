import clsx from "clsx";
import { forwardRef, ReactNode, Ref, RefObject, useState } from "react";
import CartCard from "../components/CartCard";
import MenuCard from "../components/MenuCard";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

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

    return (
      <div className="h-screen bg-white dark:bg-dark overflow-hidden transition-all duration-300 ease-in-out">
        <Navbar toggle={toggle} setToggle={setToggle} />
        {toggle && <MenuCard toggle={toggle} setToggle={setToggle} />}
        <main className="flex h-[calc(100vh-60px)] justify-between overflow-hidden transition-all duration-300 ease-in-out">
          <Sidebar />
          <div
            ref={ref}
            className={clsx(
              "relative flex-1 md:mr-[5px] mt-[5px] overflow-y-scroll md:rounded-t-xl bg-slate-100 overflow-x-hidden dark:bg-neutral-800  scrollbar-style transition-all duration-300 ease-in-out",
              className
            )}
          >
            {children}
          </div>

          {!disabled && <CartCard />}
        </main>
      </div>
    );
  }
);

Layouts.displayName = "Layouts";
export default Layouts;
