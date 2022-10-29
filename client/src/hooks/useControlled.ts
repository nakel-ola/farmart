import * as React from "react";
import { useControlledProps } from "./useControlled.d";


export default function useControlled<T>({
  controlled,
  default: defaultProp,
  name,
  state = "value",
}: useControlledProps<T>): [T, (newValue: T | ((preValue: T) => T)) => void] {
  const { current: isControlled } = React.useRef(controlled !== undefined);
  const [valueState, setValue] = React.useState<any>(defaultProp);
  const value = isControlled ? controlled : valueState;

  if (process.env.NODE_ENV !== "production") {
    React.useEffect(() => {
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
    }, [state, name, controlled]);

    const { current: defaultValue } = React.useRef(defaultProp);

    React.useEffect(() => {
        if(!isControlled && defaultValue !== defaultProp) {
            console.error([`A component is changing the default ${state} state of an uncontrolled ${name} after being initialized.` + `To suppress this warning opt to use a controlled ${name}`].join('\n'))
        }
    }, [JSON.stringify(defaultProp)]);
  }

  const setValueIfUncontrolled = React.useCallback((newValue: T | ((preValue: T) => T)) => {
    if(!isControlled) setValue(newValue);
  }, []);

  return [value!, setValueIfUncontrolled];
}
