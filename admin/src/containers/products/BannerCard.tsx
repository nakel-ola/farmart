import { gql, useMutation } from "@apollo/client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import InputCard from "../../components/InputCard";
import LoadingCard from "../../components/LoadingCard";
import PopupTemplate from "../../components/PopupTemplate";
import { remove, selectDialog } from "../../redux/features/dialogSlice";
import ImageCard from "./ImageCard";

const CreateBanner = gql`
  mutation CreateBanner($input: CreateBannerInput!) {
    createBanner(input: $input) {
      msg
    }
  }
`;
const EditBanner = gql`
  mutation EditBanner($input: EditBannerInput!) {
    editBanner(input: $input) {
      msg
    }
  }
`;

const formatForm = (form: any): FormType => {
  const { id, title, description, image, link } = form;
  return {
    title,
    description,
    image,
    link,
  };
};

type FormType = {
  image: File | null;
  title: string;
  description: string;
  link: string;
};

const validate = (form: FormType) => {
  const { image, description, link, title } = form;

  if (image && description.length > 0 && title.length > 0) {
    return false;
  }

  return true;
};

const BannerCard = ({ func }: { func: any }) => {
  const dispatch = useDispatch();
  const dialog = useSelector(selectDialog);
  const [loading, setLoading] = useState(false);

  let data = dialog.banner?.data;

  const [form, setForm] = useState<FormType>(
    data
      ? formatForm(data)
      : {
          image: null,
          title: "",
          description: "",
          link: "",
        }
  );

  const [createBanner] = useMutation(CreateBanner);
  const [editBanner] = useMutation(EditBanner);

  let close = () => dispatch(remove({ type: "banner" }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const onCompleted = (data: any) => {
      func?.();
      dispatch(remove({ type: "banner" }));
      setLoading(false);
    };

    const onError = (err: any) => {
      console.error(err);
      setLoading(false);
    };

    if (data) {
      await editBanner({
        variables: {
          input: {
            id: data.id,
            image: form.image,
            title: form.title,
            description: form.description,
            link: form.link,
          },
        },
        onCompleted,
        onError,
      });
    } else {
      await createBanner({
        variables: {
          input: {
            image: form.image,
            title: form.title,
            description: form.description,
            link: form.link,
          },
        },
        onCompleted,
        onError,
      });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <PopupTemplate
      title={data ? "Edit banner" : "Create banner"}
      onOutsideClick={close}
      showEditButton={false}
    >
      {!loading ? (
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
            image={data ? ({ name: data.image } as any) : form.image}
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
              className="bg-slate-100 dark:bg-neutral-800 text-black dark:text-white mx-2"
              onClick={close}
            >
              Cancel
            </Button>
            <Button
              disabled={validate(form)}
              type="submit"
              className="bg-primary text-white mx-2"
            >
              {data ? "Save Change" : "Create"}
            </Button>
          </div>
        </form>
      ) : (
        <LoadingCard title={data ? "Saving banner" : "Creating banner"} />
      )}
    </PopupTemplate>
  );
};

export default BannerCard;
