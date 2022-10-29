import { gql, useMutation } from "@apollo/client";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserType } from "../../../typing";
import Button from "../../components/Button";
import InputCard from "../../components/InputCard";
import InputDropdown from "../../components/InputDropdown";
import PopupTemplate from "../../components/PopupTemplate";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import { remove, selectDialog } from "../../redux/features/dialogSlice";
import { Wrapper } from "../auth/SignUpCard";

const ModifyMutation = gql`
  mutation ModifyUser($input: UserInput!) {
    modifyUser(input: $input) {
      msg
    }
  }
`;

const splitData = (form: UserType): FormType => {
  const { birthday, gender, name, phoneNumber } = form;

  return {
    firstName: name.split(" ")[0],
    lastName: name.split(" ")[1],
    gender,
    birthday,
    phoneNumber,
  };
};

const validate = (form: FormType, prevForm: UserType): boolean => {
  const { firstName, lastName, birthday, gender, phoneNumber } = form;

  let name = lastName + " " + firstName;

  if (
    name !== prevForm.name ||
    birthday !== prevForm.birthday ||
    gender !== prevForm.gender ||
    phoneNumber !== prevForm.phoneNumber
  ) {
    return false;
  }

  return true;
};

interface FormType {
  firstName: string;
  lastName: string;
  gender: string;
  birthday: Date | null;
  phoneNumber: string;
}

const UserEdit = ({ func }: { func: any }) => {
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { userEdit } = useSelector(selectDialog);

  const [form, setForm] = useState<FormType>(splitData(userEdit.product));

  const [modifyUser] = useMutation(ModifyMutation);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setForm({ ...form, [target.name]: target.value });
  };

  const close = () => dispatch(remove({ type: "userEdit" }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await modifyUser({
      variables: {
        input: {
          email: userEdit.product.email,
          name: form.firstName + " " + form.lastName,
          gender: form.gender,
          birthday: form.birthday,
          phoneNumber: form.phoneNumber,
        },
      },
      onCompleted: (data) => {
        console.log(data);
        func?.();
        close();
      },
      onError: (err) => console.table(err),
    });
  };

  useOnClickOutside(ref, close);

  return (
    <PopupTemplate title="Edit information" onOutsideClick={close}>
      <form
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
          <InputDropdown
            list={["Male", "Female"]}
            title="Gender"
            id="gender"
            name="gender"
            type="text"
            show
            margin
            value={form.gender}
            onChange={(value: string) => setForm({ ...form, gender: value })}
          />
        </Wrapper>

        <InputCard
          title="Birthday"
          id="birthday"
          name="birthday"
          type="date"
          value={form.birthday ?? ""}
          onChange={handleChange}
        />

        <InputCard
          title="Phone number"
          id="phoneNumber"
          name="phoneNumber"
          type="text"
          value={form.phoneNumber}
          onChange={handleChange}
        />
        <div className="flex items-center justify-center mb-2 mt-5">
          <Button
            type="button"
            className="bg-slate-100 dark:bg-neutral-800 text-black dark:text-white"
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={validate(form, userEdit.product)}
            className="bg-primary text-white disabled:opacity-40"
          >
            Save Change
          </Button>
        </div>
      </form>
    </PopupTemplate>
  );
};

export default UserEdit;
