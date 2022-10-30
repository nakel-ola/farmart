import { from, gql, useMutation } from "@apollo/client";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "../../components/Button";
import InputCard from "../../components/InputCard";
import PopupTemplate from "../../components/PopupTemplate";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import { remove } from "../../redux/features/dialogSlice";
import ImageCard from "./ImageCard";
const CreateBanner = gql`
  mutation CreateBanner($input: CreateBannerInput!) {
    createBanner(input: $input) {
      msg
    }
  }
`;

type FormType = {
  image: File | null;
  title: string;
  description: string;
  link: string;
};

const BannerCard = ({ func }: { func: any }) => {
  const ref = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const [form, setForm] = useState<FormType>({
    image: null,
    title: "",
    description: "",
    link: "",
  });

  const [createBanner] = useMutation(CreateBanner);

  let close = () => dispatch(remove({ type: "banner" }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await createBanner({
      variables: {
        input: {
          image: form.image,
          title: form.title,
          description: form.description,
          link: form.link,
        },
      },
      onCompleted: (data) => {
        console.log(data);
        func?.();
        dispatch(remove({ type: "banner" }));
      },
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <PopupTemplate title="Create banner" onOutsideClick={close} showEditButton={false}>
      <form onSubmit={handleSubmit} className="w-full pb-[10px]">
        <InputCard
          title="Title"
          name="title"
          id="title"
          value={form.title}
          onChange={handleChange}
        />
        <InputCard
          title="Description"
          name="description"
          id="description"
          value={form.description}
          onChange={handleChange}
        />

        <ImageCard
          title="Image"
          image={form.image}
          onChange={(file: File) => setForm({ ...form, image: file })}
        />

        <InputCard
          title="Link"
          name="link"
          id="link"
          value={form.link}
          onChange={handleChange}
          placeholder="shop link button"
        />

        <div className="flex items-center justify-center mt-5">
          <Button
            type="button"
            className="bg-slate-100 dark:bg-neutral-800 text-black dark:text-white"
            onClick={close}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-primary text-white">
            Create
          </Button>
        </div>
      </form>
    </PopupTemplate>
  );
};

export default BannerCard;
