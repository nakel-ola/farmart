import React, { ReactNode } from "react";

const TableList = ({ children }: { children: ReactNode}) => {
  return (
    <div className="md:grid md:place-items-center pt-2 w-full shrink-0 overflow-visible">
      <div className=" md:w-full bg-white dark:bg-dark rounded-lg shadow-sm even:[&_div]:bg-slate-200/10 even:[&_div]:dark:bg-neutral-900/30 overflow-hidden mb-2">
        {children}
      </div>
    </div>
  );
};

export default TableList;
