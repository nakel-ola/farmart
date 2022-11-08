import { ShoppingBag } from "iconsax-react";
import React from "react";

function TitleCard({ title }: { title: string; }) {
  return (
    <div className="flex items-center justify-center flex-col py-6 pt-16 md:pt-6 w-[80%]">
      <div className="w-[50px] h-[50px] shrink-0 flex items-center justify-center">
        <ShoppingBag size={50} variant="Bold" className="text-primary" />
      </div>
      <strong className="text-primary text-2xl">Farmart</strong>
      <p className="text-[1.5rem] p-[3px] font-[400] text-neutral-700 dark:text-neutral-200 text-center">
        {title}
      </p>
    </div>
  );
}

export default TitleCard;
