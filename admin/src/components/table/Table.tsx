import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  classes?: {
    root?: string;
    inner?: string;
  };
};

const Table = forwardRef<HTMLDivElement, React.PropsWithChildren<Props>>(
  (props, ref) => {
    const { children, classes } = props;
    return (
      <div
        ref={ref}
        className={twMerge(
          "w-full overflow-x-scroll bg-white dark:bg-dark rounded-lg  shadow-sm my-5",
          classes?.root
        )}
      >
        <div
          className={twMerge(
            "bg-white shrink-0 w-[1000px] lg:w-full",
            classes?.inner
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);

Table.displayName = "Table";

export default Table;
