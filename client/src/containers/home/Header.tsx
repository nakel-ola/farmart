import clsx from "clsx";
import { AnimatePresence } from "framer-motion";
import { ArrowDown2 } from "iconsax-react";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import capitalizeFirstLetter from "../../helper/capitalizeFirstLetter";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import MenuCard from "./MenuCard";

type Props = { categories: string[] };

const Header: React.FC<Props> = ({ categories }) => {
  const router = useRouter();

  let genre = router.query.genre?.toString();

  return (
    <div className="w-full flex items-center justify-between px-[4px] py-[10px] h-[45px] mb-2">
      <p className="text-xl text-black dark:text-white font-[500] md:pl-4">
        {genre ? capitalizeFirstLetter(genre) : "All"}
      </p>

      <SortCard sortList={categories} />
    </div>
  );
};

interface SortProps {
  sortList: string[];
}

const SortCard = (props: SortProps) => {
  const { sortList } = props;

  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setOpen(false));

  const handleClick = (e: any, item: string) => {
    setOpen(false);
    let genre = item.toLowerCase();
    router.push(genre === "all" ? `/` : `/?genre=${genre}`);
  };

  return (
    <div ref={ref} className="relative">
      <button
        className="relative text-neutral-600 dark:text-neutral-300 flex items-center my-auto bg-white dark:bg-dark rounded-full mr-[10px] ml-auto md:ml-0 p-[3px] px-3 py-1.5"
        onClick={() => setOpen(!open)}
      >
        Category
        <ArrowDown2
          size={20}
          className={clsx(
            "text-black dark:text-white ml-2",
            open ? "rotate-180" : ""
          )}
        />
      </button>

      <AnimatePresence>
        {open && <MenuCard sortList={sortList} onClick={handleClick} />}
      </AnimatePresence>
    </div>
  );
};

export default Header;
