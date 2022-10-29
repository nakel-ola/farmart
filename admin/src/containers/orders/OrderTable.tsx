import React from "react";

type Props = {
  tableList: string[];
};

const OrderTable = ({ tableList }: Props) => {
  return (
    <div className="w-[100%] flex items-center justify-around ">
      {tableList.map((item: string, index: number) => (
        <div key={index} className="m-[8px] flex-1 flex items-start pl-2">
          <p className="text-base font-medium text-black dark:text-white whitespace-nowrap">
            {item}
          </p>
        </div>
      ))}
    </div>
  );
};

export default OrderTable;
