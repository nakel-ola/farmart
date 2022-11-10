import clsx from "clsx";
import React from "react";

const TableContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <td
      className={clsx(
        "p-3 text-sm text-white whitespace-nowrap shrink-0",
        className
      )}
    >
      {children}
    </td>
  );
};

export default TableContent;
