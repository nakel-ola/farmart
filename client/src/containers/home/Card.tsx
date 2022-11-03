/* eslint-disable @next/next/no-img-element */
import { gql, useMutation, useQuery } from "@apollo/client";
import { Add, Heart, InfoCircle, Minus, Trash } from "iconsax-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import numberFormat from "../../helper/numberFormat";
import { add, remove } from "../../redux/features/basketSlice";

export const FavoriteQuery = gql`
  query Favorite($id: ID!) {
    favorite(id: $id) {
      id
    }
  }
`;

export const AddToFavorites = gql`
  mutation AddToFavorites($id: ID!) {
    addToFavorites(id: $id) {
      msg
    }
  }
`;

export const RemoveFromFavorites = gql`
  mutation RemoveFromFavorites($id: ID!) {
    removeFromFavorites(id: $id) {
      msg
    }
  }
`;

const Card = (props: any) => {
  const {
    image,
    price,
    title,
    id,
    slug,
    category,
    currency,
    stock,
    rating,
    description,
    refetchAll,
    discount,
    isFavouriteCard,
  } = props;

  const [favorite, setFavorites] = useState(false);

  useQuery(FavoriteQuery, {
    variables: { id },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data.favorite.id === id) {
        setFavorites(true);
      } else {
        setFavorites(false);
      }
    },
  });

  const [addToFavorites] = useMutation(AddToFavorites, {
    onCompleted: () => setFavorites(true),
  });

  const [removeFromFavorites] = useMutation(RemoveFromFavorites, {
    onCompleted: () => setFavorites(false),
  });

  const dispatch = useDispatch();

  const router = useRouter();

  // --- Accessing the redux state ---//
  const { basket } = useSelector((store: any) => store.basket);

  const { user } = useSelector((store: any) => store.user);

  // --- Checking if current product is in favorite list --- //
  //const selected = favorite.find((item) => item.id === id);

  const product = basket.find((item: any) => item.id === id);

  const handleFavorite = () => {
    if (user) {
      if (favorite) {
        removeFromFavorites({ variables: { id } });
        if (isFavouriteCard) {
          refetchAll();
        }
      } else {
        addToFavorites({ variables: { id } });
      }
      // refetch({ id });
    } else {
      toast.success("LogIn to save item");
    }
  };

  const stateData = {
    id,
    image,
    category,
    price,
    stock,
    rating,
    description,
    title,
    currency,
  };

  const increment = () => {
    dispatch(
      add({
        ...stateData,
        quantity: product?.quantity ? product?.quantity + 1 : 1,
      })
    );
  };

  // --- Decrementing Product To basket --- //
  const decrement = () => {
    if (product?.quantity && product?.quantity > 1) {
      dispatch(
        add({
          ...stateData,
          quantity: product?.quantity - 1,
        })
      );
    } else {
      dispatch(remove({ id }));
    }
  };

  const truncate = (text: string, num: number) =>
    text.length > num ? text.substring(0, num - 2) + " ..." : text;

  return (
    <div className="my-[7px] mx-[2px] lg:m-[7px] flex items-center justify-self-auto  flex-col bg-white dark:bg-dark pb-[5px] rounded-lg w-[150px] md:w-52 flex-grow max-w-[230px] shadow-sm dark:shadow-black/40">
      <div className="w-[95%] mt-[2%] relative">
        <div
          onClick={() => router.push(`/product/${slug}`)}
          className="overflow-hidden rounded-lg"
        >
          <img
            src={image?.url}
            alt=""
            className="relative h-36 w-full md:w-full object-cover rounded-lg hover:scale-125
             transition-all duration-300 ease "
          />
        </div>
        <button
          className="absolute top-[5px] right-[5px] w-[25px] h-[25px] rounded-lg m-[5px] bg-slate-100 dark:bg-neutral-800 flex items-center justify-center"
          onClick={() => handleFavorite()}
        >
          {isFavouriteCard ? (
            <Trash size={20} className="text-dark dark:text-white" />
          ) : (
            <Heart
              size={20}
              variant={favorite ? "Bold" : "Outline"}
              className="text-dark dark:text-white"
            />
          )}
        </button>
        {discount && (
          <button className="absolute top-[5px] left-[5px] w-[40px] h-[25px] rounded-lg m-[5px] bg-slate-100 dark:bg-neutral-800 flex items-center justify-center text-base font-semibold text-dark dark:text-white">
            -{discount}
          </button>
        )}
      </div>
      <div className="w-[95%]">
        <p
          onClick={() => router.push(`/product/${slug}`)}
          className="text-[1rem] pl-[5px] font-[500] text-black dark:text-white"
        >
          {truncate(title, 17)}
        </p>

        <div onClick={() => router.push(`/product/${slug}`)} className="">
          <p className="text-[1rem] pl-[5px] font-[500] text-primary">
            {currency.symbol}
            {price.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center justify-between mr-1">
          {stock === 0 ? (
            <div className="flex pl-[5px] my-[5px] ">
              <p className="text-red-600 font-medium">Out of stock</p>
            </div>
          ) : (
            <div className="flex pl-[5px] my-[5px]">
              {product?.quantity && (
                <button
                  className={`flex items-center justify-center h-[25px] w-[25px] rounded-lg dark:bg-primary/60 bg-primary/30`}
                  onClick={decrement}
                >
                  <Minus size={25} className="text-white" />
                </button>
              )}

              {product?.quantity && (
                <div
                  className={`flex items-center justify-center h-[25px] w-[25px] rounded-lg`}
                >
                  <p className="text-black dark:text-white">
                    {product?.quantity ?? 0}
                  </p>
                </div>
              )}

              <button
                className={`flex items-center justify-center h-[25px] w-[25px] rounded-lg bg-primary`}
                onClick={increment}
              >
                <Add size={25} className="text-white" />
              </button>
            </div>
          )}

          <div className="group relative hidden md:inline hover:z-50">
            <button
              className={`flex items-center justify-center h-[25px] w-[25px] rounded-lg rotate-180`}
            >
              <InfoCircle size={25} className="text-gray-500" />
            </button>

            <div className="absolute w-48 max-h-[100px] overflow-y-scroll top-1 py-[3px] scrollbar-hide overflow-scroll px-[5px] right-1 z-50 rounded-lg bg-neutral-800 scale-0 group-hover:scale-100 transition-all duration-300 ease shadow-lg">
              <p className="text-white text-[0.8rem]">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
