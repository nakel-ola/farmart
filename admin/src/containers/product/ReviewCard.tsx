import {
  ApolloQueryResult,
  gql,
  OperationVariables,
  useMutation,
  useQuery,
} from "@apollo/client";
import { MessageText1, Trash } from "iconsax-react";
import React from "react";
import { ReviewType } from "../../../typing";
import Avatar from "../../components/Avatar";
import { Divider } from "../../components/Divider";

const ReviewQuery = gql`
  query Reviews($productId: ID!) {
    reviews(productId: $productId) {
      id
      name
      message
      photoUrl
      userId
    }
  }
`;

const DeleteQuery = gql`
  mutation DeleteReview($input: DeleteReviewInput!) {
    deleteReview(input: $input) {
      msg
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
    onError: (err) => console.table(err),
  });

  return (
    <div className="w-[95%] md:w-[80%] rounded-lg dark:bg-dark dark:shadow-black/30 bg-white shadow-sm overflow-hidden pb-2 my-8">
      <div className="w-full border-b-[1px] border-b-neutral-100 dark:border-b-neutral-800 flex items-center justify-between">
        <p className="py-[8px] pl-[15px] text-[1.2rem] text-black font-[600] dark:text-white">
          Reviews
        </p>
      </div>

      {data && data?.reviews?.length > 0 ? (
        <div className="py-[8px] pl-[15px] pr-[8px] max-h-[300px] overflow-y-scroll">
          {(data?.reviews as any)?.map((review: ReviewType, index: number) => (
            <div key={index}>
              <Card
                {...review}
                refetch={refetch}
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
    </div>
  );
};

interface CardType extends ReviewType {
  refetch: (variables?: Partial<OperationVariables> | undefined) => Promise<
    ApolloQueryResult<{
      reviews: ReviewType[];
    }>
  >;
  productId: string;
  canEdit: boolean;
}

const Card = ({
  photoUrl,
  name,
  message,
  refetch,
  productId,
  id,
  canEdit,
}: CardType) => {
  const [deleteReview] = useMutation(DeleteQuery);

  const handleDelete = async () => {
    await deleteReview({
      variables: {
        input: {
          productId,
          reviewId: id,
        },
      },
      onCompleted: (data) => {
        refetch({ productId });
      },
      onError: (err) => {
        console.table(err);
      },
    });
  };

  return (
    <div className="my-2">
      <div className="flex items-center justify-between m-2 mb-0">
        <div className="flex items-center">
          <Avatar src={photoUrl} alt="" className="h-[40px] w-[40px]" />
          <p className="p-2 py-0 text-black dark:text-white font-medium">
            {name}
          </p>
        </div>
        {canEdit && (
          <button
            className={`px-2 mx-2 font-medium rounded-full pt-[2px] text-red-600 hover:bg-red-600/10`}
            onClick={handleDelete}
          >
            <Trash size={20} />
          </button>
        )}
      </div>
      <p className="ml-14 mb-2 text-neutral-700 dark:text-neutral-400">
        {message}
      </p>
    </div>
  );
};

export default ReviewCard;
