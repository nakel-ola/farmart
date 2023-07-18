import { gql, useMutation } from "@apollo/client";
import { ChangeEvent, FormEvent, useState } from "react";
import Button from "../../components/Button";
import InputCard from "../../components/InputCard";
import LoadingCard from "../../components/LoadingCard";
import PopupTemplate from "../../components/PopupTemplate";
import StarRating from "../../components/StarRating";
import Textarea from "../../components/Textarea";
import { useSession } from "next-auth/react";

interface Props {
  productId: string;
  func?(): void;
  onClose?(): void;
}

const ReviewMutation = gql`
  mutation CreateReview($input: ReviewInput!) {
    createReview(input: $input) {
      message
    }
  }
`;
const CreateReviewCard: React.FC<Props> = (props) => {
  const { productId, func,onClose } = props;

  const { data } = useSession()

  const user = data?.user;

  const [form, setForm] = useState({
    title: "",
    message: "",
    rating: 0,
  });

  const [createReview, { loading }] = useMutation(ReviewMutation);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const input = {
      name: user?.name,
      productId,
      title: form.title,
      message: form.message,
      rating: form.rating,
    };

    createReview({
      variables: { input },
      onCompleted: (data) => {
        close();
        func?.();
        console.log(data);
      },
      onError: (data) => console.table(data),
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setForm({ ...form, [target.name]: target.value });
  };

  return (
    <PopupTemplate
      title={`Review & Rating`}
      className=""
      onOutsideClick={onClose}
    >
      {!loading ? (
        <form
          onSubmit={handleSubmit}
          className="py-[10px] grid place-items-center"
        >
          <InputCard
            title=""
            placeholder="Enter a title"
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
          />
          <Textarea
            title=""
            placeholder="Enter a review"
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
          />

          <div className="w-[80%] py-2">
            <p className="">How would you rate this products ?</p>
            <StarRating
              value={form.rating - 1}
              onClick={(value: number) =>
                setForm({ ...form, rating: value + 1 })
              }
            />
          </div>

          <div className="flex items-center justify-center mt-5">
            <Button
              type="button"
              className="bg-slate-100 dark:bg-neutral-800 text-black dark:text-white mx-2"
              onClick={close}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-white mx-2">
              Submit
            </Button>
          </div>
        </form>
      ) : (
        <LoadingCard title="Creating review" />
      )}
    </PopupTemplate>
  );
};

export default CreateReviewCard;
