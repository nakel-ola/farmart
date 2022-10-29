export interface useControlledProps<T = unknown> {
    /**
     * Holds the component value when it's controlled
     */
    controlled: T | undefined;
    /**
     * The default value when uncontrolled
     */
    default: T | undefined;
    /**
     * The component name displayed in warning
     */
    name: string;
    /**
     * The name of the state variable in warning
     */
    state?: string;
}

export default function useControlled<T = unknown>(props: useControlledProps<T>): [T, (newValue: T | ((preValue: T) => T)) => void];