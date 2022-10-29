import { gql, useMutation, useQuery } from "@apollo/client";
import { MessageText1 } from "iconsax-react";
import { FormEvent, useState } from "react";
import { IoCloseCircle, IoSearch } from "react-icons/io5";
import { useSelector } from "react-redux";
import Avatar from "../../components/Avatar";

const ReviewMutation = gql`
  mutation CreateReview($input: ReviewInput!) {
    createReview(input: $input) {
      msg
    }
  }
`;

const ReviewQuery = gql`
  query Reviews($productId: ID!) {
    reviews(productId: $productId) {
      name
      message
      photoUrl
      userId
    }
  }
`;
const ReviewCard = ({ productId }: { productId: string }) => {
  const [input, setInput] = useState("");

  const { user } = useSelector((store: any) => store.user);

  const { data, refetch } = useQuery(ReviewQuery, {
    variables: { productId },
    onCompleted: (data) => console.log(data),
    onError: (err) => console.table(err),
  });

  const [createReview] = useMutation(ReviewMutation, {
    variables: {
      input: {
        name: user?.name,
        productId,
        photoUrl: user?.photoUrl,
        message: input,
      },
    },
    onCompleted: () => {
      setInput("");
      refetch();
    },
    onError: (e) => console.log(e),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createReview({
      variables: {
        input: {
          name: user?.name,
          productId,
          photoUrl: user?.photoUrl,
          message: input,
        },
      },
    });
  };

  return (
    <div className="w-[95%] md:w-[80%] mt-[10px] dark:bg-dark dark:shadow-black/30 bg-white p-[8px]  shadow-sm rounded-lg">
      <p className="py-[8px] pl-[15px] pr-[8px] text-[1rem] dark:text-white text-black font-[600]">
        Reviews
      </p>

      {data?.reviews?.length > 0 ? (
        <div className="py-[8px] pl-[15px] pr-[8px] max-h-[300px] overflow-y-scroll">
          {(data?.reviews as any)?.map((review: any, index: number) => (
            <Card key={index} {...review} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center m-2">
          <MessageText1
            size={50}
            className="text-5xl text-neutral-700 dark:text-neutral-400"
          />
          <p className="text-black dark:text-white text-lg">No Review yet!</p>
        </div>
      )}

      {user && (
        <form
          onSubmit={handleSubmit}
          className={` pl-[15px] py-[8px] flex items-center transition-all duration-300 ease`}
        >
          <div className="bg-slate-100 rounded-lg flex-[0.8] flex items-center dark:bg-neutral-800 py-[5px] px-[10px]">
            <input
              type="text"
              placeholder="Write comment"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 outline-0 border-0 bg-transparent dark:text-slate-100 placeholder:dark:text-slate-100/50 "
            />

            {input && (
              <IoCloseCircle
                onClick={() => setInput("")}
                className="text-slate-500 text-[1.2rem] dark:text-slate-100/50 "
              />
            )}
          </div>

          <button
            type="submit"
            className="py-[5px] px-[10px] text-md font-medium disabled:text-neutral-700 disabled:dark:text-neutral-400 text-primary"
            disabled={input.length < 1}
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
};
const Card = ({ photoURL, name, message }: any) => {
  return (
    <div className="my-2">
      <div className="flex items-center m-2 mb-0">
        <Avatar src={photoURL} alt="" className="h-[30px] w-[30px]" />
        <p className="p-2 text-black dark:text-white font-medium">{name}</p>
      </div>
      <p className="ml-12 mb-2 text-neutral-700 dark:text-neutral-400">
        {message}
      </p>
    </div>
  );
};

export default ReviewCard;
