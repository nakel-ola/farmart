import { Fade } from "@mui/material";
import { ArrowDown2 } from "iconsax-react";
import { useRef, useState } from "react";
import { Discount } from "../../../typing";
import InputField, { InputFieldProps } from "../../components/InputField";
import discounts from "../../data/discount.json";
import useOnClickOutside from "../../hooks/useOnClickOutside";

interface DiscountProps extends InputFieldProps {
  title: string;
  discount: Discount | null;
}

const DiscountCard = ({
  title,
  onChange,
  discount,
  ...others
}: DiscountProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [toggle, setToggle] = useState(false);

  useOnClickOutside(ref, () => toggle && setToggle(false));

  return (
    <div className="flex flex-col items-center justify-center mt-2 w-full flex-[1] relative">
      <label
        id="currency-list"
        className="text-[1rem] text-black dark:text-white font-[500] ml-2 w-[80%]"
      >
        {title}
      </label>

      <div ref={ref} className={`w-[80%]`}>
        <InputField
          IconLeft="disabled"
          className="relative cursor-pointer"
          value={discount?.name}
          readOnly
          onClick={() => setToggle(!toggle)}
          {...others}
          IconRight={
            <div onClick={() => setToggle(!toggle)}>
              <ArrowDown2
                variant="Bold"
                className="text-black dark:text-white"
              />
            </div>
          }
        />

        <Fade
          timeout={{ enter: 500, exit: 500, appear: 500 }}
          appear={toggle}
          in={toggle}
        >
          <div
            className={`grid absolute left-0 w-full place-items-center transition-all duration-300 `}
          >
            <div className="w-[80%] max-h-[200px] overflow-scroll bg-white dark:bg-dark shadow-md shadow-slate-300 dark:shadow-black/10 rounded-xl scrollbar-hide mt-2">
              {discounts.map((discount: Discount, index: number) => (
                <div
                  key={index}
                  className="flex items-center p-2 cursor-pointer hover:bg-slate-100 dark:bg-neutral-800"
                  onClick={() => {
                    onChange?.(discount);
                    setToggle(false);
                  }}
                >
                  <p className="pl-1 text-black dark:text-white font-medium">
                    {discount.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Fade>
      </div>
    </div>
  );
};

export default DiscountCard;
