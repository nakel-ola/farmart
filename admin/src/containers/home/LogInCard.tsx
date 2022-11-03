/* importing required files and packages */
import { gql, useApolloClient, useMutation } from "@apollo/client";
import {
  Eye,
  EyeSlash
} from "iconsax-react";
import { JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Button from "../../components/Button";
import InputCard from "../../components/InputCard";
import { Footer } from "../../pages";
import { login } from "../../redux/features/userSlice";
import TitleCard from "./TitleCard";

const LoginMutation = gql`
  mutation EmployeeLogin($input: LoginInput!) {
    employeeLogin(input: $input) {
      id
      email
      name
      gender
      birthday
      phoneNumber
      photoUrl
      createdAt
      updatedAt
      level
    }
  }
`;

export interface JwtUserType extends JwtPayload {
  birthday: Date;
  email: string;
  exp: number;
  iat: number;
  gender: string;
  id: string;
  name: string;
  phoneNumber: string;
  photoUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
export var emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const validate = (form: FormProps): boolean => {
  const { email, password } = form;

  if (email.match(emailRegex) && password.length >= 8) {
    return false;
  }

  return true;
};

type FormProps = {
  email: string;
  password: string;
};

const LogInCard = (props: { setLoading(value: boolean):void}) => {
  const { setLoading } = props;

  const dispatch = useDispatch();

  const router = useRouter();

  const client = useApolloClient();

  const [form, setForm] = useState<FormProps>({ email: "", password: "" });

  const [toggle, setToggle] = useState(false);

  const [loginUser] = useMutation(LoginMutation);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let loginToast = toast.loading("Loading......");

    setLoading(true);

    await client.resetStore();
    await loginUser({
      variables: { input: form },
      onCompleted: (data) => {
        dispatch(login(data.employeeLogin));
        toast.success("Login Successfully", { id: loginToast });
        router.replace("/dashboard");
      },
      onError: (err: any) => {
        setLoading(false);
        toast.error("Email or Password incorrect", { id: loginToast });
        console.table(err);
      },
    });
    setLoading(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const target = e.target;
    setForm({ ...form, [target.name]: target.value });
  };

  return (
    <div className="w-full flex items-center justify-center h-full flex-col">
      <TitleCard title="Sign in to your account to continue..." />

      <form
        onSubmit={handleSubmit}
        className="w-full grid place-items-center py-[5px]"
      >
        <InputCard
          title="Email"
          id="email"
          name="email"
          type="text"
          value={form.email}
          onChange={handleChange}
        />

        <InputCard
          title="Password"
          id="password"
          name="password"
          type={toggle ? "text" : "password"}
          value={form.password}
          onChange={handleChange}
          IconRight={
            <div className="flex items-center justify-center">
              <button
                type="button"
                className="flex items-center justify-center w-[25px] h-[25px]"
                onClick={() => setToggle(!toggle)}
              >
                {toggle ? (
                  <EyeSlash
                    size={25}
                    variant="Bold"
                    className="dark:text-neutral-300 text-[20px] px-[2px] text-[#212121]"
                  />
                ) : (
                  <Eye
                    size={25}
                    variant="Bold"
                    className="dark:text-neutral-300 text-[20px] px-[2px] text-[#212121]"
                  />
                )}
              </button>
            </div>
          }
        />

        <div className="w-[80%] flex items-center justify-between my-5">
          <strong
            className="cursor-pointer text-[1rem] ml-auto py-2 text-blue-600 hover:underline w-fit font-medium"
            onClick={() => router.push("?type=forget")}
          >
            Forget password ?
          </strong>
        </div>
        <Button type="submit" className="my-5" disabled={validate(form)}>Sign In</Button>
      </form>

      {/* <Footer
        title="Don't have an account?"
        buttonText="Create Account"
        onClick={() => {
          router.push("?type=signup");
        }}
      /> */}
    </div>
  );
};

export default LogInCard;
