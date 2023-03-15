import { gql, useMutation } from "@apollo/client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import { EmployeeType, UserType } from "../../../typing";
import Button from "../../components/Button";
import InputCard from "../../components/InputCard";
import InputDropdown from "../../components/InputDropdown";
import LoadingCard from "../../components/LoadingCard";
import PopupTemplate from "../../components/PopupTemplate";
import { selectUser } from "../../redux/features/userSlice";
import { Wrapper } from "../products/Popup";

export const UpdateUserMutation = gql`
  mutation UpdateUser($input: UserInput!) {
    updateUser(input: $input) {
      message
    }
  }
`;
const splitData = (form: EmployeeType): FormType => {
  const { birthday, gender, name, level, phoneNumber } = form;

  return {
    firstName: name.split(" ")[1],
    lastName: name.split(" ")[0],
    gender: gender ?? "",
    level: level ?? "",
    birthday: birthday ?? "",
    phoneNumber: phoneNumber ?? "",
  };
};

const validate = (form: FormType, prevForm: EmployeeType): boolean => {
  const { firstName, lastName, birthday, gender, level, phoneNumber } = form;

  let name = lastName + " " + firstName;

  if (
    name !== prevForm.name ||
    birthday !== prevForm.birthday ||
    gender !== prevForm.gender ||
    level !== prevForm.level ||
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
  level: string;
  birthday: Date | null;
  phoneNumber: string;
}

interface Props {
  user: UserType;
  func(): void;
  onClose(): void;
  isAuth?: boolean;
}

const EmployeeEdit: React.FC<Props> = (props) => {
  const { func, onClose, user, isAuth = false } = props;

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
          uid: isAuth ? null : user.id,
          name: name.length > 5 ? name : null,
          gender: form.gender,
          birthday: form.birthday,
          phoneNumber: form.phoneNumber,
          level: form.level,
        },
      },
      onCompleted: (data) => {
        func?.();
        onClose();
      },
      onError: (err) => console.table(err),
    });
  };

  return (
    <PopupTemplate title="Edit information" onOutsideClick={onClose}>
      {!loading ? (
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
            <InputDropdown
              list={["Gold", "Sliver"]}
              title="Level"
              id="level"
              name="level"
              type="text"
              show
              margin={false}
              value={form.level}
              onChange={(value: string) => setForm({ ...form, level: value })}
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
              disabled={validate(form, user)}
              className="bg-primary text-white disabled:opacity-40 mx-2"
            >
              Save Change
            </Button>
          </div>
        </form>
      ) : (
        <LoadingCard title="Saving..." />
      )}
    </PopupTemplate>
  );
};

export default EmployeeEdit;
