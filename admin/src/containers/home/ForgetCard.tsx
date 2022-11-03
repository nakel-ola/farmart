/* importing required files and packages */
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Button from "../../components/Button";
import InputCard from "../../components/InputCard";
import { forget } from "../../redux/features/userSlice";
import { Wrapper } from "./SignUpCard";
import TitleCard from "./TitleCard";

export const ForgetMutation = gql`
  mutation EmployeeForgetPassword($input: ForgetPasswordInput!) {
    employeeForgetPassword(input: $input) {
      validationToken
    }
  }
`;

type FormProps = {
  email: string;
  firstName: string;
  lastName: string;
};
var emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const validate = (form: FormProps): boolean => {
  const { email, lastName, firstName } = form;

  if (
    email.match(emailRegex) &&
    firstName.length >= 4 &&
    lastName.length >= 4
  ) {
    return false;
  }
  return true;
};

const ForgetCard = (props: { setLoading(value: boolean): void }) => {
  const { setLoading } = props;

  const dispatch = useDispatch();

  const router = useRouter();

  const [form, setForm] = useState<Required<FormProps>>({
    email: "",
    firstName: "",
    lastName: "",
  });

  const [forgetPassword] = useMutation(ForgetMutation);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    let loginToast = toast.loading("Loading......");

    const newData = {
      name: form.firstName + " " + form.lastName,
      email: form.email,
    };

    setLoading(true);

    forgetPassword({
      variables: { input: newData },
      onCompleted: (data) => {
        router.push("?type=code");
        dispatch(
          forget({
            validationToken: data.employeeForgetPassword.validationToken,
            ...newData,
          })
        );
        setLoading(false);
        toast.success("Credential verified", { id: loginToast });
      },
      onError: (error: any) => {
        setLoading(false);
        toast.error("Something went wrong", { id: loginToast });
        console.table(error);
      },
    });
    setLoading(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setForm({ ...form, [target.name]: target.value });
  };

  return (
    <div className="w-full flex items-center justify-center h-full flex-col">
      <TitleCard title="Forget your password..." />
      <form
        onSubmit={handleSubmit}
        className="w-full grid place-items-center py-[5px]"
      >
        <Wrapper>
          <InputCard
            title="First name"
            toggle
            margin
            id="firstName"
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={handleChange}
          />
          <InputCard
            title="Last name"
            toggle
            id="lastName"
            name="lastName"
            type="text"
            value={form.lastName}
            onChange={handleChange}
          />
        </Wrapper>
        <InputCard
          title="Email"
          id="email"
          name="email"
          type="text"
          value={form.email}
          onChange={handleChange}
        />

        <Button type="submit" className="my-5" disabled={validate(form)}>
          Validate Me
        </Button>
      </form>
      <div className="w-[80%] flex items-center justify-center flex-col py-[15px] md:mt-0 mt-auto">
        <div className="flex items-center justify-center mx-5">
          <p className="text-center text-black dark:text-white">
            By continuing, you agree to our{" "}
            <span className="text-blue-600 font-medium hover:underline cursor-pointer">
              Terms
            </span>{" "}
            and
            <span className="ml-2 text-blue-600 font-medium hover:underline cursor-pointer">
              Conditions.
            </span>
          </p>{" "}
        </div>
      </div>
    </div>
  );
};

export default ForgetCard;
