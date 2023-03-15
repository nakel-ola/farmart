import clsx from "clsx";
import React, {
  forwardRef,
  ReactNode,
  useState,
} from "react";
import MenuCard from "../components/MenuCard";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

interface LayoutProps {
  [key: string]: any;
  children: ReactNode;
}

function Layout({ children, className }: LayoutProps, ref: any) {
  const [toggle, setToggle] = useState(false);

  return (
    <div className="relative h-screen bg-white dark:bg-dark overflow-hidden transition-all duration-300 ease-in-out w-[100vw] 2xl:w-fit">
      <Navbar setToggle={setToggle} toggle={toggle} />
      {toggle && <MenuCard toggle={toggle} setToggle={setToggle} />}

      <main
        className="flex justify-between overflow-hidden transition-all duration-300 ease-in-out h-[calc(100vh-60px)]"
      >
        <Sidebar toggle={toggle} />
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
    </div>
  );
}

export default forwardRef(Layout);
