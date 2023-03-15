import {
  ApolloQueryResult,
  OperationVariables,
  gql,
  useMutation,
  useQuery,
} from "@apollo/client";
import { AnimatePresence } from "framer-motion";
import { MessageText1, Trash } from "iconsax-react";
import React, { useState } from "react";
import { ReviewType } from "../../../typing";
import Avatar from "../../components/Avatar";
import CardTemplate from "../../components/CardTemplate";
import DeleteCard from "../../components/DeleteCard";
import { Divider } from "../../components/Divider";
import StarRating from "../../components/StarRating";

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

const DeleteQuery = gql`
  mutation DeleteReview($input: DeleteReviewInput!) {
    deleteReview(input: $input) {
      message
    }
  }
`;

const ReviewCard = ({
  productId,
  canEdit,
}: {
  productId: string;
  canEdit: boolean;
}) => {
  const { data, refetch } = useQuery<{ reviews: ReviewType[] }>(ReviewQuery, {
    variables: { productId },
    onCompleted: (data) => console.log(data),
    onError: (err) => console.table(err),
  });

  return (
    <CardTemplate title="Reviews" className="pb-2 my-8">
      {data && data?.reviews?.length > 0 ? (
        <div className="py-[8px] pl-[15px] pr-[8px] max-h-[300px] overflow-y-scroll">
          {(data?.reviews as any)?.map((review: ReviewType, index: number) => (
            <div key={index}>
              <Card
                {...review}
                refetch={() => refetch({ productId })}
                productId={productId}
                canEdit={canEdit}
              />
              {index !== data.reviews.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center m-2 my-8">
          <MessageText1
            size={50}
            className="text-5xl text-neutral-700 dark:text-neutral-400"
          />
          <p className="text-black dark:text-white text-lg">No Review yet!</p>
        </div>
      )}
    </CardTemplate>
  );
};

interface CardProps extends ReviewType {
  refetch(): void;
  productId: string;
  canEdit: boolean;
}


const Card = (props: CardProps) => {
  const { message, refetch, productId, id, canEdit,title,rating,userId } = props;
  const [toggle, setToggle] = useState(false);
  const [deleteReview, { loading }] = useMutation(DeleteQuery);

  const handleDelete = async () => {
    await deleteReview({
      variables: {
        input: {
          productId,
          reviewId: id,
        },
      },
      onCompleted: (data) => {
        refetch();
      },
      onError: (err) => {
        console.table(err);
      },
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

        {canEdit && (
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
        {toggle && (
          <DeleteCard
            message="Are you sure you want to delete product ?"
            onClose={() => setToggle(false)}
            onDelete={handleDelete}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ReviewCard;
