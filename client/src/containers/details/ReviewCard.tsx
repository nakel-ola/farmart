import { gql, useQuery } from "@apollo/client";
import { MessageText1, Star1 } from "iconsax-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RatingType, ReviewType } from "../../../typing";
import CardTemplate from "../../components/CardTemplate";
import Divider from "../../components/Divider";
import calculateRating, {
  RatingReturnValue,
} from "../../helper/calculateRating";
import { add } from "../../redux/features/dialogSlice";

const ReviewQuery = gql`
  query Reviews($productId: ID!) {
    reviews(productId: $productId) {
      name
      message
      rating
      title
      userId
    }
  }
`;

interface Props {
  productId: string;
  rating: Array<RatingType>;
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>
}
const ReviewCard = ({ productId, rating,reload,setReload }: Props) => {
  const dispatch = useDispatch();

  const { user } = useSelector((store: any) => store.user);

  const { data, refetch } = useQuery(ReviewQuery, {
    variables: { productId },
    onCompleted: (data) => console.log(data),
    onError: (err) => console.table(err),
  });

  useEffect(() => {
    if (reload) {
      refetch({ productId });
      setReload(false);
    }
  }, [productId, refetch, reload, setReload]);

  const newRating = calculateRating(rating);

  return (
    <CardTemplate
      title="Rating & Reviews"
      className="mt-8 lg:mb-0 mb-[10px]"
      editTitle="Write a review"
      showEditButton={!!user}
      onEditClick={() =>
        dispatch(add({ type: "review", data: null, open: true }))
      }
    >
      <div className="max-h-[500px] overflow-y-scroll">
        <div className="flex mx-2 flex-col">
          {newRating.total > 0 || data?.reviews?.length > 0 ? (
            <>
              <RatingCard rating={newRating} />
              <Divider />
              <div className="pb-2 pl-[15px] pr-[8px]">
                {(data?.reviews as Array<ReviewType>)?.map(
                  (review: any, index: number) => (
                    <>
                      <Card key={index} {...review} />
                      {data?.reviews.length -1 !== index && <Divider />}
                    </>
                  )
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center m-2 my-8 w-full">
              <MessageText1
                size={100}
                className="text-5xl text-neutral-700 dark:text-neutral-400"
              />
              <p className="text-neutral-700 dark:text-neutral-400 text-lg mt-1 font-semibold">
                No Review yet!
              </p>
            </div>
          )}
        </div>
      </div>
    </CardTemplate>
  );
};
const Card = ({ name, message, rating, title }: ReviewType) => {
  return (
    <div className="my-2">
      <h1 className="font-medium text-xl text-black dark:text-white">
        {title}
      </h1>
      <span className="flex items-center">
        {Array(rating)
          .fill(0)
          .map((_, i) => (
            <Star1
              key={i}
              size={20}
              variant="Bold"
              className="text-[#f8b808] text-[20px]"
            />
          ))}
        {Array(5 - rating)
          .fill(0)
          .map((_, i) => (
            <Star1
              key={i}
              size={20}
              variant="Bold"
              className="text-[#bdbdbd] text-[20px]"
            />
          ))}
      </span>
      <p className="text-black dark:text-white">{message}</p>
    </div>
  );
};

const progress = (total: number, value: number) => {
  return (value / total) * 100;
};
interface RatingProps {
  rating: RatingReturnValue;
}

const RatingCard = (props: RatingProps) => {
  const {
    rating: { average, total, ratings },
  } = props;
  return (
    <div className="w-[95%] m-2">
      <div className="flex items-center w-full">
        <div className="w-fit mx-3 h-fit rounded-lg flex items-center justify-center flex-col">
          <h1 className="text-yellow text-6xl font-bold my-2">{average}</h1>
          <p className="my-2 text-lg text-black dark:text-white">
            {total} ratings
          </p>
        </div>
        <div className="">
          {ratings.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="flex items-center flex-1">
                <p className="px-2 text-sm font-semibold text-black dark:text-white">
                  {item.name}
                </p>
                <span className="">
                  <Star1
                    size={15}
                    variant="Bold"
                    className="text-yellow text-[20px]"
                  />
                </span>

                <p className="text-neutral-600 dark:text-neutral-400 mx-2">
                  ({item.value})
                </p>
              </div>

              <span className="w-[150px] rounded-full h-2 bg-slate-100 dark:bg-neutral-800 flex overflow-hidden">
                <span
                  className="bg-yellow h-full rounded-full"
                  style={{
                    width: progress(total, item.value) + "px",
                  }}
                ></span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
