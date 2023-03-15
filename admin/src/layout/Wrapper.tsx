import { useApolloClient } from "@apollo/client";
import { useRouter } from "next/router";
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import PageLoader from "../components/PageLoader";
import useUser from "../hooks/useUser";
import { logout, selectUser } from "../redux/features/userSlice";

interface Props {}

const reserve = ["/"]

const Wrapper = (props: PropsWithChildren<Props>) => {
  const { children } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const client = useApolloClient();
  const authUser = useSelector(selectUser);
  const [loading, setLoading] = useState(false);

  const { getUser } = useUser();

  const handleLogout = useCallback(async () => {
    if (!authUser) return;
    client.cache.reset();
    dispatch(logout());
    if (router.pathname !== "/") router.push("/");
  }, [authUser, client.cache, dispatch, router]);

  const autoLogIn = useCallback(async () => {
    if (typeof window === "undefined") return;

    if (authUser) return;

    setLoading(true);

    const { data } = await getUser();

    setLoading(false);

    if (!data?.user) return handleLogout();

    if (router.pathname === "/") router.push("/dashboard");
  }, [authUser, getUser, handleLogout, router]);

  useEffect(() => {
    autoLogIn();
  }, [autoLogIn]);

  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-white dark:bg-dark">
      {loading ? <PageLoader /> : children}
    </div>
  );
};

export default Wrapper;
