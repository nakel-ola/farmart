import { useRouter } from "next/router";
import React from "react";

function CategoryTab(props: { items: any[] }) {
  const { items } = props;

  const router = useRouter();

  const genre = router.query.genre;

  const sortList = ["All", ...items.map((item: { name: string }) => item.name)];

  const capitalizeFirstLetter = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1);
  return (
    <div className="hidden lg:inline ">
      <div className="flex overflow-x-scroll scrollbar">
        {sortList.map((item, index) => (
          <div
            key={index}
            onClick={() =>
              router.push(index === 0 ? `/` : `/?genre=${item.toLowerCase()}`)
            }
            className={`flex justify-center pb-[4px] px-[10px] m-[5px] items-center rounded-lg flex-1 hover:scale-110 transition-all duration-300 ease cursor-pointer ${
              ((index === 0 && "/" === router.pathname && !genre) || ("/" === router.pathname && genre === item.toLowerCase()))
                ? "bg-primary"
                : "ring-[0.5px] ring-slate-100 dark:ring-neutral-800"
            }`}
          >
            <p
              className={`whitespace-nowrap text-[1rem]  ${
                ((index === 0 && "/" === router.pathname && !genre) || ("/" === router.pathname && genre === item.toLowerCase()))
                  ? "text-white"
                  : "text-slate-800 dark:text-white/90"
              } `}
            >
              {capitalizeFirstLetter(item)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryTab;
