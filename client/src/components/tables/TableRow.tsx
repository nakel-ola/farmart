import clsx from "clsx";
import React from "react";

const TableRow = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: any) => void;
}) => {
  return (
    <tr
      className={clsx(
        "bg-white dark:bg-dark ",
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

export default TableRow;
