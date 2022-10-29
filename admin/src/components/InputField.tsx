import React, { forwardRef } from "react";
import { IoClose, IoSearch } from "react-icons/io5";
import clsx from 'clsx'
import NumberFormat from "react-number-format";

export interface InputFieldProps {
  [key: string]: any;
  action?: any;
  error?: boolean;
  actionRight?: any;
  clearInput?: () => void;
  isPrice?: boolean;
  IconLeft?: any;
  IconRight?: any;
  inputClassName?: HTMLInputElement["className"],
  className?: HTMLDivElement["className"],
  value?: any,
  type?: HTMLInputElement["type"],
  readOnly?: HTMLInputElement["readOnly"],
}


function InputField(props: InputFieldProps, ref?: any) {
  // --- Destructing Props --- //
  const {
    value = "",
    error,
    IconLeft = IoSearch,
    actionRight,
    type = "text",
    action,
    readOnly = false,
    inputClassName,
    IconRight = null,
    className,
    clearInput,
    isPrice = false,
    ...other
  } = props;

  return (
    <div
      className={clsx(
        "w-full rounded-lg flex items-center justify-center p-[5px] mt-[8px] mr-[8px] transition-all duration-300 ease hover:shadow-sm bg-slate-100 dark:bg-neutral-800",
        error ? "ring-red-500" : "",
        className
      )}
    >
      {!value &&
        (IconLeft === "disabled" ? null : (
          <IconLeft className="text-[18px] mr-[5px] text-[#212121] dark:text-white" />
        ))}


      {isPrice ? (
        <NumberFormat 
          thousandSeparator
          className={clsx("text-[1rem] bg-transparent dark:text-white/90 border-none outline-none w-[95%] text-black dark:text-white mr-auto autofill:bg-transparent ",inputClassName)}
          value={value}
          getInputRef={ref}
          readOnly={readOnly}
          {...other}
        />
      ) : (
        <input
          className={clsx("text-[1rem] bg-transparent dark:text-white/90 border-none outline-none w-[95%] text-black dark:text-white mr-auto autofill:bg-transparent ",inputClassName)}
          ref={ref}
          type={type}
          value={value}
          readOnly={readOnly}
          {...other}
        />

      )}


      {(value && typeof clearInput ==="function" && type !== "date" && !readOnly) && (
        <IoClose
          onClick={clearInput}
          className="text-[20px] px-[2px] text-[#212121] dark:text-neutral-300"
        />
      )}

      {IconRight && IconRight}
    </div>
  );
}

export default forwardRef(InputField);
