import { useApolloClient, useMutation } from "@apollo/client";
import { Heart, Home, Login, Logout, Receipt21, User } from "iconsax-react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/features/userSlice";
import Avatar from "./Avatar";
import Divider from "./Divider";
import { LogoutMutation } from "./Sidebar";

const SidebarContent = () => {
  const router = useRouter();

  const dispatch = useDispatch();

  const user = useSelector((store: any) => store.user.user);
  const [logOut] = useMutation(LogoutMutation);
  const client = useApolloClient();
  let name = user?.name.split(" ") ?? [];


  var items = [
    {
      Icon: Home,
      name: "Home",
      path: "/",
    },
    {
      Icon: Heart,
      name: "Saved items",
      path: "/favorite",
    },
    {
      Icon: Receipt21,
      name: "Receipt",
      path: "/receipt",
    },
    {
      Element: user && (
        <Avatar
          src={user?.photoUrl!}
          alt={user?.name}
          onClick={() => user && router.push("/profile")}
          className="w-[30px] h-[30px]"
        />
      ),
      Icon: User,
      name: `${user ? "Hi, " + name[1] : "Profile"}`,
      path: "/profile",
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
    } else {
      router.push("/auth");
    }
  };
  return (
    <>
      <div className="">
        {items.map(({ Icon, name, path, onClick,Element }: any, index: number) => (
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
              {!Element ? (
                <Icon
                  size={25}
                  variant={router.pathname === path ? "Bold" : "Outline"}
                  className={`text-[20px] ${
                    router.pathname === path
                      ? "text-primary"
                      : "text-neutral-700 dark:text-neutral-400"
                  } `}
                />
              ) : (
                Element
              )}
            </div>
            <p
              className={`pl-[8px] pr-[5px] whitespace-nowrap ${
                router.pathname === path
                  ? "text-primary font-bold "
                  : "text-neutral-700 dark:text-neutral-400"
              }`}
            >
              {name}
            </p>
          </button>
        ))}
      </div>

      <div className="">
        <Divider />
        <button
          className="flex items-center w-11/12 p-[5px] my-[5px] hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-xl"
          onClick={handleClick}
        >
          <div className="flex items-center justify-center p-[5px]">
            {user ? (
              <Logout className="text-neutral-700 dark:text-neutral-400" />
            ) : (
              <Login className="text-neutral-700 dark:text-neutral-400" />
            )}
          </div>

          <p className="text-neutral-700 dark:text-neutral-400 pl-[8px]">
            {user ? "Logout" : "Log in"}
          </p>
        </button>
      </div>
    </>
  );
};

export default SidebarContent;
