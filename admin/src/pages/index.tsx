/* eslint-disable @next/next/no-img-element */
import { useApolloClient, useLazyQuery } from "@apollo/client";
import { ArrowLeft } from "iconsax-react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import ReactLoading from "react-loading";
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


  const renderCard = () => {
    switch (toggle) {
      case "signup":
        return <SignUpCard setLoading={setLoading} />;
      case "forget":
        return <ForgetCard setLoading={setLoading} />;
      case "code":
        return <CodeCard setLoading={setLoading} />;
      case "confirm":
        return <PasswordCard setLoading={setLoading} />;

      default:
        return <LogInCard setLoading={setLoading} />;
    }
  };

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
      <div className="bg-white dark:bg-dark w-full md:w-[40%] h-full relative overflow-y-scroll">
        {toggle && (
          <button
            className="sticky top-0 z-[10] m-2 h-[35px] w-[35px] flex items-center justify-center hover:bg-slate-100 hover:dark:bg-neutral-800 rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft size={25} className="text-white" />
          </button>
        )}

        <div className="relative h-[calc(100%-60px)] w-full">
          {renderCard()}
        </div>
        {/* {router.pathname === "/" && !toggle && (
          <LogInCard setLoading={setLoading} />
        )}
        {toggle === "signup" && <SignUpCard setLoading={setLoading} />}
        {toggle === "forget" && <ForgetCard setLoading={setLoading} />}
        {toggle === "code" && <CodeCard setLoading={setLoading} />}
        {toggle === "confirm" && <PasswordCard setLoading={setLoading} />} */}
      </div>

      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.6)] grid place-items-center z-10">
          <div className="flex items-center justify-center flex-col">
            <ReactLoading type="spinningBubbles" />
            <p className="text-white text-[1.2rem] p-[8px]">
              {toggle === "signin" && "Logging In"}
              {toggle === "signup" && "Creating Account"}
              {toggle === "forget" && "Validating"}
              {toggle === "confirm" && "Creating Password"}
            </p>
          </div>
        </div>
      )}
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
