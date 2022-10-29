import { Moon, Sun1 } from "iconsax-react";
import { useTheme } from "../styles/theme";

const ModeToggle = () => {
  const { systemTheme, theme, setTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  const handleClick = () => {
    const isDark = currentTheme === "dark";
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="relative min-w-[65px] max-h-[30px] bg-slate-100 dark:bg-neutral-800 m-2 rounded-full">
      <div className="relative flex items-center justify-between w-full h-full z-[1]">
        <button
          className="m-[2px] h-[28px] w-[28px] flex items-center justify-center rounded-full"
          onClick={handleClick}
        >
          <Sun1 size={20} className="text-xl text-black dark:text-white" />
        </button>

        <button
          className="m-[2px] h-[28px] w-[28px] flex items-center justify-center rounded-full"
          onClick={handleClick}
        >
          <Moon size={20} className="text-xl text-black dark:text-white" />
        </button>
      </div>

      <div
        className={`absolute top-[50%] translate-y-[-50%] h-[28px] w-[28px] bg-white dark:bg-dark rounded-full transition-all duration-300 ${
          currentTheme === "dark" ? "left-[35px]" : "left-[2px]"
        }`}
      ></div>
    </div>
  );
};

export default ModeToggle;
