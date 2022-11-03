import { useMutation, useQuery } from "@apollo/client";
import { Heart, Star1 } from "iconsax-react";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Currency } from "../../../typing";
import numberFormat from "../../helper/numberFormat";
import {
  AddToFavorites,
  FavoriteQuery,
  RemoveFromFavorites,
} from "../home/Card";

type Props = {
  title: string;
  price: number;
  category: string;
  rating: number;
  data: boolean;
  currency: Currency;
};

const TitleCard = ({
  title,
  category,
  price,
  rating,
  data,
  currency,
}: Props) => {
  const router = useRouter();

  // --- Capitalising first letter --- //
  const capitalizeFirstLetter = (string: string) =>
    string?.charAt(0).toUpperCase() + string?.slice(1);

  const { user } = useSelector((store: any) => store.user);

  const { data: items, refetch } = useQuery(FavoriteQuery, {
    variables: { id: router.query.id },
  });

  const selected = data && items?.favorite?.id === router.query.id;

  const [addToFavorites] = useMutation(AddToFavorites, {
    onError: (e) => {
      console.error(e);
    },
  });

  const [removeFromFavorites] = useMutation(RemoveFromFavorites, {
    onError: (e) => {
      console.error(e);
    },
  });

  const handleFavorite = () => {
    if (user) {
      if (selected) {
        removeFromFavorites({ variables: { id: router.query.id } });
      } else {
        addToFavorites({ variables: { id: router.query.id } });
      }
      refetch({ id: router.query.id });
    } else {
      toast.success("LogIn to save item");
    }
  };

  return (
    <div className="w-[95%] md:w-[80%] mt-[10px] bg-white dark:bg-dark dark:shadow-black/30 pb-[12px] p-[5px] pt-[12px] shadow-sm rounded-lg pl-[23px]">
      <div className="flex items-center justify-between">
        <p className="text-[1.2rem] text-black font-[600] dark:text-white">
          {" "}
          {title}
        </p>

        <div className="w-[40px] h-[25px] rounded-lg mx-[5px] bg-red-600/10 flex items-center justify-center ">
          <p className="text-red-600 font-semibold text-base"> -20%</p>
        </div>
      </div>
      <div className="flex items-center py-2 pr-[5px]">
        <p className="text-base text-dark dark:text-white">
          Category:{" "}
        </p>
        <p className="text-base text-blue-600 pl-2">
          {capitalizeFirstLetter(category)}
        </p>
      </div>

      <p className="text-base text-black dark:text-white font-[600]">
        {currency.symbol} {price.toFixed(2)}
      </p>

      <div className="flex items-center justify-between pt-[5px] pr-[5px]">
        <span className="flex items-center">
          {Array(rating)
            .fill(0)
            .map((_, i) => (
              <Star1
                key={i}
                size={25}
                variant="Bold"
                className="text-[#f8b808] text-[20px]"
              />
            ))}
          {Array(rating && 5 - rating)
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

        {user && (
          <button
            type="button"
            className="flex items-center pt-[5px] pr-[5px]"
            onClick={handleFavorite}
          >
            <Heart
              size={25}
              variant={selected ? "Bold" : "Outline"}
              className="text-[#212121] dark:text-neutral-300 text-[25px]"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default TitleCard;
