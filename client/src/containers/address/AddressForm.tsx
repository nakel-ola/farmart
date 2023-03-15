import { gql, useMutation } from "@apollo/client";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import ReactLoading from "react-loading";
import { useDispatch, useSelector } from "react-redux";
import { AddressType } from "../../../typing";
import Button from "../../components/Button";
import InputCard from "../../components/InputCard";
import PopupTemplate from "../../components/PopupTemplate";
import setting from "../../data/setting";
import and from "../../helper/and";
import or from "../../helper/or";
import { remove, selectDialog } from "../../redux/features/dialogSlice";
import { Wrapper } from "../auth/SignUpCard";
import clean from "../../helper/clean";

type Props = {
  func: () => void;
  onClose(): void;
  address?: AddressType;
};

const validate = (data: FormType): boolean => {
  const { firstName, lastName, phoneNumber, street, state, city } = data;

  const name = firstName + " " + lastName;
  if (
    name.length > 5 &&
    phoneNumber.length >= 10 &&
    street.length >= 3 &&
    state.length >= 3 &&
    city.length >= 3
  ) {
    return false;
  }
  return true;
};

const validateEdit = (data: FormType, prev: AddressType) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    phoneNumber2,
    info,
    street,
    state,
    city,
  } = data;

  const name = firstName + " " + lastName;

  if (
    or(
      name !== prev.name,
      phoneNumber !== prev.phoneNumber,
      street !== prev.street,
      state !== prev.state,
      city !== prev.city,
      info,
      phoneNumber2
    )
  )
    return false;

  return true;
};

const splitData = (form: any) => {
  const { name, ...others } = form;

  let newName = name.split(" ");

  return {
    firstName: newName[0] ?? "",
    lastName: newName[1] ?? "",
    ...others,
  };
};

type FormType = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  phoneNumber2?: string;
  info?: string;
  street: string;
  state: string;
  city: string;
};

const AddressMutation = gql`
  mutation CreateAddress($input: AddressInput!) {
    createAddress(input: $input) {
      message
    }
  }
`;

const AddressUpdateMutation = gql`
  mutation UpdateAddress($input: UpdateAddressInput!) {
    updateAddress(input: $input) {
      message
    }
  }
`;

const AddressForm: React.FC<Props> = (props) => {
  const { func, onClose, address } = props;
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<FormType>(
    address
      ? splitData(address)
      : {
          firstName: "",
          lastName: "",
          phoneNumber: "",
          phoneNumber2: "",
          info: "",
          street: "",
          state: "",
          city: "",
        }
  );

  const onCompleted = () => {
    onClose();
    func();
  };

  const [createAddress, { loading: createLoading }] = useMutation(
    AddressMutation,
    {
      onCompleted,
      onError: (error) => console.table(error),
    }
  );

  const [updateAddress, { loading: updateLoading }] = useMutation(
    AddressUpdateMutation,
    { onCompleted, onError: (error) => console.table(error) }
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setForm({ ...form, [target.name]: target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const { firstName, lastName, ...other } = form;

    const input = clean({
      name: firstName + " " + lastName,
      ...other,
      country: "Nigeria",
      __typename: null
    });

    if (address) {
      await updateAddress({
        variables: {
          input: {
            id: address.id,
            userId: address.userId,
            default: address.default,
            ...input,
          },
        },
      });
    } else {
      await createAddress({ variables: { input } });
    }
  };

  const loading = createLoading || updateLoading;

  return (
    <PopupTemplate
      title={address ? "Edit Address" : "Create New Address"}
      onOutsideClick={onClose}
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="pb-[10px] grid place-items-center"
      >
        <Wrapper>
          <InputCard
            title="First name"
            id="firstName"
            name="firstName"
            type="text"
            toggle
            margin
            value={form.firstName}
            onChange={handleChange}
            disabled={loading}
          />
          <InputCard
            title="Last name"
            id="lastName"
            name="lastName"
            type="text"
            toggle
            value={form.lastName}
            onChange={handleChange}
            disabled={loading}
          />
        </Wrapper>

        <Wrapper>
          <InputCard
            title="Phone Number"
            id="phoneNumber"
            name="phoneNumber"
            type="number"
            toggle
            margin
            value={form.phoneNumber}
            onChange={handleChange}
            disabled={loading}
          />
          <InputCard
            title="Phone Number 2"
            id="phoneNumber2"
            name="phoneNumber2"
            placeholder="(Optional)"
            type="text"
            toggle
            value={form.phoneNumber2}
            onChange={handleChange}
            disabled={loading}
          />
        </Wrapper>

        <InputCard
          title="Street"
          id="street"
          name="street"
          type="text"
          value={form.street}
          onChange={handleChange}
          disabled={loading}
        />
        <InputCard
          title="Additional Information"
          id="info"
          name="info"
          type="text"
          value={form.info}
          onChange={handleChange}
          disabled={loading}
        />

        <Wrapper>
          <InputCard
            title="City"
            id="city"
            name="city"
            type="text"
            toggle
            margin
            value={form.city}
            onChange={handleChange}
            disabled={loading}
          />
          <InputCard
            title="State"
            id="state"
            name="state"
            type="text"
            toggle
            value={form.state}
            onChange={handleChange}
            disabled={loading}
          />
        </Wrapper>

        <div className="w-full grid place-items-center">
          {loading ? (
            <ReactLoading type="spinningBubbles" color={setting.primary} />
          ) : (
            <div className="flex w-full items-center justify-center mt-5">
              <Button
                type="button"
                className="bg-slate-100 dark:bg-neutral-800 text-black dark:text-white"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                disabled={
                  address ? validateEdit(form, address) : validate(form)
                }
                type="submit"
                className="bg-primary text-white"
              >
                {address ? "Update" : "Create"}
              </Button>
            </div>
          )}
        </div>
      </form>
    </PopupTemplate>
  );
};

export default AddressForm;
