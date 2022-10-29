/* importing required files and packages */
import { forwardRef } from "react";
import { IoCloseOutline, IoSearchOutline } from "react-icons/io5";

const InputField = (props: any, ref: any) => {
  // --- Destructing pros --- //

  const {
    value = "",
    placeholder = "",
    startAction = null,
    endAction = null,
    onChange = () => {},
    clearInput = () => {},
    onFocus = () => {},
    onBlur = () => {},
  } = props;

  return (
    <div className="w-[90%] rounded-lg bg-white dark:bg-dark dark:shadow-black/40 flex items-center justify-center p-[5px] my-[8px] shadow-primary/10 shadow-sm">
      <div className="flex items-center justify-center p-[5px]">
        {!value &&
          (startAction ?? (
            <IoSearchOutline className="text-[20px] text-slate-500 dark:text-slate-100/50" />
          ))}
      </div>

      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e)}
        className="text-[1rem] bg-transparent border-0 outline-0 w-[90%] text-black dark:text-white p-[5px]"
        placeholder={placeholder}
        onBlur={onBlur}
        onFocus={onFocus}
      />

      {value && (
        <IoCloseOutline
          className="text-[20px] text-slate-500 dark:text-slate-100/50"
          onClick={clearInput}
        />
      )}

      <div className="flex items-center justify-center p-[5px]">
        {endAction && endAction}
      </div>
    </div>
  );
};

export default forwardRef(InputField);

/* styles */
