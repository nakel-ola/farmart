import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 w-full h-full bg-black/70 grid place-items-center z-10"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.12 }}
        ref={ref}
        className="w-[350px] bg-white dark:bg-dark rounded-lg pb-2 shadow transition-all duration-300 max-h-[85%] overflow-y-auto"
      >
        <div className="sticky top-0 w-full h-[45px] bg-white dark:bg-dark z-10 flex items-center justify-between px-[15px] py-[10px] border-b-[1px] border-b-slate-100 dark:border-b-neutral-800">
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
      </motion.div>
    </motion.div>
  );
};

export default PopupTemplate;
