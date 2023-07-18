import clsx from "clsx";
import React from "react";

type Props = {
  items: string[];
  topComponent?: React.ReactNode;
};

const TableHead = (props: Props) => {
  const { items, topComponent } = props;
  return (
    <div>
      {topComponent}
      <div
        className={clsx("grid gap-2 pl-5 pr-2 items-center py-3")}
        style={{
          gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
        }}
      >
        {items.map((value, index) => (
          <div key={index} className="col-span-1">
            <p className="text-start text-base font-medium">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableHead;
