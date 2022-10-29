import React, { useState } from "react";
import {
  IoRadioButtonOffOutline,
  IoRadioButtonOnOutline
} from "react-icons/io5";
import { useSelector } from "react-redux";
import InputField from "../../components/InputField";
import numberFormat from "../../helper/numberFormat";
import { getBasketTotal, selectBasket } from "../../redux/features/basketSlice";
import { Button } from "../auth/LogInCard";

function CardFields({
  setCardDetails,
}: {
  setCardDetails: (value: any | null) => void;
}) {
  const basket = useSelector(selectBasket);

  const [form, setForm] = useState({
    cardName: "",
    cardNumber: "",
    expired: "",
    cvv: "",
    zip: "",
  });

  const currencyConvert = (num: number) => `${Math.floor(Number(num * 210))}`;

  const { cardName, cardNumber, expired, cvv, zip } = form;

  const [active, setActive] = useState<boolean>(false);

  return (
    <div className="w-full md:w-[70%] bg-white dark:bg-dark mt-[10px] px-[10px] pb-[15px] md:rounded-lg shadow-sm dark:shadow-black">
      <div className="w-full flex items-center justify-between px-[5px] py-[15px]">
        <p className="text-[1rem] text-black dark:text-white font-[500]">
          {" "}
          Payment Amount: ₦{" "}
          {numberFormat(currencyConvert(getBasketTotal(basket)))}{" "}
        </p>
      </div>

      <div className="px-[15px]  flex items-center justify-center flex-col">
        <div className="w-[90%] md:w-[80%] py-[5px]">
          <p className="text-black dark:text-white text-[1rem] font-medium">
            Name on card
          </p>
          <InputField
            IconLeft="disabled"
            className="w-full"
            value={cardName}
            type="text"
            onChange={(e: any) =>
              setForm((prev) => ({ ...prev, cardName: e.target.value }))
            }
            placeholder="Enter your Card name"
            clearInput={() => setForm((prev) => ({ ...prev, cardName: "" }))}
          />
        </div>

        <div className="w-[90%] md:w-[80%] py-[5px]">
          <p className="text-black dark:text-white text-[1rem] font-medium">
            Card Number
          </p>
          <InputField
            IconLeft="disabled"
            value={cardNumber}
            type="tel"
            onChange={(e: any) =>
              setForm((prev) => ({
                ...prev,
                cardNumber:
                  cardNumber.length < 16 ? e.target.value : cardNumber,
              }))
            }
            placeholder="Enter your Card number"
            clearInput={() => setForm((prev) => ({ ...prev, number: "" }))}
          />
        </div>

        <div className="flex items-center w-[90%] md:w-[80%]">
          <div className="py-[5px] pr-[10px] flex-[0.45]">
            <p className="text-black dark:text-white text-[1rem] font-medium">
              Expire Date
            </p>
            <InputField
              IconLeft="disabled"
              value={expired}
              maxLength={5}
              type="text"
              onChange={(e: any) =>
                setForm((prev) => ({
                  ...prev,
                  expired:
                    expired.length === 1
                      ? e.target.value + "/"
                      : e.target.value,
                }))
              }
              placeholder="MM / YY"
              clearInput={() => setForm((prev) => ({ ...prev, expired: "" }))}
            />
          </div>
          <div className="py-[5px] flex-[0.45]">
            <p className="text-black dark:text-white text-[1rem] font-medium">
              Security Code
            </p>
            <InputField
              IconLeft="disabled"
              value={cvv}
              maxLength={3}
              type="tel"
              onChange={(e: any) =>
                setForm((prev) => ({
                  ...prev,
                  cvv: e.target.value,
                }))
              }
              placeholder="Enter your cvv"
              clearInput={() => setForm((prev) => ({ ...prev, cvv: "" }))}
            />
          </div>
        </div>
        <div className="w-[90%] md:w-[80%] py-[5px] ">
          <p className="text-black dark:text-white text-[1rem] font-medium">
            Zip/Postal Code
          </p>
          <InputField
            IconLeft="disabled"
            value={zip}
            type="tel"
            onChange={(e: any) =>
              setForm((prev) => ({
                ...prev,
                zip: e.target.value,
              }))
            }
            placeholder="Enter zip code"
            clearInput={() => setForm((prev) => ({ ...prev, zip: "" }))}
          />
        </div>

        <div
          className="flex items-center w-[85%]"
          onClick={() => setActive((prev) => !prev)}
        >
          <div className="w-[35px] h-[35px] rounded-full flex items-center justify-center m-[5px]">
            {active ? (
              <IoRadioButtonOnOutline className="text-[25px] text-black dark:text-white" />
            ) : (
              <IoRadioButtonOffOutline className="text-[25px] text-black dark:text-white" />
            )}
          </div>
          <p className="text-black dark:text-white ">
            {" "}
            Save this card for future payments{" "}
          </p>
        </div>

        <div className="h-[20px]" />

        <div className="flex items-center w-[90%]">
          <p className="text-[0.8rem] text-center text-black dark:text-white">
            By click On the button below, you confirm that you have read and
            accept Terms and Condition.{" "}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center w-[100%] my-[10px]">
        <Button
          disabled={
            !form.cardName ||
            !form.cardNumber ||
            !form.cvv ||
            !form.expired ||
            !form.zip
          }
          className={`w-[40%] disabled:bg-neutral-400`}
          onClick={() => setCardDetails(form)}
        >
          {" "}
          Pay now{" "}
        </Button>{" "}
      </div>
    </div>
  );
}

export default CardFields;
