import {
    Heart,
    Home,
    Login,
    Logout,
    Moon,
    Receipt21,
    Sun1,
    User
} from "iconsax-react";
import { useRouter } from "next/router";
import { useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import useOnClickOutside from "../hooks/useOnClickOutside";
import { logout } from "../redux/features/userSlice";

const MenuCard = ({
  toggle,
  setToggle,
}: {
  toggle: boolean;
  setToggle(value: boolean): void;
}) => {
  const user = useSelector((store: any) => store.user.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null)

  var items: any[] = [
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
    user
      ? {
          Icon: User,
          name: "Profile",
          path: "/profile",
        }
      : false,
    {
      Icon: user ? Logout : Login,
      name: user ? "LogOut" : "LogIn",
      onClick: () =>
        user ? dispatch(logout()) : router.push("/auth/?type=signin"),
      path: "",
    },
  ].filter(Boolean);

  useOnClickOutside(ref, () => setToggle(false))
  return (
    <div
      className={
        toggle
          ? "fixed top-0 right-0 h-screen w-full md:hidden bg-black/50 z-[9999999]"
          : "-z-50"
      }
    >
      <div ref={ref} className="h-full bg-white dark:bg-dark w-[60%]">
        <div className="h-[35px] w-[35px] p-2" onClick={() => setToggle(false)}>
          <IoClose size={35} className="text-4xl text-black dark:text-white" />
        </div>

        <div className="mt-10">
          {items.map(({ Icon, name, path, onClick }, index) => (
            <div
              key={index}
              className={`rounded-lg flex items-center m-2 cursor-pointer transition-all duration-300 hover:bg-slate-100 hover:dark:bg-neutral-800 p-1 "`}
              onClick={() => (onClick ? onClick() : router.push(path))}
            >
              <div className="w-[35px] h-[35px] flex items-center justify-center">
                <Icon
                size={25}
                variant={router.pathname === path ? 'Bold' : 'Outline'}
                  className={`${
                    router.pathname === path
                      ? "text-primary"
                      : "text-black dark:text-white"
                  }`}
                />
              </div>

              <p
                className={`ml-2  text-base ${
                  router.pathname === path
                    ? "text-primary font-medium"
                    : "text-black dark:text-white"
                }`}
              >
                {name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
