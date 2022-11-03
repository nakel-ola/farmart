import { ArrowLeft } from "iconsax-react";
import { useRouter } from "next/router";
import { ReactNode } from "react";

type Props = {
  title?: string;
  subtitle?: ReactNode;
};

const Header = ({ subtitle, title }: Props) => {
  const router = useRouter();
  return (
    <div className="py-[5px] mx-[20px] hidden items-center justify-between lg:flex">
      <div className="flex items-center">
        <button
          className="h-[35px] w-[35px] flex items-center justify-center hover:bg-white hover:dark:bg-dark rounded-full transition-all duration-300"
          onClick={() => router.back()}
        >
          <ArrowLeft
            size={25}
            className="font-bold text-black dark:text-white"
          />
        </button>
        <p className="text-[1.5rem] font-[600] text-black dark:text-white ml-2">
          {title}
        </p>
      </div>

      {subtitle}
    </div>
  );
};

export default Header;
