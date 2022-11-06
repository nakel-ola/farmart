import { Dispatch, SetStateAction, useEffect, useState } from "react";
import usePrevious from "./usePrevious";

function useStateEffect<T>(
  value: T | (() => T),
  dependency: any[]
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(value);

  const previousValue = usePrevious(value, value);

  useEffect(() => {
    if (value !== previousValue) setState(value)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependency,previousValue,value]);
  return [state, setState];
}

export default useStateEffect;
