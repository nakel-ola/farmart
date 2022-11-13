import React from "react";
import ReactLoading from "react-loading";
import { useTheme } from "../styles/theme";

const LoadingCard = ({ title = "Loading..." }: { title?: string }) => {
  const { systemTheme, theme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;
  return (
    <div className="w-full grid place-items-center h-[30vh]">
      <div className="flex flex-col items-center justify-center">
        <ReactLoading
          type="spinningBubbles"
          color={currentTheme === "dark" ? "white" : "black"}
          className="dark:text-white text-black"
        />
        <p className="my-5 text-lg dark:text-white text-black font-medium">
          {title}
        </p>
      </div>
    </div>
  );
};

export default LoadingCard;
