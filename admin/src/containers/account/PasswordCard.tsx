import { gql, useMutation } from "@apollo/client";
import { Eye, EyeSlash } from "iconsax-react";
import { decode } from "jsonwebtoken";
import React, { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import { login } from "../../redux/features/userSlice";
import { JwtUserType } from "../home/LogInCard";

const UpdatePassword = gql`
  mutation EmployeeUpdatePassword($input: UpdatePasswordInput!) {
    employeeUpdatePassword(input: $input) {
      id
      email
      name
      photoUrl
      level
      gender
      birthday
      phoneNumber
      createdAt
      updatedAt
    }
  }
`;

const PasswordCard = ({ setLoading }: { setLoading(value: boolean): void }) => {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [toggle, setToggle] = useState({
    old: false,
    new: false,
  });

  const { oldPassword, newPassword } = form;

  const dispatch = useDispatch();

  const { user } = useSelector((store: any) => store.user);

  const [updatePassword] = useMutation(UpdatePassword);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setForm({ ...form, [target.name]: target.value });
  };

  const handleSubmit = async () => {
    let loginToast = toast.loading("Loading......");
    setLoading(true);
    if (form.oldPassword.length < 8) {
      toast.error("Old Password must be at least 8 characters", {
        id: loginToast,
      });
      return;
    }
    if (form.newPassword.length < 8) {
      toast.error("New Password must be at least 8 characters", {
        id: loginToast,
      });
      return;
    }

    await updatePassword({
      variables: {
        input: {
          ...form,
          email: user.email,
        },
      },
      onCompleted: (data) => {
        const value = decode(data.employeeUpdatePassword.token) as JwtUserType;
        dispatch(login(data.employeeUpdatePassword));
        setForm({ oldPassword: "", newPassword: "" });
        setLoading(false);
        toast.success("Login Successfully", { id: loginToast });
      },
      onError: (error: any) => {
        setLoading(false);
        toast.error("Something went wrong", { id: loginToast });
      },
    });
  };

  return (
    <div className="w-[95%] md:w-[80%] rounded-lg dark:bg-dark dark:shadow-black/30 bg-white shadow-sm overflow-hidden pb-2 mb-8">
      <div className="w-full border-b-[1px] border-b-slate-100 dark:border-b-neutral-800 flex items-center justify-between">
        <p className="py-[8px] pl-[15px] text-[1.2rem] text-black font-[600] dark:text-white">
          Change Password
        </p>
      </div>

      <div className="pl-[25px]">
        <div className="md:w-[60%] w-[80%] my-2">
          <p className="font-medium pl-1 text-black dark:text-white">
            Old Password
          </p>
          <InputField
            IconLeft="disabled"
            className=""
            value={oldPassword}
            name="oldPassword"
            type={toggle.old ? "text" : "password"}
            onChange={handleChange}
            IconRight={
              <div className="flex items-center justify-center">
                <button
                  className="flex items-center justify-center"
                  onClick={() => setToggle({ ...toggle, old: !toggle.old })}
                >
                  {toggle.old ? (
                    <EyeSlash
                      variant="Bold"
                      size={25}
                      className="px-[2px] text-[#212121] dark:text-neutral-300"
                    />
                  ) : (
                    <Eye
                      variant="Bold"
                      size={25}
                      className="px-[2px] text-[#212121] dark:text-neutral-300"
                    />
                  )}
                </button>
              </div>
            }
          />
        </div>
        <div className="md:w-[60%] w-[80%] my-2">
          <p className="font-medium pl-1 text-black dark:text-white">
            New Password
          </p>
          <InputField
            IconLeft="disabled"
            className=""
            value={newPassword}
            name="newPassword"
            onChange={handleChange}
            type={toggle.new ? "text" : "password"}
            IconRight={
              <div className="flex items-center justify-center">
                <button
                  className="flex items-center justify-center border-0 outline-0"
                  onClick={() => setToggle({ ...toggle, new: !toggle.new })}
                >
                  {toggle.new ? (
                    <EyeSlash
                      variant="Bold"
                      size={25}
                      className="text-[20px] px-[2px] text-[#212121] dark:text-neutral-300"
                    />
                  ) : (
                    <Eye
                      variant="Bold"
                      size={25}
                      className="text-[20px] px-[2px] text-[#212121] dark:text-neutral-300"
                    />
                  )}
                </button>
              </div>
            }
          />
        </div>

        <div className="w-[80%] md:w-[60%] mt-8">
          <Button
            className="bg-primary text-white disabled:opacity-40"
            onClick={handleSubmit}
            disabled={oldPassword.length < 8 || newPassword.length < 8}
          >
            Change Password
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PasswordCard;
