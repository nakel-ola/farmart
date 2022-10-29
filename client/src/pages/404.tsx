/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import Button from "../components/Button";
import Layouts from "../layout/Layouts";

const Custom404: NextPage = () => {
  const router = useRouter();

  return (
    <Layouts disabled>
      <div className="w-full h-screen flex items-center bg-slate-100 dark:bg-neutral-800">
        <div className="max-w-[480px] m-auto  items-center">
          <div className="text-center p-[5px]">
            <h3 className="text-[2rem] text-black dark:text-white">Sorry, page not found!</h3>
          </div>

          <p className="text-center p-[5px] text-neutral-600 dark:text-neutral-400">
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve
            mistyped the URL? Be sure to check your spelling.
          </p>

          <div className="text-center p-[20px]">
            <img src="/illustration_404.svg" alt="" className="w-full h-full object-contain" />
          </div>

          <div className="flex items-center justify-center py-[15px]">
            <Button onClick={() => router.replace("/")}>Go to Home</Button>
          </div>
        </div>
      </div>
    </Layouts>
  );
};

export default Custom404;
