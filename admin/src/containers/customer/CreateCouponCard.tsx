import { gql, useMutation } from "@apollo/client";
import { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { Discount, UserType } from "../../../typing";
import Button from "../../components/Button";
import InputCard from "../../components/InputCard";
import LoadingCard from "../../components/LoadingCard";
import PopupTemplate from "../../components/PopupTemplate";
import { remove } from "../../redux/features/dialogSlice";
import DiscountCard from "./DiscountCard";

type FormType = {
  discount: Discount | null;
  expiresIn: Date | null;
  description: string;
};

const CreateCoupon = gql`
  mutation CreateCoupon($input: CreateCouponInput!) {
    createCoupon(input: $input) {
      msg
    }
  }
`;

const validate = (form: FormType): boolean => {
  const { discount, expiresIn } = form;

  if (discount && expiresIn) {
    return false;
  }
  return true;
};

const CreateCouponCard = ({ func, data }: { func: any; data: UserType }) => {

  const dispatch = useDispatch();

  const [form, setForm] = useState<FormType>({
    discount: null,
    expiresIn: null,
    description: "",
  });

  const [createCoupon, { loading }] = useMutation(CreateCoupon);

  const close = () => dispatch(remove({ type: "coupon" }));

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setForm({ ...form, [target.name]: target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await createCoupon({
      variables: {
        input: {
          discount: form.discount!.value,
          expiresIn: form.expiresIn,
          description: form.description,
          userId: data.id,
          email: data.email,
        },
      },
      onCompleted: (d) => {
        func?.();
        dispatch(remove({ type: "coupon" }));
      },
      onError: (err) => console.table(err),
    });
  };

  return (
    <PopupTemplate title="Create coupon" onOutsideClick={close}>
      {!loading ? (
        <form
          onSubmit={handleSubmit}
          className="pb-[10px] grid place-items-center"
        >
          <DiscountCard
            title="Discount"
            discount={form.discount}
            onChange={(value: Discount) =>
              setForm({ ...form, discount: value })
            }
          />

          <InputCard
            title="Expires date"
            id="expiresIn"
            name="expiresIn"
            type="date"
            value={form.expiresIn ?? ""}
            onChange={handleChange}
          />
          <InputCard
            title="Description"
            id="description"
            name="description"
            type="string"
            placeholder="Optional"
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
        <LoadingCard title="Creating coupon"/>
      )}
    </PopupTemplate>
  );
};

export default CreateCouponCard;
