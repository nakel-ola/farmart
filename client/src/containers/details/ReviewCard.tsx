import { gql, useMutation, useQuery } from "@apollo/client";
import { AnimatePresence } from "framer-motion";
import { MessageText1, Star1, Trash } from "iconsax-react";
import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { RatingType, ReviewType } from "../../../typing";
import CardTemplate from "../../components/CardTemplate";
import DeleteCard from "../../components/DeleteCard";
import Divider from "../../components/Divider";
import StarRating from "../../components/StarRating";
import calculateRating, {
  RatingReturnValue,
} from "../../helper/calculateRating";
import { selectUser } from "../../redux/features/userSlice";
import { ReviewResponse } from "../../types/graphql.types";
import CreateReviewCard from "./CreateReviewCard";

const ReviewQuery = gql`
  query Reviews($productId: ID!) {
    reviews(productId: $productId) {
      id
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
  refetch(): void;
}

const ReviewCard: React.FC<Props> = (props) => {
  const { productId, rating, refetch: productRefetch } = props;

  const user = useSelector(selectUser);
  const [toggle, setToggle] = useState(false);

  const { data, refetch } = useQuery<ReviewResponse>(ReviewQuery, {
    variables: { productId },
    onError: (err) => console.table(err),
  });

  const newRating = calculateRating(rating);

  return (
    <CardTemplate
      title="Rating & Reviews"
      className="mt-8 lg:mb-0 mb-[10px]"
      editTitle="Write a review"
      showEditButton={!!user}
      onEditClick={() => setToggle(true)}
    >
      <div className="max-h-[500px] overflow-y-scroll">
        <div className="flex mx-2 flex-col">
          {newRating.total > 0 || (data && data?.reviews?.length > 0) ? (
            <>
              <RatingCard rating={newRating} />
              {data && data?.reviews.length > 0 && <Divider />}

              <div className="pb-2 pl-[15px] pr-[8px]">
                {data?.reviews?.map((review: any, index: number) => (
                  <Fragment key={index}>
                    <Card
                      {...review}
                      productId={productId}
                      refetch={() => refetch({ productId })}
                    />
                    {data?.reviews.length - 1 !== index && <Divider />}
                  </Fragment>
                ))}
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

      <AnimatePresence>
        {toggle && (
          <CreateReviewCard
            productId={productId}
            func={() => {
              productRefetch();
              refetch({ productId });
            }}
            onClose={() => setToggle(false)}
          />
        )}
      </AnimatePresence>
    </CardTemplate>
  );
};

const DeleteReview = gql`
  mutation DeleteReview($input: DeleteReviewInput!) {
    deleteReview(input: $input) {
      message
    }
  }
`;

interface CardProps extends ReviewType {
  refetch(): void;
  productId: string;
}

const Card: React.FC<CardProps> = (props) => {
  const { message, rating, title, userId, id, productId, refetch } = props;
  const user = useSelector(selectUser);
  const [toggle, setToggle] = useState(false);

  const [deleteReview, { loading }] = useMutation(DeleteReview);

  const onClose = () => setToggle(false);

  const handleDelete = async () => {
    await deleteReview({
      variables: { input: { productId, reviewId: id } },
      onCompleted: (data) => {
        refetch();
        onClose();
      },
      onError: (err) => console.table(err),
    });
  };

  return (
    <>
      <div className="my-2 flex items-start justify-between">
        <div className="">
          <h1 className="font-medium text-xl text-black dark:text-white">
            {title}
          </h1>
          <StarRating
            value={rating - 1}
            size={20}
            spacing={0}
            variant="Bold"
            color="#bdbdbd"
            activeColor="#f8b808"
            disabled
          />
          <p className="text-black dark:text-white">{message}</p>
        </div>

        {user && user.id === userId && (
          <button
            type="button"
            className="flex items-center justify-center h-[35px] w-[35px] hover:scale-105 active:scale-95 bg-red-600/10 rounded-full"
            onClick={() => setToggle(true)}
          >
            <Trash
              size={25}
              variant="Bold"
              className="text-red-600  text-[25px]"
            />
          </button>
        )}
      </div>

      <AnimatePresence>
        {toggle && user && user.id === userId && (
          <DeleteCard
            onClose={onClose}
            onDelete={handleDelete}
            loading={loading}
            message="Are you sure you want to delete this review ?"
          />
        )}
      </AnimatePresence>
    </>
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
