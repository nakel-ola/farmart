import clsx from "clsx";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import React from "react";
import usePagination, { UsePaginationItem } from "../hooks/usePagination";
import useStateEffect from "../hooks/useStateEffect";

type Props = {
  pageCount: number;
  forcePage: number;
  width?: string;
  pageRangeDisplayed: number;
  breakLabel: string;
  onPageChange?(event: React.ChangeEvent<unknown>, page: number): void;
};

type NumberCardProps = {
  selected: boolean;
  lastIndex: boolean;
  page: number | string;
  onClick: React.ReactEventHandler;
};

const Pagination = ({
  pageCount,
  forcePage,
  breakLabel,
  onPageChange,
  width,
}: Props) => {
  const [page, setPage] = useStateEffect<number>(forcePage ?? 1, [forcePage]);

  const { pages, previous, next } = usePagination({
    count: pageCount,
    page,
    componentName: "paginate",
    onChange: (event, index) => {
      setPage(index);
      onPageChange?.(event, index);
    },
  });

  const renderPages = () => {
    return pages.map((item: UsePaginationItem, index: number) => {
      if (item.type === "start-ellipsis" || item.type === "end-ellipsis") {
        return (
          <NumberCard
            key={index}
            selected={item.selected}
            lastIndex={index === pages.length - 1}
            onClick={item.onClick}
            page={breakLabel}
          />
        );
      } else {
        return (
          <NumberCard
            key={index}
            selected={item.selected}
            lastIndex={index === pages.length - 1}
            onClick={item.onClick}
            page={item.page}
          />
        );
      }
    });
  };

  console.log(next.page)

  return (
    <div
      className={clsx(
        "bg-white dark:bg-dark flex shrink-0 overflow-hidden md:w-full",
        width
      )}
    >
      <div className="ml-auto flex items-center my-2 mx-2">
        <button
          disabled={previous.page === 0}
          className="bg-slate-100 dark:bg-neutral-800 h-[35px] w-[35px] rounded-full flex items-center justify-center disabled:scale-100 hover:scale-105 active:scale-95"
          onClick={previous.onClick}
        >
          <ArrowLeft2
            size={25}
            className="text-neutral-700 dark:text-neutral-400"
          />
        </button>

        <div className="flex items-center w-fit bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden mx-[5px]">
          {renderPages()}
        </div>

        <button
          disabled={next.page === pages.length + 1}
          className="bg-slate-100 dark:bg-neutral-800 h-[35px] w-[35px] rounded-full flex items-center justify-center disabled:scale-100 hover:scale-105 active:scale-95"
          onClick={next.onClick}
        >
          <ArrowRight2
            size={25}
            className="text-neutral-700 dark:text-neutral-400"
          />
        </button>
      </div>
    </div>
  );
};

const NumberCard = ({
  selected,
  lastIndex,
  onClick,
  page,
}: NumberCardProps) => {
  return (
    <div className="flex">
      <button
        className={clsx(
          "text-center transitions-all ease duration-300 h-[35px] w-[35px] text-base font-semibold",
          selected
            ? "bg-slate-200 dark:bg-slate-100/20 text-black dark:text-white"
            : "text-neutral-700 dark:text-neutral-400"
        )}
        onClick={onClick}
      >
        {page}
      </button>
      {!lastIndex && (
        <hr className="bg-slate-200 border-0 dark:bg-neutral-800 h-8 w-[.3px]" />
      )}
    </div>
  );
};

export default Pagination;
