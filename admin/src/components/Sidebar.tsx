import { gql, useApolloClient, useMutation } from "@apollo/client";
import clsx from "clsx";
import {
  Bag2,
  Grid2,
  Logout,
  Profile2User,
  ShoppingCart,
  User,
  UserOctagon,
} from "iconsax-react";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/features/userSlice";
import { Divider } from "./Divider";

const LogoutMutation = gql`
  mutation Logout {
    logout {
      msg
    }
  }
`;

function Sidebar({ toggle }: { toggle: boolean }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const { user } = useSelector((store: any) => store.user);

  const [logOut] = useMutation(LogoutMutation);
  const client = useApolloClient();

  const items = [
    {
      Icon: Grid2,
      title: "Dashboard",
      path: "/dashboard",
    },
    {
      Icon: ShoppingCart,
      title: "Orders",
      path: "/orders",
    },
    {
      Icon: Bag2,
      title: "Products",
      path: "/products",
    },
    {
      Icon: Profile2User,
      title: "Customers",
      path: "/customers",
    },
    {
      Icon: UserOctagon,
      title: "Employees",
      path: "/employees",
    },
  ];

  const handleClick = async () => {
    if (user) {
      await logOut({
        onCompleted: () => {
          client.resetStore().then(() => {
            dispatch(logout());
            router.push("/");
          });
        },
        onError: (er) => console.table(er),
      });
    }
  };

  return (
    <div
      className={clsx(
        toggle
          ? "absolute z-10 top-[60px] shadow-md lg:shadow-none lg:static dark:shadow-black/40 flex-col justify-between px-[5px] py-[20px] bg-white dark:bg-dark flex lg:flex-[0.2] lg:min-w-[15vw] max-w-[260px] min-w-[260px] md:min-w-[260px] md:w-[260px] w-[100%] left-0 h-[calc(100vh-60px)]"
          : "hidden h-full",
      )}
    >
      <div>
        {items.map(({ Icon, path, title }, index: number) => (
          <button
            key={index}
            className={`flex items-center w-11/12 p-[5px] my-[8px] rounded-full transition-colors duration-300 ease cursor-pointer border-[1px] ${
              router.pathname === path
                ? "border-primary/20"
                : "hover:border-slate-100 dark:hover:border-neutral-800 border-transparent"
            }`}
            onClick={() => router.push(path)}
          >
            <div className="flex items-center justify-center p-[5px]">
              <Icon
                size={25}
                variant={router.pathname === path ? "Bold" : "Outline"}
                className={`text-[20px] ${
                  router.pathname === path
                    ? "text-primary font-bold"
                    : "text-neutral-700 dark:text-neutral-400"
                } `}
              />
            </div>
            <p
              className={`pl-[8px] pr-[5px] ${
                router.pathname === path
                  ? "text-primary font-bold "
                  : "text-neutral-700 dark:text-neutral-400"
              }`}
            >
              {title}
            </p>
          </button>
        ))}
      </div>

      <div>
        <Divider />
        <button
          className={`flex items-center w-11/12 p-[5px] my-[5px] rounded-full border-[1px] ${
            router.pathname === "/account"
              ? "border-primary/20"
              : "hover:border-slate-100 dark:hover:border-neutral-800 border-transparent"
          }`}
          onClick={() => router.push("/account")}
        >
          <div className="flex items-center justify-center p-[5px]">
            <User
              variant={router.pathname === "/account" ? "Bold" : "Outline"}
              className={`text-[20px] ${
                router.pathname === "/account"
                  ? "text-primary font-bold"
                  : "text-neutral-700 dark:text-neutral-400"
              }`}
            />
          </div>

          <p
            className={`pl-[8px] ${
              router.pathname === "/account"
                ? "text-primary font-medium "
                : "text-neutral-700 dark:text-neutral-400"
            }`}
          >
            Account
          </p>
        </button>

        <button
          className="flex items-center w-11/12 p-[5px] my-[5px] border-[1px] hover:border-slate-100 dark:hover:border-neutral-800 border-transparent rounded-full"
          onClick={handleClick}
        >
          <div className="flex items-center justify-center p-[5px]">
            <Logout className="text-[20px] text-neutral-700 dark:text-neutral-400" />
          </div>

          <p className="text-neutral-700 dark:text-neutral-400 pl-[8px]">
            Logout
          </p>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
