import clsx from "clsx";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps<T> extends ButtonHTMLAttributes<T> {
  children: ReactNode;
}

function Button(props: ButtonProps<any>) {
  const { children, className, ...others } = props;
  return (
    <button
      className={twMerge(
        "px-3 mr-2 font-medium rounded-full h-fit py-[4px] text-white bg-primary hover:scale-105 active:scale-95 transition-all duration-300 disabled:scale-100 disabled:opacity-40 whitespace-nowrap",
        className
      )}
      {...others}
    >
      {children}
    </button>
  );
}

export default Button;
