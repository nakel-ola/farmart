import { gql, useLazyQuery, useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const BannerQuery = gql`
  query Banners {
    banners {
      image
    }
  }
`;

function Banners() {
  const [active, setActive] = useState<number>(0);
  const [items, setItems] = useState<{ image: string }[]>([]);

  useQuery(BannerQuery, {
    onCompleted: (data) => setItems(data.banners),
    onError: (error) => console.error(error),
  });

  const handleBack = () => {
    setActive(active === 0 ? items.length - 1 : active - 1);
  };
  const handleForward = () => {
    setActive(active === items.length - 1 ? 0 : active + 1);
  };

  return items.length > 0 ? (
    <div className="relative flex flex-col items-center justify-center rounded-lg overflow-hidden bg-white dark:bg-dark dark:lg:bg-transparent lg:bg-transparent">
      <div className="flex w-[100%] items-center rounded-lg overflow-x-scroll pb-[20px] scrollbar relative">
        {items.map((item, i) => (
          <Image
            key={i}
            i={i}
            {...item}
            setActive={setActive}
            active={active}
          />
        ))}
      </div>
      {active !== 0 && (
        <div
          className="absolute hidden md:inline top-[50%] left-0 translate-y-[-50%] p-[5px] hover:scale-110 transition-transform duration-300 ease hover:bg-slate-50/5 rounded-full"
          onClick={handleBack}
        >
          <IoChevronBack className="text-5xl text-white drop-shadow-xl" />
        </div>
      )}
      {active !== items.length - 1 && (
        <div
          className="absolute hidden md:inline top-[50%] right-2 rounded-full translate-y-[-50%] p-[5px] hover:scale-110 hover:bg-slate-50/5 transition-transform duration-300 ease"
          onClick={handleForward}
        >
          <IoChevronForward className="text-5xl text-white drop-shadow-xl" />
        </div>
      )}

      <div className="flex items-center justify-evenly">
        {items.map((_, index) => (
          <div
            className={`m-[5px] transition-transform duration-1000 ease rounded-full w-[5px] h-[5px] ${
              active === index
                ? "scale-150 bg-black dark:bg-white"
                : " bg-black/50 dark:bg-white/50"
            }`}
            key={index}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </div>
  ) : null;
}

interface HtmlDivElement {
  current: HTMLDivElement;
}

const Image = (props: any) => {
  const { image, i, active } = props;

  const ref = useRef() as HtmlDivElement;

  useEffect(() => {
    if (i === active) {
      ref?.current?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "center",
      });
    }
  }, [i, active]);

  return (
    <div
      ref={ref}
      className="md:w-[70%] rounded-lg shrink-0 md:hover:scale-105 overflow-hidden m-[5px] md:m-[10px] transition-transform duration-300 ease "
    >
      <img
        src={image}
        alt=""
        className="md:h-[320px] w-[300px] h-[150px] md:w-full object-cover"
      />
    </div>
  );
};
export default Banners;
