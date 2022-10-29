import { gql, useMutation } from "@apollo/client";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import InputCard from "../../components/InputCard";
import PopupTemplate from "../../components/PopupTemplate";
import { remove, selectDialog } from "../../redux/features/dialogSlice";
import { Wrapper } from "../auth/SignUpCard";
import ReactLoading from "react-loading";
import setting from "../../data/setting";


type Props = {
  func: () => void;
};

const validate = (data: FormType): boolean => {
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

const splitData = (form: any) => {
  const { name, phoneNumber, phoneNumber2, info, street, state, city } = form;

  let newName = name.split(" ");

  return {
    firstName: newName[0],
    lastName: newName[1],
    phoneNumber,
    phoneNumber2,
    info,
    street,
    state,
    city,
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
      msg
    }
  }
`;

const AddressModifyMutation = gql`
  mutation ModifyAddress($input: ModifyAddressInput!) {
    modifyAddress(input: $input) {
      msg
    }
  }
`;

const AddressForm = ({ func }: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const { address } = useSelector(selectDialog);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormType>(
    address.product
      ? splitData(address.product)
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

  const [createAddress] = useMutation(AddressMutation, {
    onCompleted: () => {
      close()
      setLoading(false);
      func();
    },
    onError: (error) => {
      console.table(error);
    },
  });
  const [modifyAddress] = useMutation(AddressModifyMutation, {
    onCompleted: () => {
      close()
      setLoading(false);
      func();
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setForm({ ...form, [target.name]: target.value });
  };

  const close = () => dispatch(remove({ type: "address" }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const {
      firstName,
      lastName,
      phoneNumber,
      phoneNumber2,
      info,
      street,
      state,
      city,
    } = form;

    if (address.product) {
      modifyAddress({
        variables: {
          input: {
            id: address.product.id,
            name: firstName + " " + lastName,
            phoneNumber,
            phoneNumber2,
            info,
            street,
            state,
            city,
            country: "Nigeria",
          },
        },
      });
    } else {
      createAddress({
        variables: {
          input: {
            name: lastName + " " + firstName,
            phoneNumber,
            phoneNumber2,
            info,
            street,
            state,
            city,
            country: "Nigeria",
          },
        },
      });
    }
  };

  return (
    <PopupTemplate title="Create New Address" onOutsideClick={close}>
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
          />
          <InputCard
            title="Last name"
            id="lastName"
            name="lastName"
            type="text"
            toggle
            value={form.lastName}
            onChange={handleChange}
          />
        </Wrapper>

        <Wrapper>
          <InputCard
            title="Phone Number"
            id="phoneNumber"
            name="phoneNumber"
            type="text"
            toggle
            margin
            value={form.phoneNumber}
            onChange={handleChange}
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
          />
        </Wrapper>

        <InputCard
          title="Street"
          id="street"
          name="street"
          type="text"
          value={form.street}
          onChange={handleChange}
        />
        <InputCard
          title="Additional Information"
          id="info"
          name="info"
          type="text"
          value={form.info}
          onChange={handleChange}
        />

        <Wrapper>
          <InputCard
            title="State"
            id="state"
            name="state"
            type="text"
            toggle
            margin
            value={form.state}
            onChange={handleChange}
          />
          <InputCard
            title="City"
            id="city"
            name="city"
            type="text"
            toggle
            value={form.city}
            onChange={handleChange}
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
                onClick={close}
              >
                Cancel
              </Button>
              <Button
                disabled={validate(form)}
                type="submit"
                className="bg-primary text-white"
              >
                Save
              </Button>
            </div>
          )}
        </div>
      </form>
    </PopupTemplate>
  );
};

export default AddressForm;
