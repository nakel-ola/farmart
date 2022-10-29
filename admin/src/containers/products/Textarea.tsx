import { InputFieldProps } from "../../components/InputField";

interface CardProps extends InputFieldProps {
  title: string;
  toggle?: boolean;
  margin?: boolean;
}

const Textarea = ({ title, ...others }: CardProps) => {
  return (
    <div className="flex flex-col items-center justify-center mt-2 w-full">
      <label className="text-[1rem] text-black dark:text-white font-[500] w-[80%] ml-2">
        {title}
      </label>
      <div className="w-[80%] flex items-center justify-center bg-slate-100 dark:bg-neutral-800 rounded-lg mt-[8px] ml-[8px]">
        <textarea
          rows={3}
          {...others}
          className="bg-transparent flex-1 outline-0 border-0 mx-2"
        ></textarea>
      </div>
    </div>
  );
};

export default Textarea;
