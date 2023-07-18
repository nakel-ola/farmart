import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  className?: string;
  onClick?(): void;
  items: {
    name: string | number;
    onClick?(): void;
    classes?: {
      root?: string;
      text?: string;
    };
  }[];
};

const TableRow = (props: Props) => {
  const { items, className, onClick } = props;
  return (
    <div
      className={twMerge(className, "grid gap-2 pl-5 pr-2 items-center py-3")}
      style={{
        gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
      }}
      onClick={onClick}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={twMerge("col-span-1", item?.classes?.root)}
          onClick={item.onClick}
        >
          <p className={twMerge("text-start text-sm", item?.classes?.text)}>
            {item.name}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TableRow;
