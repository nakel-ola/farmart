import { Eye, EyeSlash } from "iconsax-react";
import { useRouter } from "next/router";
import React, { ChangeEvent, FormEvent, ReactNode, useState } from "react";
import Button from "../../components/Button";
import InputCard from "../../components/InputCard";
import InputDropdown from "../../components/InputDropdown";
import { Footer } from "../../pages";
import TitleCard from "./TitleCard";

var emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const validate = (data: FormType): boolean => {
  const { firstName, lastName, email, gender, phoneNumber, password } = data;
  let name = firstName + " " + lastName;
  if (
    name.length >= 5 &&
    email.match(emailRegex) &&
    (gender === "Male" || gender === "Female") &&
    phoneNumber.length >= 10 &&
    password.length === 8
  ) {
    return false;
  }
  return true;
};

type FormType = {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phoneNumber: string;
  password: string;
};

const SignInCard = (props: { setLoading(value: boolean): void }) => {
  const router = useRouter();
  const [toggle, setToggle] = useState(false);

  const [form, setForm] = useState<FormType>({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    phoneNumber: "",
    password: "",
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setForm({ ...form, [target.name]: target.value });
  };
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="w-full flex items-center justify-center h-full flex-col">
      <TitleCard title="Create an account to continue..." />
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

        <InputCard
          title="Phone number"
          id="phoneNumber"
          name="phoneNumber"
          type="text"
          value={form.phoneNumber}
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
                className="flex items-center justify-center w-[30px] h-[30px]"
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
          Sign In
        </Button>
      </form>

      <Footer
        title="Already have an account ?"
        buttonText="Sign in"
        onClick={() => {
          router.push("/");
        }}
      />
    </div>
  );
};

export const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex w-[100%] items-center justify-center">
      <div className="w-[80%] flex items-center justify-between">
        {children}
      </div>
    </div>
  );
};

export default SignInCard;
