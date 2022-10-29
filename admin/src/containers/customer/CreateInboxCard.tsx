import { gql, useMutation } from "@apollo/client";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "../../components/Button";
import InputCard from "../../components/InputCard";
import useOnClickOutside from "../../hooks/useOnClickOutside";
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
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const [form, setForm] = useState<FormType>({
    title: "",
    description: "",
  });

  const [createInbox] = useMutation(CreateQuery);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setForm({ ...form, [target.name]: target.value });
  };

  useOnClickOutside(ref, () => dispatch(remove({ type: "inbox" })));

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
    <div className="fixed top-0 w-full h-full bg-black/70 grid place-items-center z-[99999999]">
      <div
        ref={ref}
        className="w-[350px] bg-white dark:bg-dark rounded-xl shadow "
      >
        <div className="w-full flex items-center justify-between px-[15px] pt-[8px] pb-[15px]">
          <p className="text-lg text-dark dark:text-white"> Create inbox</p>
        </div>

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

          <div className="flex items-center justify-center my-2">
            <Button
              type="button"
              className="bg-slate-100 dark:bg-neutral-800 text-black dark:text-white"
              onClick={() => dispatch(remove({ type: "inbox" }))}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={validate(form)}
              className="text-white disabled:opacity-40 bg-primary"
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInboxCard;
