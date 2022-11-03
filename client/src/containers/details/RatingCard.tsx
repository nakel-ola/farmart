import { Star1 } from "iconsax-react";
import React from "react";
import CardTemplate from "../../components/CardTemplate";

const progress = (total: number, value: number) => {
  return (value / total) * 100;
};

const rating = (value: number) => {
  return Math.min(5, Math.max(0, value));
};

const RatingCard = () => {
  const items = [
    {
      name: "5",
      value: 194,
    },
    {
      name: "4",
      value: 50,
    },
    {
      name: "3",
      value: 13,
    },
    {
      name: "2",
      value: 7,
    },
    {
      name: "1",
      value: 2,
    },
  ];

  let total = items.reduce((amount, item) => item.value + amount, 0);

  return (
    <CardTemplate title="Rating" className="mt-3">
      <div className="flex justify-center w-[30%] flex-col m-2">
        <div className="w-full h-[200px] bg-yellow/10 rounded-lg flex items-center justify-center flex-col">
          <h1 className="text-yellow text-3xl font-bold my-2">
            {rating(total)} / 5
          </h1>

          <span className="flex items-center my-2">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Star1
                  key={i}
                  size={25}
                  variant="Bold"
                  className="text-yellow text-[20px]"
                />
              ))}
            {Array(4 && 5 - 4)
              .fill(0)
              .map((_, i) => (
                <Star1
                  key={i}
                  size={25}
                  variant="Bold"
                  className="text-[#bdbdbd] text-[20px]"
                />
              ))}
          </span>

          <p className="my-2 text-lg">{total} verified ratings</p>
        </div>
        <div className="my-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="flex items-center flex-1">
                <p className="px-2 text-lg font-semibold">{item.name}</p>
                <span className="">
                  <Star1
                    size={25}
                    variant="Bold"
                    className="text-yellow text-[20px]"
                  />
                </span>

                <p className="text-neutral-600 dark:text-neutral-400 mx-2">
                  ({item.value})
                </p>
              </div>

              <span className="w-[150px] rounded-full h-3 bg-slate-100  flex overflow-hidden">
                <span
                  className="bg-yellow h-full"
                  style={{
                    width: progress(total, item.value) + "px",
                  }}
                ></span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </CardTemplate>
  );
};

export default RatingCard;
