import { gql, useMutation } from "@apollo/client";
import React, {
    ChangeEvent,
    FormEvent,
    ReactNode,
    useEffect,
    useState
} from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { CreateProductForm, Currency, Image } from "../../../typing";
import Button from "../../components/Button";
import InputCard from "../../components/InputCard";
import InputDropdown from "../../components/InputDropdown";
import PopupTemplate from "../../components/PopupTemplate";
import { selectCatagory } from "../../redux/features/categorySlice";
import { remove, selectDialog } from "../../redux/features/dialogSlice";
import CurrencyFormCard from "./CurrencyFormCard";
import ImageCard from "./ImageCard";
import Textarea from "./Textarea";

const CreateProductMutation = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      msg
    }
  }
`;
const ModifyProductMutation = gql`
  mutation ModifyProduct($input: ModifyProductInput!) {
    modifyProduct(input: $input) {
      msg
    }
  }
`;

const verify = (data: CreateProductForm): boolean => {
  const { title, price, currency, category, stock, image, description } = data;

  if (
    title.length > 3 &&
    price &&
    price > 0 &&
    category.length > 3 &&
    stock &&
    description.length > 5 &&
    currency &&
    image
  ) {
    return false;
  }

  return true;
};

const modifyVerify = (data: CreateProductForm, edit: any): boolean => {
  const { title, price, currency, category, stock, image, description } = data;

  if (
    title !== edit?.product?.title ||
    Number(price) !== Number(edit?.product?.price) ||
    category !== edit?.product?.category ||
    description !== edit?.product?.description ||
    Number(stock) !== Number(edit?.product?.stock) ||
    currency?.code !== edit?.product?.currency?.code ||
    image?.url !== edit?.product?.image?.url
  ) {
    return false;
  }

  return true;
};

const generateSlug = (text: string): string => {
  const array = text.split(" ").map((t) => t.toLowerCase());
  const newText = array.join("-");
  return newText;
};

const Popup = ({ func }: { func?: (value?: any) => void }) => {
  const { edit } = useSelector(selectDialog);
  const category = useSelector(selectCatagory);
  const dispatch = useDispatch();
  const [form, setForm] = useState<CreateProductForm>({
    title: "",
    category: "",
    description: "",
    image: null,
    price: undefined,
    currency: null,
    stock: undefined,
  });

  const [createProduct] = useMutation(CreateProductMutation);

  const [modifyProduct] = useMutation(ModifyProductMutation);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setForm({ ...form, [target.name]: target.value });
  };

  useEffect(() => {
    if (edit?.data) setForm(edit?.data);
  }, [edit?.data]);

  const close = () => dispatch(remove({ type: "edit" }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    let loginToast = toast.loading("Loading......");

    if (!edit?.data) {
      createProduct({
        variables: {
          input: {
            title: form.title,
            category: form.category.toLowerCase(),
            description: form.description,
            price: Number(form.price),
            stock: Number(form.stock),
            currency: form.currency,
            slug: generateSlug(form.title),
            image: form.image,
          },
        },
        onCompleted: (data) => {
          toast.success("Created Successfully", { id: loginToast });
          close();
        },
        onError: (data) => {
          toast.error("There was an error creating product", {
            id: loginToast,
          });
          console.table(data);
        },
      });
    } else {
      let isFile = form?.image?.url ? false : true;
      modifyProduct({
        variables: {
          input: {
            id: edit?.data.id,
            slug: generateSlug(form.title),
            category: form.category,
            description: form.description,
            image: isFile
              ? null
              : {
                  name: form.image?.name,
                  url: form.image?.url,
                },
            imageUpload: isFile ? form.image : null,
            price: Number(form.price),
            stock: Number(form.stock),
            currency: {
              name: form?.currency!.name,
              symbolNative: form?.currency!.symbolNative,
              decimalDigits: form?.currency!.decimalDigits,
              rounding: form?.currency!.rounding,
              code: form?.currency!.code,
              namePlural: form?.currency!.namePlural,
              symbol: form?.currency!.symbol,
            },
            title: form.title,
          },
        },
        onCompleted: () => {
          toast.success("Edited Successfully", { id: loginToast });
          close();
          func?.();
        },
        onError: (data) => {
          toast.error("There was an error editing product", {
            id: loginToast,
          });
          console.table(data);
        },
      });
    }
  };

  return (
    <PopupTemplate title="Edit your product" onOutsideClick={close}>
      <form
        onSubmit={handleSubmit}
        className="pb-[10px] grid place-items-center"
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
            prefix={form.currency?.symbol}
            isPrice
            type="number"
            value={form.price!}
            onChange={handleChange}
          />
          <CurrencyFormCard
            title="Currency"
            id="currency"
            name="currency"
            type="text"
            currency={form.currency}
            onChange={(result: Currency) =>
              setForm({
                ...form,
                currency: result,
              })
            }
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
            value={form.stock!}
            onChange={handleChange}
          />
        </Wrapper>
        <ImageCard
          title="Image"
          image={form.image}
          onChange={(result: Image) => {
            setForm({ ...form, image: result });
          }}
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
            className="bg-slate-100 dark:bg-neutral-800 text-black dark:text-white"
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={edit?.data ? modifyVerify(form, edit) : verify(form)}
            className="bg-primary text-white"
          >
            {edit?.data ? "Save Change" : "Create"}
          </Button>
        </div>
      </form>
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
