import { useState } from "react";
import useEvent from "./useEvent";

let win = typeof window !== "undefined" ? window : {} as Window;

const useOnlineStatus = () => {
  const [online, setOnline] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return navigator.onLine;
  });

  useEvent(win, "online", () => setOnline(navigator.onLine));
  useEvent(win, "offline", () => setOnline(navigator.onLine));

  return online;
};

export default useOnlineStatus;
