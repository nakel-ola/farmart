import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import React, {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  CreateProductForm,
  ProductType,
  UploadResponse,
} from "../../../typing";
import Button from "../../components/Button";
import InputCard from "../../components/InputCard";
import InputDropdown from "../../components/InputDropdown";
import LoadingCard from "../../components/LoadingCard";
import PopupTemplate from "../../components/PopupTemplate";
import generateSlug from "../../helper/generateSlug";
import { selectCatagory } from "../../redux/features/categorySlice";
import { UploadMutation } from "../account/ImageCard";
import ImageCard from "./ImageCard";
import Textarea from "./Textarea";

const CreateProductMutation = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      message
    }
  }
`;

const UpdateProductMutation = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      message
    }
  }
`;

const verify = (data: CreateProductForm): boolean => {
  const { title, price, category, stock, image, description } = data;

  if (
    title.length > 3 &&
    price &&
    price.length > 0 &&
    category.length > 3 &&
    stock &&
    description.length > 5 &&
    image
  ) {
    return false;
  }

  return true;
};

const modifyVerify = (data: CreateProductForm, prev: any): boolean => {
  const { title, price, discount, category, stock, image, description } = data;

  if (
    title !== prev?.title ||
    Number(price) !== Number(prev?.price) ||
    category !== prev?.category ||
    description !== prev?.description ||
    Number(stock) !== Number(prev?.stock) ||
    discount !== prev?.discount ||
    image !== prev?.image
  )
    return false;

  return true;
};

interface Props {
  func(slug?: string): void;
  onClose(): void;
  data?: any;
}

const toastId = "create-id";

const Popup: React.FC<Props> = ({ func, onClose, data }) => {
  const router = useRouter();
  const category = useSelector(selectCatagory);
  const [form, setForm] = useState<CreateProductForm>({
    title: "",
    category: "",
    description: "",
    image: null,
    price: undefined,
    discount: null,
    stock: undefined,
  });

  const [createProduct, { loading: createLoading }] = useMutation(
    CreateProductMutation
  );

  const [updateProduct, { loading: updateLoading }] = useMutation(
    UpdateProductMutation
  );

  const [uploadFile, { loading: uploadLoading }] =
    useMutation<UploadResponse>(UploadMutation);

  const loading = createLoading || updateLoading || uploadLoading;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setForm({ ...form, [target.name]: target.value });
  };

  const upload = async () =>
    new Promise<string>(async (resolve, reject) => {
      if (!form.image) return;
      await uploadFile({
        variables: { file: form.image },
        onCompleted: (data) => resolve(data.uploadFile.url),
        onError: (err) => {
          console.table(err);
          reject(err);
        }
      });
    });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const onCompleted = (msg: string, slug?: string) => {
    toast.success(msg, { id: toastId });
    onClose();
    func?.(slug);
  };

  const onError = (data: any, msg: string) => {
    toast.error(msg, { id: toastId });
    console.table(data);
  };

  const handleCreate = async () => {
    const url = await upload();
    if (!url) return;

    await createProduct({
      variables: {
        input: {
          title: form.title,
          slug: generateSlug(form.title),
          category: form.category.toLowerCase(),
          description: form.description,
          image: url,
          price: Number(form.price?.split("$")[1]),
          stock: Number(form.stock),
          discount: form.discount,
        },
      },
      onCompleted: () => onCompleted("Created Successfully"),
      onError: (data) => onError(data, "There was an error creating product"),
    });
  };

  const handleUpdate = async () => {
    const url = typeof form?.image !== "string" ? await upload() : form.image;
    const slug = generateSlug(form.title);

    await updateProduct({
      variables: {
        input: {
          id: data.id,
          slug: generateSlug(form.title),
          category: form.category,
          description: form.description,
          image: url,
          price: Number(form.price),
          stock: Number(form.stock),
          discount: form.discount,
          title: form.title,
        },
      },
      onCompleted: () => onCompleted("Edited Successfully", slug),
      onError: (data) => onError(data, "There was an error editing product"),
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    toast.loading("Loading......", { id: toastId });

    if (!data) await handleCreate();
    else await handleUpdate();
  };

  return (
    <PopupTemplate
      title={data ? "Edit your product" : "Create new product"}
      onOutsideClick={onClose}
    >
      {!loading ? (
        <form
          onSubmit={handleSubmit}
          className="pb-[25px] grid place-items-center"
        >
          <InputCard
            title="Name"
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
          />
          <Wrapper>
            <InputCard
              title="Price"
              toggle
              margin
              id="price"
              name="price"
              prefix="$"
              isPrice
              type="number"
              value={form.price! ?? ""}
              onChange={handleChange}
            />
            <InputCard
              title="Discount"
              toggle
              margin
              id="discount"
              name="discount"
              type="number"
              value={form.discount! ?? ""}
              onChange={handleChange}
            />
          </Wrapper>
          <Wrapper>
            <InputDropdown
              list={[...category.map((item: { name: string }) => item.name)]}
              title="Category"
              show
              margin
              id="category"
              name="category"
              type="text"
              value={form.category}
              onChange={(text: string) => setForm({ ...form, category: text })}
            />
            <InputCard
              title="Stock"
              type="number"
              id="stock"
              name="stock"
              toggle
              value={form.stock! ?? ""}
              onChange={handleChange}
            />
          </Wrapper>
          <ImageCard
            title="Image"
            image={form.image}
            onChange={(file: File) => setForm({ ...form, image: file })}
          />
          <Textarea
            title="Description"
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
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
              type="submit"
              disabled={data ? modifyVerify(form, data) : verify(form)}
              className="bg-primary text-white mx-2"
            >
              {data ? "Save Change" : "Create"}
            </Button>
          </div>
        </form>
      ) : (
        <LoadingCard title={data ? "Saving product" : "Creating product"} />
      )}
    </PopupTemplate>
  );
};

export const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex w-[100%] items-center justify-center">
      <div className="w-[80%] flex items-center justify-between">
        {children}
      </div>
    </div>
  );
};

export default Popup;
