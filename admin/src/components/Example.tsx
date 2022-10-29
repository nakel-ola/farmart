import { useLazyQuery } from "@apollo/client";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ForgetCard from "../containers/home/ForgetCard";
import LogInCard from "../containers/home/LogInCard";
import PasswordCard from "../containers/home/PasswordCard";
import { login, selectCookies } from "../redux/features/userSlice";
import { EmyployeeQuery } from "./_app";

function Auth() {
  const router = useRouter();

  const toggle = router.query.type;

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const cookies = useSelector(selectCookies);

  const [getEmployee] = useLazyQuery(EmyployeeQuery);

  const getUser = useCallback(async () => {
    if (cookies?.grocery_admin) {
      await getEmployee({
        fetchPolicy: "network-only",
        onCompleted: (data) => {
          if (data.employee?.__typename !== "ErrorMsg") {
            router.push("/dashboard");
            dispatch(login(data.employee));
          }
        },
        onError: (err) => {
          console.table(err)
        }
      });
    }
  }, []);

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="bg-slate-100 flex items-center justify-center flex-col dark:bg-dark h-screen overflow-scroll scrollbar-style">
      <Head>
        <title>{toggle}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-[80px] max-h-[80px] m-[10px]">
        <img
          className="w-full h-full pt-[5px] pr-[5px] object-cover"
          src="http://localhost:4000/images/grocery_logo.png"
          alt=""
        />
      </div>

      {router.pathname === "/" && !toggle && (
        <LogInCard setLoading={setLoading} />
      )}

      {toggle === "forget" && <ForgetCard setLoading={setLoading} />}

      {toggle === "confirm" && <PasswordCard setLoading={setLoading} />}

      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.6)] grid place-items-center">
          <div className="flex items-center justify-center flex-col">
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

const Footer = ({ title, buttonText, onClick }: any) => {
  return (
    <div className="w-[80%] flex items-center justify-center  flex-col pt-[15px]">
      <div className="flex items-center justify-center">
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
