/* importing required files and packages */
import { Eye, EyeSlash } from "iconsax-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Button from "../../components/Button";
import InputCard from "../../components/InputCard";
import { selectValidateUser } from "../../redux/features/userSlice";
import TitleCard from "./TitleCard";

type FormProps = {
  password: string;
  confirmPassword: string;
};

const validate = (form: FormProps): boolean => {
  const { password, confirmPassword } = form;

  if (
    password.length >= 8 &&
    confirmPassword.length >= 8 &&
    password === confirmPassword
  )
    return false;

  return true;
};

const PasswordCard = (props: { setLoading(value: boolean): void }) => {
  const validateForm = useSelector(selectValidateUser);

  const { setLoading } = props;

  const [form, setForm] = useState<Required<FormProps>>({
    password: "",
    confirmPassword: "",
  });

  const [toggle, setToggle] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let loginToast = toast.loading("Loading......");
    setLoading(true);

    await signIn("change_password", {
      redirect: false,
      password: form.confirmPassword,
      ...validateForm,
    }).then(({ ok, error }: any) => {
      if (ok) {
        toast.success("Login Successfully", { id: loginToast });
        router.replace("/dashboard");
      } else {
        setLoading(false);
        console.table(error);
        toast.error("Something went wrong", { id: loginToast });
      }
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
