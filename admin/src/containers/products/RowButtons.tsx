import { useRouter } from "next/router";

function RowButtons({ toggle, items }: { toggle?: boolean; items: any[] }) {
  const router = useRouter();

  const genre = router.query.genre;

  const capitalizeFirstLetter = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const newItems = [{ name: "ALl" }, ...items];

  return (
    <div
      className="w-full sticky top-[0px] z-20 bg-white
      dark:bg-dark flex items-center justify-center lg:hidden"
    >
      <div className="flex w-[98%] md:w-fit overflow-x-scroll py-[15px] scrollbar">
        {newItems.map((item: { name: string }, index: number) => (
          <button
            key={index}
            onClick={() => router.push(index === 0 ? "/products" : `/products?genre=${item.name.toLowerCase()}`)}
            className={`flex justify-center pb-[4px] px-[10px] m-[5px] items-center rounded-lg hover:scale-110 transition-all duration-300 ease cursor-pointer whitespace-nowrap text-[1rem] ${
              "/products" === router.pathname && !item.name.toLowerCase()
                ? "bg-primary text-white"
                : "ring-slate-100 ring-[0.5px] dark:ring-neutral-800 text-neutral-700 dark:text-neutral-400"
            }`}
          >
            {item.name}
          </button>
        ))}

        {/* {newItems.map((item, index) =>
          index === 0 ? (
            <button
              key={index}
              onClick={() => router.push(`/products`)}
              className={`flex justify-center pb-[4px] px-[10px] m-[5px] items-center rounded-lg hover:scale-110 transition-all duration-300 ease cursor-pointer whitespace-nowrap text-[1rem] ${
                "/products" === router.pathname && !genre
                  ? "bg-primary text-white"
                  : "ring-slate-100 ring-[0.5px] dark:ring-neutral-800 text-neutral-700 dark:text-neutral-400"
              }`}
            >
              {capitalizeFirstLetter(item.title)}
            </button>
          ) : (
            <button
              key={index}
              onClick={() =>
                router.push(`/products?genre=${item.title.toLowerCase()}`)
              }
              className={`flex justify-center pb-[4px] px-[10px] m-[5px] rounded-lg cursor-pointer hover:scale-110 transition-all duration-300 ease ${
                genre === item.genre
                  ? "bg-primary text-white"
                  : "ring-slate-100 ring-[0.5px] dark:ring-neutral-800 text-neutral-700 dark:text-neutral-400"
              }`}
            >
              {capitalizeFirstLetter(item.title)}
            </button>
          )
        )} */}
      </div>
    </div>
  );
}

export default RowButtons;
