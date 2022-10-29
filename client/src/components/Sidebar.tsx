import { gql, useApolloClient, useMutation } from "@apollo/client";
import { Heart, Home, Login, Logout, Receipt21, User } from "iconsax-react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/features/userSlice";

export const LogoutMutation = gql`
  mutation Logout {
    logout {
      msg
    }
  }
`;

function Sidebar() {
  const router = useRouter();

  const dispatch = useDispatch();

  const user = useSelector((store: any) => store.user.user);
  const [logOut] = useMutation(LogoutMutation);
  const client = useApolloClient();

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
      Icon: User,
      name: "Profile",
      path: "/profile",
    },
  ].filter(Boolean);

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
    <div className="w-[60px] hidden md:flex items-center flex-col justify-between pt-[10px] bg-white dark:bg-dark  transition-all duration-300 ease-in-out">
      <div className="flex flex-col items-start justify-between">
        {items.map(({ Icon, name, path, onClick }: any, i) => (
          <button
            key={i}
            className={`p-[10px] my-[8px] group relative hover:z-50 flex items-center ${
              router.pathname === path &&
              "rounded-lg hover:scale-110 transition-all duration-300 ease"
            }`}
            onClick={() => (onClick ? onClick() : router.push(path))}
          >
            <Icon
              size={25}
              variant={router.pathname === path ? "Bold" : "Outline"}
              className={`group-hover:animate-bounce ${
                router.pathname === path
                  ? "text-primary"
                  : "text-dark dark:text-white"
              }`}
            />
            <div
              className={`absolute top-[50%] py-[3px] px-[5px] translate-y-[-50%] ${
                router.pathname === path ? "left-11" : "left-10"
              } z-50 rounded-lg bg-neutral-900 scale-0 group-hover:scale-100 transition-all duration-300 ease shadow-lg`}
            >
              <p className="text-white text-[0.8rem] whitespace-nowrap">
                {name}
              </p>
            </div>
          </button>
        ))}
      </div>

      <button
        className="p-[10px] my-[8px] group flex items-center relative"
        onClick={handleClick}
      >
        {user ? (
          <Logout className="text-[20px] text-black dark:text-white group-hover:animate-bounce" />
        ) : (
          <Login className="text-[20px] text-black dark:text-white  group-hover:animate-bounce" />
        )}
        <div
          className={`absolute top-[50%] py-[3px] px-[5px] translate-y-[-50%] left-11 z-50 rounded-lg bg-neutral-800 scale-0 group-hover:scale-100 transition-all duration-300 ease shadow-lg`}
        >
          <p className="text-white text-[0.8rem] whitespace-nowrap">
            {user ? "LogOut" : "LogIn"}
          </p>
        </div>
      </button>
    </div>
  );
}

export default Sidebar;
