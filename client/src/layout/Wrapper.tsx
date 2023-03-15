import { gql, useApolloClient, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { ReactNode, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useUser from "../hooks/useUser";
import { add } from "../redux/features/categorySlice";
import { logout, selectUser } from "../redux/features/userSlice";

export const CategoriesQuery = gql`
  query Categories {
    categories {
      name
    }
  }
`;

const Wrapper = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const client = useApolloClient();
  const authUser = useSelector(selectUser);

  const { getUser } = useUser();

  const handleLogout = useCallback(async () => {
    if (authUser) {
      client.cache.reset();
      dispatch(logout());
      if (router.pathname !== "/") router.push("/");
    }
  }, [authUser, client.cache, dispatch, router]);

  useQuery(CategoriesQuery, {
    onCompleted: (data) => dispatch(add([{ name: "All" }, ...data.categories])),
  });

  const autoLogIn = useCallback(async () => {
    if (typeof window === "undefined") return;

    if (authUser) return;

    const { data } = await getUser();

    if (!data?.user) return handleLogout();
  }, [authUser, getUser, handleLogout]);

  useEffect(() => {
    autoLogIn();
  }, [autoLogIn]);

  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-white dark:bg-dark">
      {children}
    </div>
  );
};

export default Wrapper;
