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
import SidebarContent from "./SidebarContent";

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
      className="hidden lg:flex px-[5px] py-[20px] flex-col justify-between 2xl:justify-start  bg-white dark:bg-dark h-[calc(100vh-55px)] transition-all duration-300 ease-in-out w-[260px]  max-w-[260px]"
    >
      <SidebarContent />
    </div>
  );
}

export default Sidebar;
