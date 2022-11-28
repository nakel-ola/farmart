import { TickCircle } from "iconsax-react";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import Confetti from "react-confetti";
import Button from "../components/Button";
import CardTemplate from "../components/CardTemplate";
import useWindowSize from "../hooks/useWindowSize";
import Layouts from "../layout/Layouts";

const Success = () => {
  const router = useRouter();

  return (
    <>
      <Layouts className="w-full grid place-items-center">
        <div className="w-[70%] grid place-items-center ">
          <CardTemplate
            title=""
            showHeader={false}
            className="flex items-center justify-center flex-col py-4"
          >
            <div className="">
              <TickCircle size={100} variant="Bold" className="text-primary" />
            </div>

            <h1 className="text-lg text-black dark:text-white font-medium">
              Thank you for your order!
            </h1>
            <p className="pb-2  text-neutral-600 dark:text-neutral-400">
              Woohoo! You payment was successful, and your order is complete.
            </p>

            <Button className="mb-4" onClick={() => router.push("/receipt")}>
              Check orders
            </Button>
          </CardTemplate>
        </div>
      </Layouts>
      <Confetti className="z-10 fixed top-0" />
    </>
  );
};

export default Success;
