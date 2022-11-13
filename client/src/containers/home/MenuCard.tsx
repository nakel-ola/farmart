import { motion } from "framer-motion";
import React from "react";

const MenuCard = ({
  sortList,
  onClick,
}: {
  sortList: string[];
  onClick(e: any, value: string): void;
}) => {
  return (
    <motion.div
      initial={{ maxHeight: "0px" }}
      animate={{ maxHeight: "200px" }}
      exit={{ maxHeight: "0px" }}
      transition={{ duration: 0.3 }}
      className="absolute top-10 right-2 z-[10] w-[120px] max-h-[200px] overflow-y-scroll bg-white dark:bg-dark shadow-md shadow-slate-300 dark:shadow-black/10 rounded-lg"
    >
      {sortList.map((item: string, index: number) => (
        <div
          key={index}
          className="flex items-center p-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-neutral-800"
          onClick={(e) => onClick(e, item)}
        >
          <p className="pl-1 text-black dark:text-white font-medium">{item}</p>
        </div>
      ))}
    </motion.div>
  );
};

export default MenuCard;
