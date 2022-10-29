import React, { MouseEvent, useState } from "react";

type Props = {
  tableList: string[];
  sortList: string[];
  onClick?: (event: MouseEvent<HTMLDivElement>, selected: string) => void;
};

const OrderHeader = ({ sortList, tableList, onClick }: Props) => {
  const [active, setActive] = useState<string>(sortList[0]);

  const handleClick = (e:  MouseEvent<HTMLDivElement>,selected: string) => {
    setActive(selected)
    onClick?.(e, selected);
  };
  return (
    <div className="w-[95%] grid place-items-center bg-white dark:bg-dark rounded-lg shadow-sm">
      <div className="py-[5px] w-full mr-auto flex items-center justify-between">
        <p className="text-[1.5rem] ml-[10px] font-[600] text-black dark:text-white">
          Order History
        </p>

        <div className="flex items-center my-auto bg-slate-100 dark:bg-slate-100/10 rounded-full overflow-hidden mr-[10px]">
          {sortList.map((item: string, index: number) => (
            <div key={index} className="flex">
              <div
                className={`flex items-center p-[3px] transitions-all ease duration-300 ${
                  active === item && "bg-slate-200 dark:bg-slate-100/20"
                } cursor-pointer `}
                onClick={(e) => handleClick(e,item)}
              >
                <p
                  className={`${
                    active === item
                      ? "text-black dark:text-white"
                      : "text-neutral-600 dark:text-neutral-200"
                  } m-[3px] mx-[8px] text-sm font-semibold`}
                >
                  {item}
                </p>
              </div>
              {index !== sortList.length - 1 && (
                <hr className="bg-slate-200 border-0 dark:bg-neutral-800 h-8 w-[.3px]" />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="w-[100%] flex items-center justify-around ">
        {tableList.map((item: string, index: number) => (
          <div key={index} className="m-[8px] flex-1 flex items-start pl-2">
            <p className="text-base font-medium text-black dark:text-white whitespace-nowrap">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHeader;
