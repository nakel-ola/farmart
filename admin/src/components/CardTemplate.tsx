import clsx from "clsx";
import React from "react";
import Button from "./Button";

type Props = {
  title: string;
  showEditButton?: boolean;
  editTitle?: React.ReactNode;
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
    editTitle = "Edit",
  } = props;
  return (
    <div
      className={clsx(
        "w-[95%] md:w-[80%] rounded-lg dark:bg-dark dark:shadow-black/30 bg-white shadow-sm overflow-hidden",
        className
      )}
    >
      <div className="w-full border-b-[1px] border-b-slate-100 dark:border-b-neutral-800 flex items-center justify-between">
        <p className="py-[8px] pl-[15px] text-xl text-black font-medium dark:text-white">
          {title}
        </p>

        {showEditButton && (
          <>
            {typeof editTitle === "string" ? (
              <Button
                className={`text-green-600 bg-green-600/10 mr-2`}
                onClick={() => onEditClick?.()}
              >
                {editTitle ?? "Edit"}
              </Button>
            ) : (
              editTitle
            )}
          </>
        )}
      </div>

      {children}
    </div>
  );
};

export default CardTemplate;
