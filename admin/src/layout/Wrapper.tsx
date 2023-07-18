import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
} from "react";
import PageLoader from "../components/PageLoader";


interface Props {}

const reserve = ["/"];

const Wrapper = (props: PropsWithChildren<Props>) => {
  const { children } = props;
  const { status } = useSession();

  const router = useRouter();

  const autoLogIn = useCallback(async () => {
    if (status === "loading") return;

    const isUnauthenticatedPath = reserve.find((path) =>
      path.includes(router.pathname)
    );

    if (status === "unauthenticated" && !isUnauthenticatedPath)
      router.replace("/");

    if (status === "authenticated" && isUnauthenticatedPath)
      router.push("/dashboard");
  }, [router, status]);

  useEffect(() => {
    autoLogIn();
  }, [autoLogIn]);

  return (
    <div className="bg-white dark:bg-dark mx-auto w-full max-w-7xl">
      {status === "loading" ? <PageLoader /> : children}
    </div>
  );
};

export default Wrapper;
