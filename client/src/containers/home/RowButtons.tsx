import { useRouter } from "next/router";

function RowButtons({ toggle, items }: { toggle?: boolean; items: any[] }) {
  const router = useRouter();

  const genre = router.query.genre;

  const sortList = ["All", ...items.map((item: { name: string }) => item.name)];

  const capitalizeFirstLetter = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  return (
    <div
      className="w-full sticky top-[0px] z-10 bg-white
        dark:bg-dark flex items-center justify-center lg:hidden"
    >
      <div className="flex w-[98%] overflow-x-scroll py-[15px] scrollbar">
        {sortList.map((item, index) => (
          <div
            key={index}
            onClick={() =>
              router.push(index === 0 ? `/` : `/?genre=${item.toLowerCase()}`)
            }
            className={`flex justify-center pb-[4px] px-[10px] m-[5px] items-center rounded-lg flex-1 hover:scale-110 transition-all duration-300 ease cursor-pointer ${
              (index === 0 && "/" === router.pathname && !genre) ||
              ("/" === router.pathname && genre === item.toLowerCase())
                ? "bg-primary"
                : "ring-slate-100 ring-[0.5px] dark:ring-slate-100/20"
            }`}
          >
            <p
              className={`whitespace-nowrap text-[1rem]  ${
                (index === 0 && "/" === router.pathname && !genre) ||
                ("/" === router.pathname && genre === item.toLowerCase())
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

export default RowButtons;
