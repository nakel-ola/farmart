import clsx from "clsx";
import React from "react";

type Props = {
  title: string;
  showEditButton?: boolean;
  editTitle?: string;
  onEditClick?(): void;
  children: React.ReactNode;
  className?: string;
};
const CardTemplate = (props: Props) => {
  const {
    title,
    showEditButton = false,
    onEditClick,
    children,
    className,
    editTitle,
  } = props;
  return (
    <div
      className={clsx(
        "w-[95%] md:w-[80%] rounded-lg dark:bg-dark dark:shadow-black/30 bg-white shadow-sm overflow-hidden",
        className
      )}
    >
      <div className="w-full border-b-[1px] border-b-slate-100 dark:border-b-neutral-800 flex items-center justify-between">
        <p className="py-[8px] pl-[15px] text-[1.2rem] text-black font-medium dark:text-white">
          {title}
        </p>

        {showEditButton && (
          <button
            className={`px-3 mx-2 font-medium rounded-full py-[4px] text-green-600 bg-green-600/10 transition-all hover:scale-105 active:scale-95`}
            onClick={() => onEditClick?.()}
          >
            {editTitle ?? "Edit"}
          </button>
        )}
      </div>

      {children}
    </div>
  );
};

export default CardTemplate;
