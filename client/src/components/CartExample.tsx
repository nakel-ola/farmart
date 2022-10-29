import clsx from "clsx";
import { ArrowLeft } from "iconsax-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { IoChevronBack } from "react-icons/io5";
import Lottie from "react-lottie-player";
import { useSelector } from "react-redux";
import Button from "../components/Button";
import Card from "../containers/sidecart/Card";
import Footer from "../containers/sidecart/Footer";
import lottieJson from "../database/4496-empty-cart.json";

const Cart: NextPage = () => {
  const { basket }: { basket: any[] } = useSelector(
    (store: any) => store.basket
  );

  const router = useRouter();

  return basket.length >= 1 ? (
    <div>
      <div className="fixed top-0 z-10 w-full bg-white dark:bg-dark flex items-center justify-between py-1">
        <div className="flex items-center">
          <div
            className="w-[35px] h-[35px] rounded-full flex items-center justify-center m-[5px]"
            onClick={() => router.back()}
          >
            <ArrowLeft
              size={25}
              className="text-[25px] text-black dark:text-white"
            />
          </div>

          <p className="font-[1.2rem] font-[600] text-black dark:text-white">
            Cart
          </p>
        </div>

        <div className="flex items-center justify-center p-[8px]">
          <p className="text-primary cursor-pointer :underline">Clear</p>
        </div>
      </div>
      <div
        className={clsx(
          "flex-[0.35] mt-[45px] overflow-y-scroll scrollbar-style h-[calc(100vh-300px)] lg:inline dark:bg-neutral-800 bg-slate-100 transition-all duration-300 ease-in-out"
        )}
      >
        {basket.map((item, i) => (
          <Card key={item.id + i} {...item} />
        ))}
        <Footer cart={true} />
      </div>
    </div>
  ) : (
    <div className="flex-[0.35] ml-[5px] grid h-screen place-items-center transition-all duration-300 ease">
      <div className="flex items-center justify-center flex-col">
        <Lottie
          loop={false}
          animationData={lottieJson}
          play
          style={{ width: 250, height: 250 }}
        />
        <p className="text-[1.2rem] text-slate-900 dark:text-white/90">
          Cart Empty
        </p>

        <Button onClick={() => router.back()}>
          <p>Go To Home</p>
        </Button>
      </div>
    </div>
  );
};

export default Cart;
