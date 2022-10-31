import clsx from "clsx";
import { ReactNode, useRef } from "react";
import useOnClickOutside from "../hooks/useOnClickOutside";

type PopupTemplateProps = {
  title: string;
  className?: string;
  children: ReactNode;
  showEditButton?: boolean;
  buttonText?: string;
  onOutsideClick?: () => void;
  onEditClick?: (value?: any) => void;
};

const PopupTemplate = (props: PopupTemplateProps) => {
  const {
    title,
    className,
    children,
    showEditButton = false,
    onEditClick,
    buttonText,
    onOutsideClick,
  } = props;
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => onOutsideClick?.());
  return (
    <div className={clsx("fixed top-0 w-full h-full bg-black/70 grid place-items-center z-10", className)}>
      <div
        ref={ref}
        className="w-[350px] max-w-fit max-h-[90vh] overflow-y-scroll bg-white dark:bg-dark rounded-lg pb-2 shadow"
      >
        <div className="w-full flex items-center justify-between px-[15px] py-[10px] border-b-[1px] border-b-slate-100 dark:border-b-neutral-800">
          <p className="text-[1rem] text-black dark:text-white font-[500]">
            {title}
          </p>

          {showEditButton && (
            <button
              className={`px-3 mx-2 font-medium rounded-full py-[4px] text-green-600 bg-green-600/10 transition-all hover:scale-105 active:scale-95`}
              onClick={() => onEditClick?.()}
            >
              {buttonText}
            </button>
          )}
        </div>

        {children}
      </div>
    </div>
  );
};

export default PopupTemplate;
