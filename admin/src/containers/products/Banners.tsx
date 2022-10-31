/* eslint-disable @next/next/no-img-element */
import { Add, ArrowLeft2, ArrowRight2, Trash } from "iconsax-react";
import { useRouter } from "next/router";
import React, { useRef,useState,useEffect } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { BannerType } from "../../../typing";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import { add } from "../../redux/features/dialogSlice";


const Banners = ({ data,canEdit }: { data: BannerType[]; canEdit: boolean }) => {
  const dispatch = useDispatch();
  const [active, setActive] = useState<number>(0);
  const [items, setItems] = useState<BannerType[]>(data);


  const handleBack = () => {
    setActive(active === 0 ? items.length - 1 : active - 1);
  };
  const handleForward = () => {
    setActive(active === items.length - 1 ? 0 : active + 1);
  };


  return (
    <div className="relative flex flex-col items-center justify-center rounded-lg overflow-hidden bg-white dark:bg-dark dark:lg:bg-transparent lg:bg-transparent">
      <div className="flex w-[100%] items-center rounded-lg overflow-x-scroll pb-[20px] scrollbar-hide relative">
        {items.map((item: BannerType, i: number) => (
          <ImageCard
            key={i}
            i={i}
            {...item}
            setActive={setActive}
            active={active}
          />
        ))}
        <AddCard />
      </div>
      {active !== 0 && (
        <div
          className="absolute hidden md:inline top-[50%] left-0 translate-y-[-50%] p-[5px] hover:scale-110 transition-transform duration-300 ease hover:bg-slate-50/5 rounded-full"
          onClick={handleBack}
        >
          <ArrowLeft2 size={48} className="text-white drop-shadow-xl" />
        </div>
      )}
      {active !== items.length - 1 && (
        <div
          className="absolute hidden md:inline top-[50%] right-2 rounded-full translate-y-[-50%] p-[5px] hover:scale-110 hover:bg-slate-50/5 transition-transform duration-300 ease"
          onClick={handleForward}
        >
          <ArrowRight2 size={48} className="text-white drop-shadow-xl" />
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
  );
};

const AddCard = () => {
  const dispatch = useDispatch();

  return (
    <div
      className="flex items-center justify-center flex-col m-2 mr-4 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 shrink-0"
      onClick={() =>
        dispatch(add({ type: "banner", product: null, open: true }))
      }
    >
      <div className="h-[50px] w-[50px] rounded-full flex items-center justify-center shadow-sm bg-slate-200 dark:bg-neutral-700 mt-2">
        <Add size={50} variant="Outline" />
      </div>
      <p className="font-medium">Create banners</p>
    </div>
  );
};

interface ImageCardProps extends BannerType {
  i: number;
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
}

const ImageCard = (props: ImageCardProps) => {
  const { image, i, active, description, title,link,setActive } = props;

  const ref = useRef<HTMLDivElement>(null);

  const router = useRouter();
  
  const entry = useIntersectionObserver(ref, { threshold: 1});

  const isVisible = !!entry?.isIntersecting;

  useEffect(() => {
    if (i === active) {
      ref?.current?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "center",
      });
    }
  }, [i, active]);

  useEffect(() => {
    if(isVisible) {
      setActive(i)
    }
  },[isVisible,setActive,i])


  return (
    <div
      ref={ref}
      className="relative md:w-[70%] rounded-lg shrink-0 md:hover:scale-105 overflow-hidden m-[5px] md:m-[10px] transition-transform duration-300 ease "
    >
      <img
        src={image}
        alt=""
        className="relative md:h-[280px] w-[300px] h-[150px] md:w-full object-cover"
      />

      <article className="absolute top-0 w-full h-full bg-gradient-to-r from-black/30  to-black/10 flex flex-col justify-evenly p-5">
        <div className="w-[100%] md:w-[50%]">
          <h1 className="text-white text-xl md:text-3xl font-bold">{title}</h1>
          <p className="text-white my-1 md:my-2 text-sm md:text-base">
            {description}
          </p>
        </div>

        <button className="w-fit bg-white px-2 py-1 rounded-lg hover:scale-105 active:scale-95 font-medium">
          Shop Now
        </button>
      </article>
    </div>
  );
};

export default Banners;