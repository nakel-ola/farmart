import clsx from "clsx";
import { useState } from "react";
import { InputFieldProps } from "./InputField";

interface CardProps extends InputFieldProps {
  title: string;
  toggle?: boolean;
  margin?: boolean;
}

const Textarea = ({ title, ...others }: CardProps) => {
  const [focus, setFocus] = useState<boolean>(false);

  return (
    <div className="flex flex-col items-center justify-center mt-2 w-full">
      <label className="text-[1rem] text-black dark:text-white font-[500] w-[80%]">
        {title}
      </label>
      <div
        className={clsx(
          "w-[80%] flex items-center justify-center bg-slate-100 dark:bg-neutral-800 rounded-lg mt-[8px] ring-2 ring-offset-2",
          focus
            ? "ring-primary/30 ring-offset-primary/80"
            : "ring-transparent ring-offset-transparent"
        )}
      >
        <textarea
          rows={3}
          {...others}
          className="bg-transparent flex-1 outline-0 border-0 mx-2 resize-none"
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        ></textarea>
      </div>
    </div>
  );
};

export default Textarea;
