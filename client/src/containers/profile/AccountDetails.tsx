import { gql, useMutation, useQuery } from "@apollo/client";
import { ArrowDown2 } from "iconsax-react";
import { ChangeEvent, FormEvent, RefObject, useRef, useState } from "react";
import {
    IoRadioButtonOffOutline,
    IoRadioButtonOnOutline
} from "react-icons/io5";
import InputField from "../../components/InputField";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import ReactLoading from "react-loading";
import setting from "../../data/setting";



const ModifyUserMutation = gql`
  mutation ModifyUser($input: UserInput!) {
    modifyUser(input: $input) {
      msg
    }
  }
`;

const UserQuery = gql`
  query User {
    user {
      id
      email
      name
      gender
      birthday
      phoneNumber
    }
  }
`;

const AccountDetails = ({ setOpen }: { setOpen(value: boolean): void }) => {
  const formRef = useRef() as RefObject<HTMLFormElement>;

  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);

  const [form, setForm] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    birthday: "",
    phoneNumber: "",
  });

  const { data, loading: userLoading } = useQuery(UserQuery, {
    onCompleted: (data) => {
      const name = data.user.name.split(" ");
      setForm({
        id: data.user.id,
        firstName: name[1],
        lastName: name[0],
        email: data.user.email,
        birthday: data.user.birthday,
        gender: data.user.gender,
        phoneNumber: data.user.phoneNumber,
      });
    },
    onError: (error) => console.log(error),
  });

  const { id, firstName, lastName, email, gender, birthday, phoneNumber } =
    form;

  const [modifyUser] = useMutation(ModifyUserMutation, {
    onCompleted: () => {
      setLoading(false);
      setOpen(false);
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setForm({ ...form, [target.name]: target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let name =
      lastName && firstName
        ? lastName + " " + firstName
        : lastName && !firstName
        ? lastName
        : !lastName && firstName && firstName;
    modifyUser({
      variables: {
        input: {
          name,
          email,
          gender,
          birthday,
          phoneNumber,
        },
      },
    });
  };

  useOnClickOutside(formRef, () => setOpen(false));

  return (
    <div className="w-[100%] h-screen grid place-items-center">
      {userLoading ? (
        <div className="h-[80vh]">
          <ReactLoading type="spinningBubbles" color={setting.primary} />
        </div>
      ) : (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="w-[100%] md:w-[35%] bg-white dark:bg-dark  flex flex-col items-center justify-center px-[10px] pb-[10px] md:rounded-xl shadow-sm dark:shadow-black/50"
        >
          <div className="w-full flex items-center justify-between px-[15px] py-[15px]">
            <p className="text-[1rem] text-black dark:text-white font-[500]">
              Edit your account details
            </p>
          </div>

          <div className="flex w-[80%] items-center justify-center">
            <div className="w-[80%] my-2 mr-2">
              <p className="font-medium pl-1 text-black dark:text-white">
                First Name
              </p>
              <InputField
                IconLeft="disabled"
                className=""
                value={firstName}
                name="firstName"
                onChange={handleChange}
              />
            </div>
            <div className="w-[80%] my-2 ml-2">
              <p className="font-medium pl-1 text-black dark:text-white">
                Last Name
              </p>
              <InputField
                IconLeft="disabled"
                className=""
                value={lastName}
                name="lastName"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="w-[80%] my-2">
            <p className="font-medium pl-1 text-black dark:text-white">Email</p>
            <InputField
              IconLeft="disabled"
              className=""
              value={email}
              name="email"
              readOnly
              onChange={handleChange}
            />
          </div>

          <InputContainer
            gender={gender}
            setGender={(value) => setForm({ ...form, gender: value })}
            setToggle={setToggle}
            toggle={toggle}
          />

          <div className="w-[80%] my-2">
            <p className="font-medium pl-1 text-black dark:text-white">
              Birthday (optional)
            </p>
            <InputField
              IconLeft="disabled"
              className="birthday-input"
              value={birthday}
              name="birthday"
              type="date"
              onChange={handleChange}
            />
          </div>

          <div className="w-[80%] my-2">
            <p className="font-medium pl-1 text-black dark:text-white">
              Phone Number (optional)
            </p>
            <InputField
              IconLeft="disabled"
              className=""
              type="tel"
              pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
              value={phoneNumber}
              name="phoneNumber"
              onChange={handleChange}
            />
          </div>

          <div className="w-[60%] grid place-items-center">
            {loading ? (
              <ReactLoading type="spinningBubbles" color={setting.primary} />
            ) : (
              <div className="flex w-full items-center justify-center">
                <button
                  type="button"
                  className="bg-slate-100 dark:bg-neutral-800 m-2 px-2 min-w-[30%] h-[35px] rounded-lg hover:scale-105 active:scale-95 transition-all duration-300 text-black dark:text-white"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary m-2 px-2 min-w-[30%] h-[35px] rounded-lg hover:scale-105 active:scale-95 transition-all duration-300 text-white"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

const InputContainer = ({
  setToggle,
  toggle,
  gender,
  setGender,
}: {
  toggle: boolean;
  setToggle(value: boolean): void;
  setGender(value: string): void;
  gender: string;
}) => {
  const ref = useRef() as RefObject<HTMLDivElement>;

  useOnClickOutside(ref, () => toggle && setToggle(false));

  const handleSelect = (value: string) => {
    setGender(value);
    setToggle(false);
  };

  return (
    <div className="w-[80%] my-2 relative">
      <p className="font-medium pl-1 text-black dark:text-white">
        Gender (optional)
      </p>
      <div ref={ref} className="">
        <InputField
          id="gender"
          IconLeft="disabled"
          IconRight={
            <div onClick={() => setToggle(!toggle)}>
              <ArrowDown2
                variant="Bold"
                className="text-black dark:text-white"
              />
            </div>
          }
          className="relative cursor-pointer"
          inputClassName="cursor-pointer"
          value={gender}
          onClick={() => setToggle(!toggle)}
          name="gender"
          readOnly
        />
        <div
          className={`absolute left-0 w-full place-items-center transition-all duration-300 ${
            toggle ? "grid" : "hidden"
          }`}
        >
          <div className="w-[98%] h-[80px] bg-white dark:bg-dark shadow-md rounded-lg">
            <div
              className="flex items-center p-2 cursor-pointer"
              onClick={() => handleSelect("Male")}
            >
              <div className="flex items-center justify-center">
                {gender === "Male" ? (
                  <IoRadioButtonOnOutline className="text-[20px] text-black dark:text-white" />
                ) : (
                  <IoRadioButtonOffOutline className="text-[20px] text-black dark:text-white" />
                )}
              </div>
              <p className="pl-1 text-black dark:text-white font-medium">
                Male
              </p>
            </div>

            <div
              className="flex items-center p-2 cursor-pointer"
              onClick={() => handleSelect("Female")}
            >
              {gender === "Female" ? (
                <IoRadioButtonOnOutline className="text-[20px] text-black dark:text-white" />
              ) : (
                <IoRadioButtonOffOutline className="text-[20px] text-black dark:text-white" />
              )}
              <p className="pl-1 text-black dark:text-white font-medium">
                Female
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
