import React, { forwardRef } from "react";
import { IoChevronDown, IoChevronUp, IoSearch } from "react-icons/io5";

interface Props {
  value: string;
  error: boolean;
  toggle: boolean;
  onClick: () => void;
  placeholder: string;
}

function PopupField(props: Props, ref: any) {
  // --- Destructing Props --- //
  const {
    value = "",
    toggle = false,
    placeholder = "",
    error,
    onClick = () => {},
  } = props;

  return (
    <div className="w-[85%] rounded-lg flex items-center justify-center p-[5px] mt-[10px] bg-slate-100 dark:bg-neutral-800 hover:shadow-md transition-all duration-300 ease ">
      {!value && (
        <IoSearch className="text-[20px] text-[#212121] dark:text-white" />
      )}

      <input
        ref={ref}
        onClick={onClick}
        value={value}
        className="text=[1rem] bg-transparent border-none outline-none w-[95%] dark:text-white text-slate-800 p-[2px]"
        placeholder={placeholder}
        readOnly={true}
      />

      {toggle ? (
        <IoChevronUp className="text-[20px] text-[#212121] dark:text-white" />
      ) : (
        <IoChevronDown className="text-[20px] text-[#212121] dark:text-white" />
      )}
    </div>
  );
}

export default forwardRef(PopupField);
