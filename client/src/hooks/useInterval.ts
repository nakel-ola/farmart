import { useEffect, useRef } from "react";

interface Callback {
  current: any;
}

export default function useInterval(callback: () => void, delay: number) {
  const callbackRef = useRef(callback);

  // update callback function with current render callback that has access to latest props and state
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    if (!delay) {
      return () => {};
    }

    const interval = setInterval(() => {
      callbackRef.current && callbackRef.current();
    }, delay);
    return () => clearInterval(interval);
  }, [delay]);
}
