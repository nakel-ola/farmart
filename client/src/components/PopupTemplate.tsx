import clsx from "clsx";
import { ReactNode, useRef } from "react";
import useOnClickOutside from "../hooks/useOnClickOutside";

type PopupTemplateProps = {
  title: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
  showEditButton?: boolean;
  buttonText?: ReactNode;
  position?: "left" | "right" | "center" | "top" | "bottom";
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
    containerClassName,
    position = "center",
  } = props;
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => onOutsideClick?.());
  return (
    <div className="fixed top-0 w-full h-full bg-black/50 grid place-items-center z-10">
      <div
        ref={ref}
        className={clsx(
          "w-[90%] md:w-[350px] bg-white dark:bg-dark rounded-lg shadow overflow-hidden",
          position === "center" ? "" : "",
          position === "left" ? "md:mr-auto mx-auto md:mx-0 md:ml-8" : "",
          position === "right" ? "mx-auto md:mx-0 md:ml-auto md:mr-8" : "",
          position === "top" ? "my-auto md:my-0 md:mb-auto md:mt-8" : "",
          position === "bottom" ? "my-auto md:my-0 md:mt-auto md:mb-8" : "",
          containerClassName
        )}
      >
        <div className="w-full flex items-center justify-between px-[15px] py-[10px] border-b-[1px] border-b-slate-100 dark:border-b-neutral-800 h-[45px]">
          <p className="text-xl text-black dark:text-white font-[500]">
            {title}
          </p>

          {showEditButton &&
            (typeof buttonText === "string" ? (
              <button
                className={`px-3 font-medium rounded-full py-[4px] text-green-600 bg-green-600/10 transition-all hover:scale-105 active:scale-95`}
                onClick={() => onEditClick?.()}
              >
                {buttonText}
              </button>
            ) : (
              buttonText
            ))}
        </div>
        <div
          className={clsx(
            "overflow-hidden max-h-[calc(90vh-45px)] pb-2",
            className
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default PopupTemplate;
