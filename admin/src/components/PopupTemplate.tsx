import { ReactNode, useRef } from "react";
import useOnClickOutside from "../hooks/useOnClickOutside";

type PopupTemplateProps = {
  title: string;
  children: ReactNode;
  showEditButton?: boolean;
  buttonText?: ReactNode;
  onOutsideClick?: () => void;
  onEditClick?: (value?: any) => void;
};

const PopupTemplate = (props: PopupTemplateProps) => {
  const {
    title,
    children,
    showEditButton = false,
    onEditClick,
    buttonText,
    onOutsideClick,
  } = props;
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => onOutsideClick?.());
  return (
    <div className="fixed top-0 w-full h-full bg-black/70 grid place-items-center z-10">
      <div
        ref={ref}
        className="w-[350px] bg-white dark:bg-dark rounded-lg pb-2 shadow transition-all duration-300"
      >
        <div className="w-full h-[45px] flex items-center justify-between px-[15px] py-[10px] border-b-[1px] border-b-slate-100 dark:border-b-neutral-800">
          <p className="text-lg text-black dark:text-white font-[500]">
            {title}
          </p>

          {showEditButton && (
            <>
              {buttonText === "string" ? (
                <button
                  className={`px-3 font-medium rounded-full py-[4px] text-green-600 bg-green-600/10 transition-all hover:scale-105 active:scale-95`}
                  onClick={() => onEditClick?.()}
                >
                  {buttonText}
                </button>
              ) : (
                buttonText
              )}
            </>
          )}
        </div>

        {children}
      </div>
    </div>
  );
};

export default PopupTemplate;
