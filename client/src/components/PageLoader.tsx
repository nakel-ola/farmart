import clsx from "clsx";
import React from "react";
import ReactLoading from "react-loading";
import setting from "../data/setting";
import { useTheme } from "../styles/theme";

function PageLoader({ fill = false }: { fill?: boolean }) {
  const { systemTheme, theme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;
  return (
    <div
      className={clsx(
        "fixed top-0 z-10 transition-all duration-500 ease-in-out left-0 w-full h-full grid place-items-center",
        fill ? "bg-white dark:bg-dark" : "bg-[rgba(0,0,0,0.6)]"
      )}
    >
      <div className="flex items-center justify-center flex-col">
        <ReactLoading
          type="spinningBubbles"
          color={fill ? currentTheme === "dark" ? "white" : setting.dark : "white"}
          className={clsx(fill ? "text-black dark:text-white" : "text-white")}
        />
        <p
          className={clsx(
            "text-[1.2rem] p-[8px]",
            fill ? "text-black dark:text-white" : "text-white"
          )}
        >
          Loading
        </p>
      </div>
    </div>
  );
}

export default PageLoader;
