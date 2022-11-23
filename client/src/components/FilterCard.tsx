import { Slider } from "@mui/material";
import { Star1 } from "iconsax-react";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import {
  IoRadioButtonOffOutline,
  IoRadioButtonOnOutline,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import setting from "../data/setting";
import { selectCatagory } from "../redux/features/categorySlice";
import { remove } from "../redux/features/dialogSlice";
import { add, selectFilter } from "../redux/features/filterSlice";
import Button from "./Button";
import Divider from "./Divider";
import InputField from "./InputField";
import PopupTemplate from "./PopupTemplate";

const FilterCard = () => {
  const dispatch = useDispatch();
  const close = () => dispatch(remove({ type: "filter" }));

  let filter = useSelector(selectFilter)

  const [category, setCategory] = useState<string | string[]>(filter?.category ?? "all");
  const [price, setPrice] = useState(filter?.price ?? [1, 100]);
  const [rating, setRating] = useState<number | null>(filter?.rating!);
  const [discount, setDiscount] = useState<string[]>(filter?.discount ?? []);

  const handleSave = () => {
    dispatch(
      add({
        category: typeof category === "string" ? null : category,
        discount: discount.length > 0 ? discount : null,
        price: price.length === 0 ? price : null,
        rating,
      })
    );
    close();
  };

  return (
    <PopupTemplate
      title="Products Filter"
      onOutsideClick={close}
      position="center"
      className="overflow-y-scroll"
    >
      <SortCard setActive={setCategory} active={category} />
      <Divider />

      <PriceCard
        value={price}
        handleChange={(event: Event, newValue: number | number[]) => {
          if (Array.isArray(newValue)) {
            setPrice(newValue);
          }
        }}
        setValue={setPrice}
      />

      {/* <Divider />

      <RatingCard setRating={setRating} rating={rating} /> */}

      <Divider />

      <DiscountCard setDiscount={setDiscount} discount={discount} />

      <div className="flex items-center justify-center mt-5">
        <Button
          type="button"
          className="bg-slate-100 dark:bg-neutral-800 text-black dark:text-white"
          onClick={close}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          type="submit"
          className="bg-primary text-white"
        >
          Save
        </Button>
      </div>
    </PopupTemplate>
  );
};

type SortType = {
  active: string | string[];
  setActive: Dispatch<SetStateAction<string | string[]>>;
};

const SortCard = ({ active, setActive }: SortType) => {
  const categories = useSelector(selectCatagory);

  const handleClick = (value: string) => {
    value = value.toLowerCase();
    if (value === "all") {
      setActive(value);
    } else {
      if (typeof active === "string") {
        setActive([value]);
      } else {
        let index = active.indexOf(value);

        if (index !== -1) {
          let newActive = [...active];
          newActive.splice(index, 1);

          if (newActive.length === 0) setActive("all");
          else setActive(newActive);
        } else {
          setActive([...active, value]);
        }
      }
    }
  };

  return (
    <div className="mt-2">
      <p className="p-2 pl-[15px] text-base text-black dark:text-white font-medium">
        Category
      </p>

      <div className="flex items-center overflow-scroll w-full scrollbar-hide pl-4">
        {categories?.map(({ name }: any, i: number) => {
          let selected =
            typeof active === "string"
              ? active === "all" && i === 0
              : active.find((a) => a === name.toLowerCase());
          return (
            <div
              key={i}
              onClick={() => handleClick(name)}
              className={`flex justify-center pb-[4px] px-[10px] m-[5px] items-center rounded-lg flex-1 hover:scale-110 transition-all duration-300 ease cursor-pointer ${
                selected
                  ? "bg-primary"
                  : "ring-[0.5px] ring-slate-100 dark:ring-neutral-800"
              }`}
            >
              <p
                className={`whitespace-nowrap text-[1rem]  ${
                  selected
                    ? "text-white"
                    : "text-neutral-600 dark:text-neutral-400"
                } `}
              >
                {name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

type PriceType = {
  value: number[];
  setValue: Dispatch<SetStateAction<number[]>>;
  handleChange:
    | ((event: Event, value: number | number[], activeThumb: number) => void)
    | undefined;
};

const PriceCard = ({ setValue, value, handleChange }: PriceType) => (
  <div className="">
    <p className="p-2 pl-[15px] text-base text-black dark:text-white font-medium">
      Price
    </p>

    <div className="w-full flex items-center justify-center">
      <Slider
        value={value}
        onChange={handleChange}
        min={1}
        max={100}
        style={{
          color: setting.primary,
          width: "80%",
        }}
      />
    </div>

    <div className="flex items-center justify-center">
      <div className="flex items-center justify-between w-[85%]">
        <p className="pl-2 text-black dark:text-white">Min</p>

        <p className="pr-2 text-black dark:text-white">Max</p>
      </div>
    </div>

    <div className="flex items-center justify-center">
      <div className="flex items-center justify-between w-[85%]">
        <InputField
          action="disabled"
          value={value[0]}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue([Number(e.target.value), value[1]])
          }
          clearInput={null}
          type="number"
          isPrice
        />

        <div className="w-[10px]" />

        <InputField
          action="disabled"
          value={value[1]}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue([value[0], Number(e.target.value)])
          }
          clearInput={null}
          type="tel"
          isPrice
        />
      </div>
    </div>
  </div>
);

type RatingProps = {
  rating: number | null;
  setRating: Dispatch<SetStateAction<number | null>>;
};

const RatingCard = ({ rating, setRating }: RatingProps) => (
  <div>
    <p className="p-2 pl-[15px] text-base text-black dark:text-white font-medium">
      Product Rating
    </p>

    {[1, 2, 3, 4].map((item, i) => (
      <div
        key={i}
        className="flex items-center justify-between mx-4"
        onClick={() => setRating(i)}
      >
        <span className="flex items-center my-2">
          {Array(item)
            .fill(1)
            .map((_, i) => (
              <Star1 key={i} variant="Bold" className="text-yellow" />
            ))}
          {Array(5 - item)
            .fill(1)
            .map((_, i) => (
              <Star1 key={i} className="text-black dark:text-white" />
            ))}
          <p className="pl-2 text-neutral-600 dark:text-neutral-400">
            {" "}
            & above
          </p>
        </span>

        <div>
          {rating === i ? (
            <IoRadioButtonOnOutline className="text-[25px] text-black dark:text-white" />
          ) : (
            <IoRadioButtonOffOutline className="text-[25px] text-black dark:text-white" />
          )}
        </div>
      </div>
    ))}
  </div>
);

type DiscountProps = {
  discount: string[];
  setDiscount: Dispatch<SetStateAction<string[]>>;
};

const DiscountCard = ({ discount, setDiscount }: DiscountProps) => {
  const handleClick = (value: string) => {
    let index = discount.indexOf(value);
    if (index === -1) {
      setDiscount([...discount, value]);
    } else {
      let newDiscount = [...discount];
      newDiscount.splice(index, 1);
      setDiscount(newDiscount);
    }
  };
  return (
    <div>
      <p className="p-2 pl-[15px] text-base text-black dark:text-white font-medium">
        Discount Percentage
      </p>

      <div className="flex items-center overflow-scroll w-full scrollbar-hide pl-4">
        {["10%", "20%", "30%", "40%", "50%"].map((item: any, i: number) => {
          let selected = discount.find((d) => d === item);
          return (
            <div
              key={i}
              onClick={() => handleClick(item)}
              className={`flex justify-center pb-[4px] px-[10px] m-[5px] items-center rounded-lg flex-1 hover:scale-110 transition-all duration-300 ease cursor-pointer ${
                selected
                  ? "bg-primary"
                  : "ring-[0.5px] ring-slate-100 dark:ring-neutral-800"
              }`}
            >
              <p
                className={`whitespace-nowrap text-[1rem]  ${
                  selected
                    ? "text-white"
                    : "text-neutral-600 dark:text-neutral-400"
                } `}
              >
                {item}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilterCard;
