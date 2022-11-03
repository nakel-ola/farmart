import { gql, useApolloClient, useMutation } from "@apollo/client";
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

const SidebarContent = () => {
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
    <>
      <div>
        {items.map(({ Icon, path, title }, index: number) => (
          <button
            key={index}
            className={`flex items-center w-11/12 p-[5px] my-3 rounded-xl transition-colors duration-300 ease cursor-pointer ${
              router.pathname === path
                ? "bg-slate-100 dark:bg-neutral-800"
                : "hover:bg-slate-100 dark:hover:bg-neutral-800 bg-transparent"
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
          className={`flex items-center w-11/12 p-[5px] my-3 rounded-xl ${
            router.pathname === "/account"
              ? "bg-slate-100 dark:bg-neutral-800"
              : "hover:bg-slate-100 dark:hover:bg-neutral-800 bg-transparent"
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
          className="flex items-center w-11/12 p-[5px] my-3 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-xl"
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
    </>
  );
};

export default SidebarContent;
