import React, { ReactNode } from "react";
import clsx from "clsx"

function TableContent({ children, className,...others }: { children: ReactNode,className?: string; [key: string]: any}) {
  return (
    <span className={clsx("m-[8px] w-[150px] md:w-[120px] md:flex-1 flex items-start justify-start overflow-hidden pl-2 shrink-0", className)} {...others}>
      {children}
    </span>
  );
}

export default TableContent;
