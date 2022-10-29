import { gql, useMutation } from "@apollo/client";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Discount, UserType } from "../../../typing";
import Button from "../../components/Button";
import InputCard from "../../components/InputCard";
import useOnClickOutside from "../../hooks/useOnClickOutside";
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
  const ref = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const [form, setForm] = useState<FormType>({
    discount: null,
    expiresIn: null,
    description: "",
  });

  const [createCoupon] = useMutation(CreateCoupon);

  useOnClickOutside(ref, () => dispatch(remove({ type: "coupon" })));

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
        dispatch(remove({ type: "coupon" }))
      },
      onError: (err) => console.table(err),
    });
  };

  return (
    <div className="fixed top-0 w-full h-full bg-black/70 grid place-items-center z-[99999999]">
      <div
        ref={ref}
        className="w-[300px] min-h-[150px] bg-white dark:bg-dark rounded-xl shadow grid place-items-center"
      >
        <div className="flex items-center justify-between w-[90%] my-2">
          <p className="text-lg text-dark dark:text-white"> Create coupon</p>
        </div>

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
            toggle
            id="expiresIn"
            name="expiresIn"
            type="date"
            value={form.expiresIn ?? ""}
            onChange={handleChange}
          />
          <InputCard
            title="Description"
            toggle
            id="description"
            name="description"
            type="string"
            placeholder="Optional"
            value={form.description}
            onChange={handleChange}
          />
          <div className="flex items-center justify-center my-2">
            <Button
              type="button"
              className="bg-slate-100 dark:bg-neutral-800 text-black dark:text-white"
              onClick={() => dispatch(remove({ type: "coupon" }))}
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

export default CreateCouponCard;
