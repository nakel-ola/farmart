import clsx from "clsx";
import React from "react";

interface TableBodyProps {
  children: React.ReactNode;
  disableDivider?: boolean;
  className?: string;
}

const TableBody = ({ children,className, disableDivider = false }: TableBodyProps) => {
  return (
    <tbody
      className={clsx(
        "w-full divide-y divide-slate-100 dark:divide-neutral-800 even:[&_tr]:bg-slate-200/40 even:[&_tr]:dark:bg-neutral-900/30 border-b-4 ",
        disableDivider
          ? "border-transparent"
          : "border-slate-100 dark:border-neutral-800",
          className
      )}
    >
      {children}
    </tbody>
  );
};

export default TableBody;
