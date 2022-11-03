import { ArrowDown2, ArrowUp2 } from "iconsax-react";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { Popover } from "react-tiny-popover";
import capitalizeFirstLetter from "../../helper/capitalizeFirstLetter";
import MenuCard from "./MenuCard";

const Header = ({ categories }: { categories: string[] }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  let genre = router.query.genre?.toString();

  const [open, setOpen] = useState<boolean>(false);

  const handleClick = (e: Event, item: string) => {
    let genre = item.toLowerCase();
    if (genre === "all") {
      router.push(`/`);
    } else {
      router.push(`/?genre=${genre}`);
    }

    setOpen(false);
  };
  return (
    <div className="w-full flex items-center justify-between px-[15px] py-[10px] h-[45px] mb-2">
      <p className="text-xl text-black dark:text-white font-[500] md:pl-4">
        {genre ? capitalizeFirstLetter(genre) : "All"}
      </p>

      <div
        ref={ref}
        className="relative flex items-center bg-white dark:bg-dark rounded-full overflow-hidden z-[10]"
      >
        <Popover
          isOpen={open}
          positions={["bottom", "left"]}
          padding={10}
          parentElement={ref.current!}
          boundaryElement={ref.current!}
          align="center"
          reposition={true}
          onClickOutside={() => setOpen(false)}
          content={<MenuCard sortList={categories} onClick={handleClick} />}
        >
          <div
            className={`flex items-center p-[3px] transitions-all ease duration-300 relative cursor-pointer `}
            onClick={() => setOpen(!open)}
          >
            <p
              className={`text-neutral-600 dark:text-neutral-300 m-[3px] mx-[8px] text-sm font-semibold ml-[10px]`}
            >
              Category
            </p>
            <div className="mx-2">
              {open ? (
                <ArrowUp2 size={20} className="text-black dark:text-white" />
              ) : (
                <ArrowDown2 size={20} className="text-black dark:text-white" />
              )}
            </div>
          </div>
        </Popover>
      </div>
    </div>
  );
};

export default Header;
