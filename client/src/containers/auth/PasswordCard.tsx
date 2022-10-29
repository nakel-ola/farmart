/* importing required files and packages */
import { gql, useMutation } from "@apollo/client";
import { Eye, EyeSlash } from "iconsax-react";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import InputCard from "../../components/InputCard";
import { login, selectValidateUser } from "../../redux/features/userSlice";
import TitleCard from "./TitleCard";

const PasswordMutation = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      id
      email
      name
      photoUrl
      blocked
      gender
      birthday
      phoneNumber
      createdAt
      updatedAt
    }
  }
`;
// test21@gmail.com
// password21

const PasswordCard = (props: any) => {
  const validate = useSelector(selectValidateUser);

  const { setLoading } = props;

  const [form, setForm] = useState({ password: "", confirmPassword: "" });

  const [toggle, setToggle] = useState(false);

  const dispatch = useDispatch();

  const router = useRouter();

  const [changePassword] = useMutation(PasswordMutation, {
    onCompleted: (data) => {
      dispatch(login({ token: data.changePassword.token }));
      router.replace("/profile");
    },
    onError: (error: any) => {
      setLoading(false);
      console.error(error);
      error.networkError.result.errors.map((error: any) =>
        toast.error(error.message)
      );
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    let loginToast = toast.loading("Loading......");
    setLoading(true);

    changePassword({
      variables: {
        input: {
          password: form.confirmPassword,
          ...validate,
        },
      },
      onCompleted: (data) => {
        dispatch(login(data.changePassword));
        toast.success("Login Successfully", { id: loginToast });
        router.replace("/profile");
      },
      onError: (error: any) => {
        setLoading(false);
        toast.error("Something went wrong", { id: loginToast });
        console.error(error);
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
      <TitleCard title="Create New Password" />
      <form
        onSubmit={handleSubmit}
        className="w-full grid place-items-center py-[5px]"
      >
        <InputCard
          title="Password"
          id="password"
          name="password"
          className="border-[1.5px] border-transparent hover:border-primary"
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

        <InputCard
          title="Confirm Password"
          id="confirmPassword"
          name="confirmPassword"
          className="border-[1.5px] border-transparent hover:border-primary"
          type={toggle ? "text" : "password"}
          value={form.confirmPassword}
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
        <Button type="submit" className="my-5" disabled={validate(form)}>
          Confirm
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

export default PasswordCard;
