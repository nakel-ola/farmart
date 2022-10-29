import { ChangeEvent, FormEvent, useRef } from "react";
import InputField from "../../components/InputField";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import ReactLoading from "react-loading";
import setting from "../../data/setting";


type Props = {
  form: any;
  handleChange(e: ChangeEvent<HTMLInputElement>): void;
  setOpen(value: boolean): void;
  handleSubmit(e: FormEvent): void;
  loading: boolean;
};

const AddressForm = ({
  form,
  handleChange,
  setOpen,
  handleSubmit,
  loading,
}: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const {
    firstName,
    lastName,
    phoneNumber,
    phoneNumber2,
    info,
    street,
    state,
    city,
  } = form;

  useOnClickOutside(formRef, () => setOpen(false));

  return (
    <div className="w-[100%] h-screen grid place-items-center">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="w-[100%] md:w-[35%] bg-white dark:bg-dark  flex flex-col items-center justify-center px-[10px] pb-[10px] md:rounded-lg shadow-sm dark:shadow-black/50"
      >
        <div className="w-full flex items-center justify-between px-[15px] py-[15px]">
          <p className="text-[1rem] text-black dark:text-white font-[500]">
            Create New Address
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

        <div className="flex w-[80%] items-center justify-center">
          <div className="w-[80%] my-2 mr-2">
            <p className="font-medium pl-1 text-black dark:text-white">
              Phone Number
            </p>
            <InputField
              IconLeft="disabled"
              className=""
              value={phoneNumber}
              name="phoneNumber"
              onChange={handleChange}
            />
          </div>
          <div className="w-[80%] my-2 ml-2">
            <p className="font-medium pl-1 text-black dark:text-white whitespace-nowrap">
              Additional Phone Number
            </p>

            <InputField
              IconLeft="disabled"
              className=""
              value={phoneNumber2}
              name="phoneNumber2"
              placeholder="(Optional)"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="w-[80%] my-2">
          <p className="font-medium pl-1 text-black dark:text-white">Street</p>
          <InputField
            IconLeft="disabled"
            className=""
            value={street}
            name="street"
            onChange={handleChange}
          />
        </div>
        <div className="w-[80%] my-2">
          <p className="font-medium pl-1 text-black dark:text-white">
            Additional Information
          </p>
          <InputField
            IconLeft="disabled"
            className=""
            value={info}
            name="info"
            onChange={handleChange}
          />
        </div>
        <div className="flex w-[80%] items-center justify-center">
          <div className="w-[80%] my-2 mr-2">
            <p className="font-medium pl-1 text-black dark:text-white">State</p>
            <InputField
              IconLeft="disabled"
              className=""
              value={state}
              name="state"
              onChange={handleChange}
            />
          </div>
          <div className="w-[80%] my-2 ml-2">
            <p className="font-medium pl-1 text-black dark:text-white">City</p>
            <InputField
              IconLeft="disabled"
              className=""
              value={city}
              name="city"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="w-full grid place-items-center">
          {loading ? (
            <ReactLoading type="spinningBubbles" color={setting.primary} />
          ) : (
            <div className="flex w-full items-center justify-center mt-5">
              <button
                type="button"
                className="bg-slate-100 dark:bg-neutral-800 m-2 px-2 min-w-[30%] h-[35px] rounded-lg hover:scale-105 active:scale-95 transition-all duration-300 text-black dark:text-white"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                disabled={
                  !firstName ||
                  !lastName ||
                  !phoneNumber ||
                  !street ||
                  !state ||
                  !city
                }
                type="submit"
                className="bg-primary m-2 px-2 min-w-[30%] h-[35px] rounded-lg hover:scale-105 active:scale-95 transition-all duration-300 text-white"
              >
                Save
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
