import { useApolloClient, useLazyQuery } from "@apollo/client";
import clsx from "clsx";
import { useRouter } from "next/router";
import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CategoryCard from "../containers/products/CategoryCard";
import onAuthChange from "../helper/onAuthChange";
import { EmyployeeQuery } from "../pages/_app";
import { selectDialog } from "../redux/features/dialogSlice";
import {
  login,
  logout,
  selectCookies,
  selectUser,
} from "../redux/features/userSlice";

interface LayoutProps {
  [key: string]: any;
  children: ReactNode;
}

function Layout({ children, className }: LayoutProps, ref: any) {
  const [toggle, setToggle] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectUser);
  const cookies = useSelector(selectCookies);

  const [getEmployee] = useLazyQuery(EmyployeeQuery);

  const client = useApolloClient();

  const getUser = useCallback(async () => {
    await getEmployee({
      fetchPolicy: "network-only",
      onCompleted: async (data) => {
        if (data.employee?.__typename === "ErrorMsg") {
          router.push("/");
          dispatch(logout());
          await client.resetStore();
        } else if(data.employee?.__typename === "Employee") {
          dispatch(login(data.employee));
        }
      },
    });
  }, [getEmployee,client,dispatch,router]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const dialog = useSelector(selectDialog);

  return (
    <div className="relative h-screen bg-white dark:bg-dark overflow-hidden transition-all duration-300 ease-in-out">
      <Navbar setToggle={setToggle} toggle={toggle} />
      <main
        className="flex justify-between overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          height: "calc(100vh - 60px)",
        }}
      >
        <Sidebar toggle={toggle} />
        <div
          ref={ref}
          className={clsx(
            "relative w-full lg:flex-1 md:mr-[5px] overflow-y-scroll lg:rounded-tl-xl bg-slate-100 overflow-x-hidden dark:bg-neutral-800 scrollbar transition-all duration-300 ease-in-out",
            className
          )}
        >
          {children}
        </div>
      </main>
      {dialog.category.open && <CategoryCard />}
    </div>
  );
}

export default forwardRef(Layout);
