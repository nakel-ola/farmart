/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect,useRef,useState,useCallback } from "react";
import { useControlledProps } from "./useControlled.d";


export default function useControlled<T>({
  controlled,
  default: defaultProp,
  name,
  state = "value",
}: useControlledProps<T>): [T, (newValue: T | ((preValue: T) => T)) => void] {
  const { current: isControlled } = useRef(controlled !== undefined);
  const [valueState, setValue] = useState<any>(defaultProp);
  const value = isControlled ? controlled : valueState;

  if (process.env.NODE_ENV !== "production") {
    useEffect(() => {
      if (isControlled !== (controlled !== undefined)) {
        console.error(
          [
            `A component is changing the ${
              isControlled ? "" : "un"
            }controlled ${state} of ${name} to be ${
              isControlled ? "un" : ""
            }controlled.`,
            "Elements should not switch from uncontrolled to controlled to controlled (or vice versa).",
            `Decide between using a controlled or uncontrolled ${name}` +
              "element for the lifetime of the components.",
            "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
          ].join("\n")
        );
      }
    }, [state, name, controlled,isControlled]);

    const { current: defaultValue } = useRef(defaultProp);

    useEffect(() => {
        if(!isControlled && defaultValue !== defaultProp) {
            console.error([`A component is changing the default ${state} state of an uncontrolled ${name} after being initialized.` + `To suppress this warning opt to use a controlled ${name}`].join('\n'))
        }
    }, [JSON.stringify(defaultProp)]);
  }

  const setValueIfUncontrolled = useCallback((newValue: T | ((preValue: T) => T)) => {
    if(!isControlled) setValue(newValue);
  }, []);

  return [value!, setValueIfUncontrolled];
}
