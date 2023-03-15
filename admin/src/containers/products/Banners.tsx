/* eslint-disable @next/next/no-img-element */
import { gql, useMutation } from "@apollo/client";
import { AnimatePresence } from "framer-motion";
import { Add, ArrowLeft2, ArrowRight2 } from "iconsax-react";
import React, { useEffect, useRef, useState } from "react";
import { BannerType } from "../../../typing";
import DeleteCard from "../../components/DeleteCard";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import BannerCard from "./BannerCard";

interface Props {
  refetch(): void;
  data: BannerType[];
  canEdit: boolean;
}
const Banners: React.FC<Props> = (props) => {
  const { data, canEdit, refetch } = props;
  const [active, setActive] = useState<number>(0);
  const [toggle, setToggle] = useState<BannerType | boolean>(false);

  const handleBack = () =>
    setActive(active === 0 ? data.length - 1 : active - 1);

  const handleForward = () =>
    setActive(active === data.length - 1 ? 0 : active + 1);

  return (
    <>
      <div className="relative flex flex-col items-center justify-center rounded-lg overflow-hidden mt-4 w-full">
        <div className="shrink-0 flex w-full items-center rounded-lg overflow-x-scroll pb-[20px] scrollbar-hide relative md:pl-0">
          {data.map((item: BannerType, i: number) => (
            <ImageCard
              key={i}
              i={i}
              {...item}
              setActive={setActive}
              active={active}
              canEdit={canEdit}
              refetch={refetch}
              onEdit={() => setToggle(item)}
            />
          ))}
          {canEdit && <AddCard onClick={() => setToggle(true)} />}
        </div>

        {active !== 0 && (
          <div
            className="absolute hidden md:inline top-[45%] left-0 translate-y-[-45%] p-[5px] hover:scale-110 transition-transform duration-300 ease hover:bg-slate-50/5 rounded-full"
            onClick={handleBack}
          >
            <ArrowLeft2 size={48} className="text-white drop-shadow-xl" />
          </div>
        )}
        {active !== data.length - 1 && (
          <div
            className="absolute hidden md:inline top-[45%] right-2 rounded-full translate-y-[-45%] p-[5px] hover:scale-110 hover:bg-slate-50/5 transition-transform duration-300 ease"
            onClick={handleForward}
          >
            <ArrowRight2 size={48} className="text-white drop-shadow-xl" />
          </div>
        )}

        {data.length > 1 && (
          <div className="flex items-center justify-evenly">
            {data.map((_, index) => (
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
        )}
      </div>

      <AnimatePresence>
        {toggle && (
          <BannerCard
            func={refetch}
            onClose={() => setToggle(false)}
            data={typeof toggle !== "boolean" ? toggle : undefined}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const AddCard = ({ onClick }: { onClick(): void }) => {
  return (
    <div
      className="group relative w-[50%] md:w-[20%] rounded-lg shrink-0 overflow-hidden m-[5px] mr-10 md:m-[10px] transition-transform duration-300 ease cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center flex-col justify-center group-hover:scale-105 group-active:scale-95">
        <div className="h-[50px] w-[50px] rounded-full flex items-center justify-center shadow-sm bg-slate-200 dark:bg-neutral-700 mt-2">
          <Add size={50} variant="Outline" />
        </div>
        <p className="font-medium whitespace-nowrap">Create banners</p>
      </div>
    </div>
  );
};

interface ImageCardProps extends BannerType {
  i: number;
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  canEdit: boolean;
  refetch(): void;
  onEdit(): void;
}

const DeleteBanner = gql`
  mutation DeleteBanner($id: ID!) {
    deleteBanner(id: $id) {
      message
    }
  }
`;

const ImageCard = (props: ImageCardProps) => {
  const {
    image,
    i,
    active,
    description,
    title,
    link,
    setActive,
    id,
    canEdit,
    refetch,
    onEdit,
  } = props;

  const ref = useRef<HTMLDivElement>(null);

  const entry = useIntersectionObserver(ref, { threshold: 1 });

  const isVisible = !!entry?.isIntersecting;

  const [toggle, setToggle] = useState(false);

  const onClose = () => setToggle(false);

  const [deleteBanner, { loading }] = useMutation(DeleteBanner, {
    onCompleted: () => {
      refetch();
      onClose();
    },
    onError: (err) => console.table(err),
  });

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
    if (isVisible) setActive(i);
  }, [isVisible, setActive, i]);

  return (
    <>
      <div
        ref={ref}
        className="relative md:w-[70%] rounded-lg shrink-0 overflow-hidden m-[5px] md:m-[10px] transition-transform duration-300 ease"
      >
        <img
          src={image}
          alt=""
          className="relative md:h-[280px] w-[300px] h-[150px] md:w-full object-cover"
        />

        <article className="absolute top-0 w-full h-full bg-gradient-to-r from-black/30  to-black/10 flex flex-col justify-evenly p-5">
          <div className="w-[100%] md:w-[50%]">
            <h1 className="text-white text-xl md:text-3xl font-bold">
              {title}
            </h1>
            <p className="text-white my-1 md:my-2 text-sm md:text-base">
              {description}
            </p>
          </div>

          {canEdit && (
            <div className="flex">
              <button
                className="w-fit bg-white text-black px-2  py-1 rounded-lg hover:scale-105 active:scale-95 font-medium"
                onClick={onEdit}
              >
                Edit
              </button>
              <button
                className="w-fit bg-red-600 text-white px-2 mx-2 py-1 rounded-lg hover:scale-105 active:scale-95 font-medium"
                onClick={() => setToggle(true)}
              >
                Delete
              </button>
            </div>
          )}
        </article>
      </div>

      <AnimatePresence>
        {toggle && (
          <DeleteCard
            loading={loading}
            message="Are you sure you want to delete this banner ?"
            onClose={onClose}
            onDelete={() => deleteBanner({ variables: { id } })}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Banners;
