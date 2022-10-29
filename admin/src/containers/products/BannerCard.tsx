import { from, gql, useMutation } from "@apollo/client";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "../../components/Button";
import InputCard from "../../components/InputCard";
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
  link: string;
};

const BannerCard = ({ func }: { func: any }) => {
  const ref = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const [form, setForm] = useState<FormType>({
    image: null,
    link: "",
  });

  const [createBanner] = useMutation(CreateBanner);

  useOnClickOutside(ref, () => dispatch(remove({ type: "banner" })));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await createBanner({
      variables: {
        input: {
          image: form.image,
          link: form.link
        }
      },
      onCompleted: (data) => {
        console.log(data);
        func?.()
        dispatch(remove({ type: "banner" }))
      }
    });
  };

  return (
    <div className="fixed top-0 w-full h-full bg-black/70 grid place-items-center z-[99999999]">
      <div
        ref={ref}
        className="w-[350px] min-h-[150px] bg-white dark:bg-dark rounded-xl shadow grid place-items-center"
      >
        <div className="flex items-center justify-between w-[90%] my-2">
          <p className="text-lg text-dark dark:text-white font-medium">
            {" "}
            Create banner
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full pb-[10px]">
          <ImageCard title="Image" image={form.image} onChange={(file: File) => setForm({ ...form, image: file})} />

          <InputCard
            title="Url"
            value={form.link}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setForm({ ...form, link: e.target.value })
            }
            placeholder="url when clicked"
          />

          <div className="flex items-center justify-center pt-[10px]">
            <Button
              type="button"
              className="bg-slate-100 dark:bg-neutral-800 text-black dark:text-white"
              onClick={() => dispatch(remove({ type: "banner" }))}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-white">
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BannerCard;
