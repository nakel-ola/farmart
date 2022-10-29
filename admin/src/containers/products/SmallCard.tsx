import { Icon,IconProps } from "iconsax-react";
import React from "react";

type Item = {
  Icon: Icon;
  title: string;
  amount: string;
  color: string;
  IconVariant?: IconProps["variant"];
}

const SmallCard = (props: Item) => {
  const { Icon, title, amount,color,IconVariant= "Outline" } = props;
  return (
    <div className="bg-white dark:bg-dark rounded-xl shrink-0 lg:w-[180px] md:w-[165px] w-[43vw] p-[8px] m-[8px] flex items-center">
      <div
        className={`w-[35px] m-[5px] h-[35px] shrink-0 rounded-full flex items-center justify-center ${color}`}
      >
        <Icon size={22} className="text-white" variant={IconVariant} />
      </div>

      <div>
        <p className="text-black dark:text-white whitespace-nowrap font-semibold">
          {title}
        </p>
        <p className="text- text-neutral-700 dark:text-neutral-400 font-normal">{amount}</p>
      </div>
    </div>
  );
};

export default SmallCard;
