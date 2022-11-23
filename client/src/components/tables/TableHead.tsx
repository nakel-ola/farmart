import clsx from "clsx";
import React from "react";

interface TableList {
  title: string;
  style?: React.CSSProperties;
  className?: string;
}

interface TableHeadProps {
  tableList: TableList[];
  disableDivider?: boolean;
}
const TableHead = (props: TableHeadProps) => {
  const { tableList, disableDivider = false } = props;

  return (
    <thead
      className={clsx(
        "w-full border-b-4 ",
        disableDivider
          ? "border-transparent"
          : "border-slate-100 dark:border-neutral-800"
      )}
    >
      <tr className="">
        
      </tr>
      <tr className="w-full">
        {tableList.map((list: TableList, index: number) => (
          <th
            key={list.title + index}
            style={list.style}
            className={clsx(
              "p-3 text-sm font-semibold tracking-wide text-left w-32",
              list.className
            )}
          >
            <p className="text-base font-medium text-black dark:text-white whitespace-nowrap">
              {list.title}
            </p>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHead;
