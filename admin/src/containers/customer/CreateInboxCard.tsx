import { gql, useMutation } from "@apollo/client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "../../components/Button";
import InputCard from "../../components/InputCard";
import LoadingCard from "../../components/LoadingCard";
import PopupTemplate from "../../components/PopupTemplate";
import { remove } from "../../redux/features/dialogSlice";
import Textarea from "../products/Textarea";

type FormType = {
  title: string;
  description: string;
};

const validate = (form: FormType): boolean => {
  const { title, description } = form;
  if (title && description) {
    return false;
  }
  return true;
};

const CreateQuery = gql`
  mutation CreateInbox($input: CreateInboxInput!) {
    createInbox(input: $input) {
      msg
    }
  }
`;

const CreateInboxCard = ({
  func,
  customerId,
}: {
  func: any;
  customerId: string;
}) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState<FormType>({
    title: "",
    description: "",
  });

  const [createInbox, { loading }] = useMutation(CreateQuery);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setForm({ ...form, [target.name]: target.value });
  };

  const close = () => dispatch(remove({ type: "inbox" }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await createInbox({
      variables: {
        input: {
          userId: customerId,
          description: form.description,
          title: form.title,
        },
      },
      onCompleted: () => {
        func?.();
        dispatch(remove({ type: "inbox" }));
      },
      onError: (err) => console.table(err),
    });
  };

  return (
    <PopupTemplate title="Create inbox" onOutsideClick={close}>
      {!loading ? (
        <form
          onSubmit={handleSubmit}
          className="pb-[10px] grid place-items-center"
        >
          <InputCard
            title="Title"
            id="title"
            name="title"
            type="string"
            value={form.title}
            onChange={handleChange}
          />
          <Textarea
            title="Description"
            id="description"
            name="description"
            type="string"
            value={form.description}
            onChange={handleChange}
          />

          <div className="flex items-center justify-center mt-5">
            <Button
              type="button"
              className="bg-slate-100 dark:bg-neutral-800 text-black dark:text-white mx-2"
              onClick={close}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={validate(form)}
              className="text-white disabled:opacity-40 bg-primary mx-2"
            >
              Create
            </Button>
          </div>
        </form>
      ) : (
        <LoadingCard title="Sending inbox" />
      )}
    </PopupTemplate>
  );
};

export default CreateInboxCard;
