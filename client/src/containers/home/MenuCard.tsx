import React from "react";

const MenuCard = ({
  sortList,
  onClick,
}: {
  sortList: string[];
  onClick(e: any, value: string): void;
}) => {
  return (
    <div className="w-[120px] max-h-[200px] overflow-scroll bg-white dark:bg-dark shadow-md shadow-slate-300 dark:shadow-black/10 rounded-lg scrollbar-hide">
      {sortList.map((item: string, index: number) => (
        <div
          key={index}
          className="flex items-center p-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-neutral-800"
          onClick={(e) => onClick(e, item)}
        >
          <p className="pl-1 text-black dark:text-white font-medium">{item}</p>
        </div>
      ))}
    </div>
  );
};

export default MenuCard;
