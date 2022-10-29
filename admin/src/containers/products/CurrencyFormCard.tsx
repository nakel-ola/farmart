import { Fade } from "@mui/material";
import { ArrowDown2 } from "iconsax-react";
import { useRef, useState } from "react";
import { Currency } from "../../../typing";
import InputField, { InputFieldProps } from "../../components/InputField";
import currencies from "../../data/currencies.json";
import useOnClickOutside from "../../hooks/useOnClickOutside";

interface CurrencyProps extends InputFieldProps {
  title: string;
  currency: Currency | null;
}

const CurrencyFormCard = ({
  title,
  currency,
  onChange,
  ...others
}: CurrencyProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [toggle, setToggle] = useState(false);

  useOnClickOutside(ref, () => toggle && setToggle(false));

  return (
    <div className="flex flex-col items-center justify-center mt-2 flex-[1] relative">
      <label
        id="currency-list"
        className="text-[1rem] text-black dark:text-white font-[500] ml-2 w-full"
      >
        {title}
      </label>

      <div ref={ref} className={`w-full`}>
        <InputField
          IconLeft="disabled"
          className="relative cursor-pointer"
          value={currency?.code}
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
            <div className="w-[98%] max-h-[200px] overflow-scroll bg-white dark:bg-dark shadow-md shadow-slate-300 dark:shadow-black/10 rounded-xl scrollbar-hide">
              {currencies.map((currency: Currency, index: number) => (
                <div
                  key={index}
                  className="flex items-center p-2 cursor-pointer hover:bg-slate-100 dark:bg-neutral-800"
                  onClick={() => {
                    onChange(currency);
                    setToggle(false);
                  }}
                >
                  <p className="pl-1 text-black dark:text-white font-medium">
                    {currency.code}
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

export default CurrencyFormCard;