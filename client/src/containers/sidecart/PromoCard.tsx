/* importing required files and packages */
import { CloseCircle } from "iconsax-react";
import { ChangeEvent, forwardRef } from "react";
import { IoCloseOutline, IoSearchOutline } from "react-icons/io5";
import Button from "../../components/Button";

interface Props {
  value?: string;
  placeholder?: string;
  onChange?: (e: ChangeEvent) => void;
  onClear?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  handleApply?: () => void;
}

const PromoCard = (props: Props, ref: any) => {
  // --- Destructing pros --- //

  const {
    value = "",
    placeholder = "",
    onChange = () => {},
    onClear = () => {},
    onFocus = () => {},
    onBlur = () => {},
    handleApply = () => {},
  } = props;

  return (
    <div className="w-full rounded-full flex items-center justify-between my-2">
      <div className="flex items-center bg-slate-100 dark:bg-neutral-800 py-[5px] px-[10px] rounded-full mr-2">
        <input
          className="font-[1rem] bg-transparent border-none outline-none w-[80%] text-black dark:text-white flex-1 px-[3px]"
          ref={ref}
          value={value}
          onChange={(e) => onChange(e)}
          placeholder={placeholder}
          onBlur={onBlur}
          onFocus={onFocus}
        />

        {value && (
          <CloseCircle
            onClick={onClear}
            size={20}
            variant="Bold"
            className="text-slate-500 dark:text-slate-100/50 cursor-pointer"
          />
        )}
      </div>

      <Button disabled={value.length <= 0} onClick={handleApply}>
        Apply
      </Button>
    </div>
  );
};

export default forwardRef(PromoCard);

/* styles */
