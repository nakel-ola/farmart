import React, { forwardRef, RefAttributes, RefObject } from "react";

interface Props {
  children: React.ReactNode;
  footerComponent?: React.ReactNode;
  headerComponent?: React.ReactNode;
}

const Table = forwardRef(
  ({ children, footerComponent, headerComponent }: Props, ref: any) => {
    return (
      <div
        ref={ref}
        className="bg-white dark:bg-dark rounded-lg overflow-auto shadow-sm my-8 flex flex-col w-full"
      >
        {headerComponent}
        <table className="w-full">{children}</table>
        {footerComponent}
      </div>
    );
  }
);

Table.displayName = "Table";

export default Table;
