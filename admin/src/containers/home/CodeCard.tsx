import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import React, {
  ChangeEvent,
  ClipboardEvent,
  createRef,
  FormEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  useEffect,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import Button from "../../components/Button";
import usePrevious from "../../hooks/usePrevious";
import { selectValidateUser } from "../../redux/features/userSlice";
import TitleCard from "./TitleCard";

let numInputs = 5,
  isInputNum: boolean;

const CodeQuery = gql`
  mutation ValidateCode($input: ValidateCodeInput!) {
    validateCode(input: $input) {
      validate
    }
  }
`;

const CodeCard = ({ setLoading }: { setLoading(value: boolean): void }) => {
  const router = useRouter();
  const validate = useSelector(selectValidateUser);
  const [input, setInput] = useState("");
  const [state, setState] = useState({
    activeInput: 0,
    isDisabled: false,
    shouldAutoFocus: false,
    isInputSecure: false,
  });

  const [validateCode] = useMutation(CodeQuery);

  const getOtpValue = () => (input ? input.toString().split("") : []);

  const handleOtpChange = (otp: number[] | string[]) => {
    const otpValue = otp.join("");
    setInput(otpValue);
  };

  const focusInput = (value: number) => {
    const activeInput = Math.max(Math.min(numInputs - 1, value), 0);

    setState({ ...state, activeInput });
  };

  const focusNextInput = () => {
    focusInput(state.activeInput + 1);
  };

  const focusPrevInput = () => {
    focusInput(state.activeInput - 1);
  };

  const changeCodeAtFocus = (value: any) => {
    let otp = getOtpValue();
    otp[state.activeInput] = value[0];
    handleOtpChange(otp);
  };

  const handleOnPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const { activeInput } = state;

    if (state.isDisabled) {
      return;
    }

    const otp = getOtpValue();

    let nextActiveInput = activeInput;
    const pastedData = (
      e.clipboardData
        .getData("text/plain")
        .slice(0, numInputs - state.activeInput) as any
    ).split("");

    for (let pos = 0; pos < numInputs; ++pos) {
      if (pos >= activeInput && pastedData.length > 0) {
        otp[pos] = pastedData.shift();
        nextActiveInput++;
      }
    }

    setState({ ...state, activeInput: nextActiveInput });
    focusInput(nextActiveInput);
    handleOtpChange(otp);
  };

  const isInputValueValid = (value: string) => {
    const isTypeValid = isInputNum
      ? !isNaN(parseInt(value, 10))
      : typeof value === "string";

    return isTypeValid && value.trim().length === 1;
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (isInputValueValid(value)) {
      changeCodeAtFocus(value);
    }
  };

  const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      changeCodeAtFocus("");
      focusPrevInput();
    } else if (e.key === "Delete") {
      e.preventDefault();
      changeCodeAtFocus("");
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusPrevInput();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusNextInput();
    } else if (e.key === " " || e.key === "Spacebar" || e.key === "Space") {
      e.preventDefault();
    }
  };

  const handleOnInput = (e: any) => {
    if (isInputValueValid(e.target.value)) {
      focusNextInput();
    } else {
      if (isInputNum) {
        const { nativeEvent } = e;

        if (
          nativeEvent.data === null &&
          nativeEvent.inputType === "deleteContentBackward"
        ) {
          e.preventDefault();
          changeCodeAtFocus("");
          focusPrevInput();
        }
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let loginToast = toast.loading("Loading......");
    setLoading(true);

    await validateCode({
      variables: {
        input: {
          ...validate,
          validationToken: input,
        },
      },
      onCompleted: (data) => {
        if (data.validateCode.validate) {
          router.push("?type=confirm");
          toast.success("Successfully Validated", { id: loginToast });
        } else {
          toast.error("Invalid Code", { id: loginToast });
        }
        setLoading(false);
      },
      onError: (error: any) => {
        setLoading(false);
        toast.error("Something went wrong", { id: loginToast });
        console.table(error);
      },
    });
  };

  return (
    <div className="w-full flex items-center justify-center flex-col mt-5">
      <TitleCard title="Enter you verification code" />

      <form onSubmit={handleSubmit} className="w-full grid place-items-center py-[5px]">
        <div className="w-[80%] flex items-center justify-center">
          {Array(5)
            .fill(1)
            .map((_, i: number) => {
              const otp = getOtpValue() as any;
              return (
                <CodeInput
                  key={i}
                  index={i}
                  focus={state.activeInput === i}
                  value={otp[i]}
                  onChange={handleOnChange}
                  onKeyDown={handleOnKeyDown}
                  onInput={handleOnInput}
                  onPaste={handleOnPaste}
                  onFocus={(e) => {
                    setState({ ...state, activeInput: i });
                    e.target.select();
                  }}
                  onBlur={() => setState({ ...state, activeInput: -1 })}
                  shouldAutoFocus={state.shouldAutoFocus}
                  isInputNum={isInputNum}
                />
              );
            })}
        </div>

        <Button type="submit" className="my-10" disabled={input.length < 5}>
          Confirm
        </Button>
      </form>
    </div>
  );
};

interface CodeInputType extends InputHTMLAttributes<any> {
  focus: boolean;
  shouldAutoFocus: boolean;
  isInputNum: boolean;
  index: number;
  value: any;
}

const CodeInput = ({
  focus,
  shouldAutoFocus,
  index,
  isInputNum,
  value,
  ...others
}: CodeInputType) => {
  const inputRef = createRef<HTMLInputElement>();

  const prevFocus = usePrevious(focus);
  const prevValue = usePrevious(value);

  useEffect(() => {
    if (inputRef.current && focus && shouldAutoFocus) {
      inputRef.current.focus();
    }
  }, [focus, inputRef, shouldAutoFocus]);

  useEffect(() => {
    const inputEl = inputRef.current;
    if (prevFocus !== focus && inputEl && focus) {
      inputEl.focus();
      inputEl.select();
    }
  }, [focus, inputRef, prevFocus]);

  useEffect(() => {
    if (inputRef.current && prevValue !== value) {
      inputRef.current.value = value ?? "";
    }
  }, [value, inputRef, prevValue]);
  return (
    <div
      className={`w-[40px] h-[40px] rounded-lg flex items-center justify-center p-[5px] mt-[8px] mr-[15px] transition-all duration-300 ease hover:shadow-sm bg-slate-100 dark:bg-neutral-800 ${
        focus
          ? "ring-primary/30 ring-offset-primary/80"
          : "ring-transparent ring-offset-transparent"
      }`}
    >
      <input
        aria-label={`${index === 0 ? "Please enter verification code." : ""}${
          isInputNum ? "Digit" : "Character"
        }${index + 1}`}
        ref={inputRef}
        autoComplete="off"
        className="text-[1rem] bg-transparent dark:text-white/90 border-none outline-none w-[95%] text-black dark:text-white mr-auto autofill:bg-transparent text-center font-bold"
        maxLength={1}
        value={value}
        type="tel"
        {...others}
      />
    </div>
  );
};

export default CodeCard;
