import clsx from "clsx";
import React, { forwardRef,InputHTMLAttributes,useState } from "react";
import { IoClose, IoSearch } from "react-icons/io5";
import { NumericFormat } from "react-number-format";

export interface InputFieldProps<T = any> extends InputHTMLAttributes<T> {
  [key: string]: any;
  action?: any;
  error?: boolean;
  actionRight?: any;
  clearInput?: () => void;
  isPrice?: boolean;
  IconLeft?: any;
  IconRight?: any;
  inputClassName?: HTMLInputElement["className"];
  className?: HTMLDivElement["className"];
  value?: any;
  type?: HTMLInputElement["type"];
  readOnly?: HTMLInputElement["readOnly"];
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

  const [focus, setFocus] = useState<boolean>(false);

  return (
    <div
      className={clsx(
        "w-full rounded-lg flex items-center justify-center p-[5px] mt-[8px] mr-[8px] transition-all duration-300 ease hover:shadow-sm bg-slate-100 dark:bg-neutral-800 ring-2 ring-offset-2",
        error ? "ring-red-500" : "",
        focus ? "ring-primary/30 ring-offset-primary/80" : "ring-transparent ring-offset-transparent",
        className
      )}
    >
      {!value &&
        (IconLeft === "disabled" ? null : (
          <IconLeft className="text-[18px] mr-[5px] text-[#212121] dark:text-white" />
        ))}

      {isPrice ? (
        <NumericFormat
          prefix="$"
          className={clsx(
            "text-[1rem] bg-transparent dark:text-white/90 border-none outline-none w-[95%] text-black dark:text-white mr-auto autofill:bg-transparent ",
            inputClassName
          )}
          value={Number(value).toFixed(2)}
          getInputRef={ref}
          readOnly={readOnly}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
      ) : (
        <input
          className={clsx(
            "text-[1rem] bg-transparent dark:text-white/90 border-none outline-none w-[95%] text-black dark:text-white mr-auto autofill:bg-transparent ",
            inputClassName
          )}
          ref={ref}
          type={type}
          value={value}
          readOnly={readOnly}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          {...other}
        />
      )}

      {value &&
        typeof clearInput === "function" &&
        type !== "date" &&
        !readOnly && (
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
