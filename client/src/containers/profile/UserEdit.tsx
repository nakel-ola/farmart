import { gql, useMutation } from "@apollo/client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { UserType } from "../../../typing";
import Button from "../../components/Button";
import InputCard from "../../components/InputCard";
import InputDropdown from "../../components/InputDropdown";
import LoadingCard from "../../components/LoadingCard";
import PopupTemplate from "../../components/PopupTemplate";
import { Wrapper } from "../auth/SignUpCard";
import capitalizeFirstLetter from "../../helper/capitalizeFirstLetter";

export const UpdateUserMutation = gql`
  mutation UpdateUser($input: UserInput!) {
    updateUser(input: $input) {
      message
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

interface UserEditProps {
  func(): void;
  onClose(): void;
  user: UserType;
}

const UserEdit: React.FC<UserEditProps> = ({ func, onClose, user }) => {

  const [form, setForm] = useState<FormType>(splitData(user));

  const [updateUser, { loading }] = useMutation(UpdateUserMutation);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setForm({ ...form, [target.name]: target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let name = form.firstName + " " + form.lastName;

    await updateUser({
      variables: {
        input: {
          name: name.length > 5 ? name : null,
          gender: form.gender,
          birthday: form.birthday,
          phoneNumber: form.phoneNumber,
        },
      },
      onCompleted: (data) => {
        console.log(data);
        func?.();
        onClose();
      },
      onError: (err) => console.table(err),
    });
  };

  return (
    <PopupTemplate title="Edit information" onOutsideClick={onClose}>
      {loading ? (
        <LoadingCard title="Updating" />
      ) : (
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
              list={["male", "female"]}
              title="Gender"
              id="gender"
              name="gender"
              type="text"
              show
              margin
              value={capitalizeFirstLetter(form.gender ?? "")}
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
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={validate(form, user)}
              className="bg-primary text-white disabled:opacity-40"
            >
              Save Change
            </Button>
          </div>
        </form>
      )}
    </PopupTemplate>
  );
};

export default UserEdit;
