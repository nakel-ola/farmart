import { Fade } from "@mui/material";
import { ArrowDown2 } from "iconsax-react";
import { useRef, useState } from "react";
import useOnClickOutside from "../hooks/useOnClickOutside";
import InputField, { InputFieldProps } from "./InputField";

interface Props {
  [key: string]: any;
  title: string;
  list: string[];
  margin?: boolean;
  show?: boolean;
  onChange?: (value: any) => void;
}

const InputDropdown = ({
  title,
  value,
  onChange,
  list = [],
  margin,
  show,
  ...others
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [toggle, setToggle] = useState(false);

  useOnClickOutside(ref, () => toggle && setToggle(false));

  return (
    <div
      className={`flex flex-col items-center justify-center mt-2 relative w-full ${
        show ? "flex-1" : ""
      } ${margin ? "mr-2" : ""}`}
    >
      <label
        id="currency-list"
        className={`text-[1rem] text-black dark:text-white font-[500] ml-2 w-full ${
          show ? "w-full" : "w-[80%]"
        }`}
      >
        {title}
      </label>

      <div ref={ref} className={`${show ? "w-full" : "w-[80%]"}`}>
        <InputField
          IconLeft="disabled"
          className="relative cursor-pointer"
          value={value}
          readOnly
          onClick={() => setToggle(!toggle)}
          {...others}
          IconRight={
            <div onClick={() => setToggle(!toggle)}>
              <ArrowDown2
                variant="Bold"
                className="text-black dark:text-white"
              />
            </div>
          }
        />

        {list.length > 0 && (
          <Fade
            timeout={{ enter: 500, exit: 500, appear: 500 }}
            appear={toggle}
            in={toggle}
          >
            <div
              className={`grid absolute left-0 w-full place-items-center transition-all duration-300 `}
            >
              <div
                className={`mt-2 max-h-[200px] overflow-scroll bg-white dark:bg-dark shadow-md shadow-slate-300 dark:shadow-black/10 rounded-xl scrollbar-hide z-10 ${
                  show ? "w-full" : "w-[80%]"
                }`}
              >
                {list.map((text: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center p-2 cursor-pointer hover:bg-slate-100 dark:bg-neutral-800"
                    onClick={() => {
                      onChange?.(text);
                      setToggle(false);
                    }}
                  >
                    <p className="pl-1 text-black dark:text-white font-medium">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Fade>
        )}
      </div>
    </div>
  );
};

export default InputDropdown;
