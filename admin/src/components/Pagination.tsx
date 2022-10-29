import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import React from "react";
import usePagination, { UsePaginationItem } from "../hooks/usePagination";
import useStateEffect from "../hooks/useStateEffect";

type Props = {
  pageCount: number;
  forcePage: number;
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

  return (
    <div className="bg-white dark:bg-dark w-full mb-[2px] rounded-lg shadow-sm flex">
      <div className="ml-auto flex items-center my-2 mx-2">
        <div
          className="bg-slate-100 dark:bg-neutral-800 p-[3px] rounded-full flex items-center justify-center"
          onClick={previous.onClick}
        >
          <ArrowLeft2
            size={25}
            className="text-neutral-700 dark:text-neutral-400"
          />
        </div>

        <div className="flex items-center w-fit bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden mx-[5px]">
          {renderPages()}
        </div>

        <div
          className="bg-slate-100 dark:bg-neutral-800 p-[3px] rounded-full flex items-center justify-center"
          onClick={next.onClick}
        >
          <ArrowRight2
            size={25}
            className="text-neutral-700 dark:text-neutral-400"
          />
        </div>
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
      <div
        className={`flex items-center p-[3px] transitions-all ease duration-300 ${
          selected && "bg-slate-200 dark:bg-slate-100/20"
        } cursor-pointer `}
        onClick={onClick}
      >
        <p
          className={`${
            selected
              ? "text-black dark:text-white"
              : "text-neutral-700 dark:text-neutral-400"
          } m-[3px] mx-[8px] text-sm font-semibold`}
        >
          {page}
        </p>
      </div>
      {!lastIndex && (
        <hr className="bg-slate-200 border-0 dark:bg-neutral-800 h-8 w-[.3px]" />
      )}
    </div>
  );
};

export default Pagination;
