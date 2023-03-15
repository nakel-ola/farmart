import { gql, useMutation } from "@apollo/client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { BannerType, UploadResponse } from "../../../typing";
import Button from "../../components/Button";
import InputCard from "../../components/InputCard";
import LoadingCard from "../../components/LoadingCard";
import PopupTemplate from "../../components/PopupTemplate";
import { UploadMutation } from "../account/ImageCard";
import ImageCard from "./ImageCard";

const CreateBanner = gql`
  mutation CreateBanner($input: CreateBannerInput!) {
    createBanner(input: $input) {
      message
    }
  }
`;
const EditBanner = gql`
  mutation EditBanner($input: EditBannerInput!) {
    editBanner(input: $input) {
      message
    }
  }
`;

const formatForm = (form: any): FormType => {
  const { id, title, description, image, link } = form;
  return {
    title: title ?? "",
    description: description ?? "",
    image,
    link: link ?? "",
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

  if (image && description.length > 0 && title.length > 0) return false;

  return true;
};

interface Props {
  onClose(): void;
  func(): void;
  data?: BannerType;
}

const BannerCard: React.FC<Props> = ({ func, onClose, data }) => {
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

  const [createBanner, { loading: createLoading }] = useMutation(CreateBanner);
  const [editBanner, { loading: editLoading }] = useMutation(EditBanner);
  const [uploadFile, { loading: uploadLoading }] =
    useMutation<UploadResponse>(UploadMutation);

  const loading = uploadLoading || createLoading || editLoading;

  const upload = async () =>
    new Promise<string>(async (resolve, reject) => {
      if (!form.image) return;
      await uploadFile({
        variables: { file: form.image },
        onCompleted: (data) => resolve(data.uploadFile.url),
        onError: (err) => console.table(err),
      });
    });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const onCompleted = (data: any) => {
      func?.();
      onClose();
    };

    const onError = (err: any) => console.table(err);

    if (data) {
      const url = typeof form?.image !== "string" ? await upload() : form.image;
      await editBanner({
        variables: {
          input: {
            id: data.id,
            image: url,
            title: form.title,
            description: form.description,
            link: form.link,
          },
        },
        onCompleted,
        onError,
      });
    } else {
      const url = await upload();

      if (!url) return;
      await createBanner({
        variables: {
          input: {
            image: url,
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
      onOutsideClick={onClose}
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
            image={form.image}
            onChange={(file: File) => setForm({ ...form, image: file })}
          />

          <InputCard
            title="Link"
            name="link"
            id="link"
            value={form.link}
            onChange={handleChange}
            placeholder="shop link"
          />

          <div className="flex items-center justify-center mt-5">
            <Button
              type="button"
              className="bg-slate-100 dark:bg-neutral-800 text-black dark:text-white mx-2"
              onClick={onClose}
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
