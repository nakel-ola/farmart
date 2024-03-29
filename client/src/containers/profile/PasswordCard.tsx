import { ApolloError, gql, useMutation } from "@apollo/client";
import { Eye, EyeSlash } from "iconsax-react";
import React, { ChangeEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import CardTemplate from "../../components/CardTemplate";
import InputField from "../../components/InputField";
import { login } from "../../redux/features/userSlice";

const UpdatePassword = gql`
  mutation UpdatePassword($input: UpdatePasswordInput!) {
    updatePassword(input: $input) {
      message
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

  const [updatePassword] = useMutation(UpdatePassword, {
    onCompleted: (data) => {
      setForm({ oldPassword: "", newPassword: "" });
      setLoading(false);
    },
    onError: (error: any) => {
      console.log(error)
      setLoading(false);
      toast.error(error?.graphQLErrors?.map((e: any) => e.message).join(","));
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setForm({ ...form, [target.name]: target.value });
  };

  const handleSubmit = () => {
    setLoading(true);
    if (form.oldPassword.length < 8) {
      toast.error("Old Password must be at least 8 characters");
      return;
    }
    if (form.newPassword.length < 8) {
      toast.error("New Password must be at least 8 characters");
      return;
    }

    updatePassword({ variables: { input: form } });
  };

  return (
    <CardTemplate title="Change Password" className="my-4">
      <div className="pl-[25px] md:w-[60%] w-[80%] ">
        <div className="my-2">
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
        <div className="my-2">
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

        <div className="w-[80%] md:w-[60%] my-8">
          <Button
            onClick={handleSubmit}
            disabled={oldPassword.length < 8 || newPassword.length < 8}
          >
            Change Password
          </Button>
        </div>
      </div>
    </CardTemplate>
  );
};

export default PasswordCard;
