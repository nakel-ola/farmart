import { ReactNode } from "react";

type Props = {
  title?: string;
  subtitle?: ReactNode;
};

const Header = ({ subtitle, title }: Props) => {
  return (
    <div className="py-[5px] mx-[20px] hidden items-center justify-between lg:flex">
      <div className="flex items-center">
        <p className="text-[1.5rem] font-[600] text-black dark:text-white ml-2">
          {title}
        </p>
      </div>

      {subtitle}
    </div>
  );
};

export default Header;
