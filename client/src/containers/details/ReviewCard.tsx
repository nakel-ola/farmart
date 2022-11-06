import { gql, useMutation, useQuery } from "@apollo/client";
import { MessageText1, Star1 } from "iconsax-react";
import React, { FormEvent, useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { useSelector } from "react-redux";
import Avatar from "../../components/Avatar";
import CardTemplate from "../../components/CardTemplate";

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
    <CardTemplate title="Rating & Reviews" className="mt-[10px] lg:mb-0 mb-[10px] ">
      <div className="flex mx-2 flex-col md:flex-row">
        {data?.reviews?.length > 0 ? (
          <>
            <RatingCard />
            <div className="py-[8px] pl-[15px] pr-[8px] max-h-[300px] overflow-y-scroll">
              {(data?.reviews as any)?.map((review: any, index: number) => (
                <Card key={index} {...review} />
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
    </CardTemplate>
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

const progress = (total: number, value: number) => {
  return (value / total) * 100;
};

const rating = (v: number[]): number => {
  v = v.reverse();
  // AR = 1*a+2*b+3*c+4*d+5*e/(R)
  let total = v.reduce((amount, item) => item + amount, 0);
  let n = v.reduce((amount, item, index) => item * (index + 1) + amount, 0);
  let ar = n / total;
  return Number(ar.toFixed(1));
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

  const newRating = rating(items.map((item) => item.value));
  return (
    <div className="flex justify-center w-[95%] md:w-[35%] flex-col m-2">
      <div className="w-full h-[180px] bg-slate-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center flex-col">
        <h1 className="text-yellow text-3xl font-bold my-2">{newRating} / 5</h1>

        <div className="flex">
          {Array(Math.floor(newRating))
            .fill(0)
            .map((_, i) => (
              <Star1
                key={i}
                size={25}
                variant="Bold"
                className="text-[#f8b808] text-[20px]"
              />
            ))}
          {Array(Math.floor(newRating) && 5 - Math.floor(newRating))
            .fill(0)
            .map((_, i) => (
              <Star1
                key={i}
                size={25}
                variant="Bold"
                className="text-[#bdbdbd] text-[20px]"
              />
            ))}
        </div>

        <p className="my-2 text-lg text-black dark:text-white">
          {total} verified ratings
        </p>
      </div>
      <div className="my-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="flex items-center flex-1">
              <p className="px-2 text-lg font-semibold text-black dark:text-white">
                {item.name}
              </p>
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

            <span className="w-[150px] rounded-full h-3 bg-slate-100 dark:bg-neutral-800 flex overflow-hidden">
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
  );
};

export default ReviewCard;

// mongodb+srv://Olamilekan:0cWd7OZvKSHVV5qh@cluster0.81q6hhf.mongodb.net/?retryWrites=true&w=majority
