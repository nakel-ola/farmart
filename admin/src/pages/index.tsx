/* eslint-disable @next/next/no-img-element */
import { useApolloClient, useLazyQuery } from "@apollo/client";
import { ArrowLeft } from "iconsax-react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CodeCard from "../containers/home/CodeCard";
import ForgetCard from "../containers/home/ForgetCard";
import LogInCard from "../containers/home/LogInCard";
import PasswordCard from "../containers/home/PasswordCard";
import SignUpCard from "../containers/home/SignUpCard";
import { login, selectCookies, selectUser } from "../redux/features/userSlice";
import { EmyployeeQuery } from "./_app";

function Auth() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const cookies = useSelector(selectCookies);

  console.log(router)

  const toggle = router.query.type;

  const [loading, setLoading] = useState(false);

  const [getEmployee] = useLazyQuery(EmyployeeQuery);

  const getUser = useCallback(async () => {
    if (!user && cookies) {
      await getEmployee({
        fetchPolicy: "network-only",
        onCompleted: async (data) => {
          if (data.employee?.__typename === "Employee") {
            dispatch(login(data.employee));
          }
        },
      });
    }

    if(user && cookies) {
      router.push("/dashboard")
    }
  }, [getEmployee, dispatch, cookies,user,router]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <div className="flex items-center justify-center h-screen relative">
      <Head>
        <title>{toggle}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className="bg-primary/50 w-[60%] h-full hidden md:block relative"
        onContextMenu={(e) => e.preventDefault()}
      >
        <img
          src="/Authentication-rafiki.svg"
          alt=""
          className="h-full w-full object-contain relative"
        />
      </div>
      <div className="bg-white dark:bg-dark w-full md:w-[40%] h-full">
        {toggle && (
          <button
            className="absolute top-0 left-0 m-2 h-[35px] w-[35px] flex items-center justify-center hover:bg-slate-100 hover:dark:bg-neutral-800 rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft size={25} className="text-white" />
          </button>
        )}
        {router.pathname === "/" && !toggle && (
          <LogInCard setLoading={setLoading} />
        )}
        {toggle === "signup" && <SignUpCard setLoading={setLoading} />}
        {toggle === "forget" && <ForgetCard setLoading={setLoading} />}
        {toggle === "code" && <CodeCard setLoading={setLoading} />}
        {toggle === "confirm" && <PasswordCard setLoading={setLoading} />}
      </div>
    </div>
  );
}

export const Footer = ({ title, buttonText, onClick }: any) => {
  return (
    <div className="w-[80%] flex items-center justify-center flex-col pt-0 pb-[15px] md:mt-0 mt-auto">
      <div className="flex items-center justify-center mx-5">
        <p className="pr-2">{title}</p>{" "}
        <strong
          onClick={onClick}
          className="text-blue-600 font-medium hover:underline cursor-pointer"
        >
          {buttonText}
        </strong>
      </div>
    </div>
  );
};

export default Auth;
