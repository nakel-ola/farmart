import { ArrowLeft } from "iconsax-react";
import { useRouter } from "next/router";
import React from "react";

const Header = () => {
  let router = useRouter();
  return (
    <div className="py-[5px] px-[20px] hidden lg:flex items-center w-[100%]">
      <button
        className="h-[35px] w-[35px] flex items-center justify-center hover:bg-white hover:dark:bg-dark rounded-full transition-all duration-300"
        onClick={() => router.back()}
      >
        <ArrowLeft size={25} className="font-bold text-black dark:text-white" />
      </button>
    </div>
  );
};

export default Header;
