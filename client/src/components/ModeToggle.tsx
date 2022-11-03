import { Moon, Sun1 } from "iconsax-react";
import { useEffect, useState } from "react";
import { useTheme } from "../styles/theme";

const ModeToggle = () => {
  const { systemTheme, theme, setTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  const [mount,setMount] = useState(false)

  const handleClick = () => {
    const isDark = currentTheme === "dark";
    setTheme(isDark ? "light" : "dark");
  };

  useEffect(() => {
    setMount(true)
  },[])

  return mount ? (
    <div className="relative h-[35px] w-[35px] lg:min-w-[65px] lg:max-h-[32px] bg-slate-100 dark:bg-neutral-800 m-2 rounded-full flex items-center justify-center">
      <div className="relative hidden lg:flex items-center justify-between w-full h-full z-[1]">
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

      <button className="lg:hidden flex items-center justify-center" onClick={handleClick}>
        {currentTheme === "dark" ? (
          <Sun1 size={20} className="text-xl text-black dark:text-white" />
        ) : (
          <Moon size={20} className="text-xl text-black dark:text-white" />
        )}
      </button>

      <div
        className={`absolute hidden lg:block top-[50%] translate-y-[-50%] h-[28px] w-[28px] bg-white dark:bg-dark rounded-full transition-all duration-300 ${
          currentTheme === "dark" ? "left-[35px]" : "left-[3px]"
        }`}
      ></div>
    </div>
  ) : null;
};

export default ModeToggle;
