import { gql, useMutation } from "@apollo/client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EmployeeType } from "../../../typing";
import Button from "../../components/Button";
import InputCard from "../../components/InputCard";
import InputDropdown from "../../components/InputDropdown";
import LoadingCard from "../../components/LoadingCard";
import PopupTemplate from "../../components/PopupTemplate";
import { remove, selectDialog } from "../../redux/features/dialogSlice";
import { Wrapper } from "../products/Popup";

const ModifyMutation = gql`
  mutation EmployeeModifyUser($input: EmployeeUserInput!) {
    employeeModifyUser(input: $input) {
      msg
    }
  }
`;

const splitData = (form: EmployeeType): FormType => {
  const { birthday, gender, name, level, phoneNumber } = form;

  return {
    firstName: name.split(" ")[1],
    lastName: name.split(" ")[0],
    gender,
    level,
    birthday,
    phoneNumber,
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

const EmployeeEdit = ({ func }: { func: any }) => {
  const dispatch = useDispatch();
  const { employeeEdit } = useSelector(selectDialog);

  const [form, setForm] = useState<FormType>(splitData(employeeEdit.data));

  const [employeeModifyUser, { loading }] = useMutation(ModifyMutation);

  const close = () => dispatch(remove({ type: "employeeEdit" }))

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setForm({ ...form, [target.name]: target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await employeeModifyUser({
      variables: {
        input: {
          employeeId: employeeEdit.data.id,
          email: employeeEdit.data.email,
          name: form.lastName + " " + form.firstName,
          gender: form.gender,
          level: form.level,
          birthday: form.birthday,
          phoneNumber: form.phoneNumber,
        },
      },
      onCompleted: (data) => {
        console.log(data);
        func?.();
        dispatch(remove({ type: "employeeEdit" }));
      },
      onError: (err) => console.table(err),
    });
  };

  return (
    <PopupTemplate title="Edit information" onOutsideClick={close}>
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
              onClick={close}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={validate(form, employeeEdit.data)}
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
