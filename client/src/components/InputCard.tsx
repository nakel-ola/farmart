import InputField, { InputFieldProps } from "./InputField";

interface CardProps extends InputFieldProps {
  title: string;
  toggle?: boolean;
  margin?: boolean;
}

const InputCard = ({ title, toggle, margin, ...others }: CardProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center mt-2 w-full ${
        toggle ? "flex-1" : ""
      } ${margin ? "mr-2" : ""}`}
    >
      <label
        className={`text-[1rem] text-black dark:text-white font-[500] ml-2 ${
          toggle ? "w-full" : "w-[80%]"
        }`}
      >
        {title}
      </label>
      <div className={` ${toggle ? "w-full" : "w-[80%]"}`}>
        <InputField IconLeft="disabled" {...others} />
      </div>
    </div>
  );
};

export default InputCard;
