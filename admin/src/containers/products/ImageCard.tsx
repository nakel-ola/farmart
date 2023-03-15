/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
import { ChangeEvent, useState } from "react";
import { InputFieldProps } from "../../components/InputField";
import { toBase64 } from "../../helper/toBase64";

interface CardProps extends InputFieldProps {
  title?: string;
  toggle?: boolean;
  margin?: boolean;
  image?: File | string | null;
}

// Oranges
// fresh oranges avaliable

// Vegetables
// get your vegetables

const ImageCard = ({ title, image, onChange, ...others }: CardProps) => {
  const [url, setUrl] = useState<string | null>(null);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    let files = e.target.files;
    if (e.target.validity.valid && files && files.length > 0) {
      onChange(files[0]);
      const newUrl = await toBase64(files[0]);
      setUrl(newUrl as string);
    }
  };

  const isUrl = url || typeof image === "string";
  return (
    <div className="flex flex-col items-center justify-center mt-2 w-full">
      <label className="text-[1rem] text-black dark:text-white font-[500] w-[80%] ml-2">
        {title}
      </label>
      <div
        className={clsx(
          `w-[80%] flex  justify-between my-2 `,
          isUrl ? "flex-col items-start" : "items-center"
        )}
      >
        {isUrl ? (
          <div className="w-full rounded-lg h-[120px] overflow-hidden mb-2">
            <img
              src={url! ?? image!}
              alt=""
              className="object-cover h-full w-full md:hover:scale-125"
            />
          </div>
        ) : (
          <div className="h-[36px] bg-slate-100 dark:bg-neutral-800 rounded-lg flex-1 overflow-hidden flex mr-2">
            <input
              readOnly
              placeholder="No file chosen"
              required
              className="border-0 outline-0 h-full bg-transparent mx-1"
            />
          </div>
        )}

        <label
          htmlFor="image"
          className="bg-primary rounded-lg px-2 h-[34px] mx-1 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center text-white cursor-pointer"
        >
          Choose File
        </label>
      </div>

      <input
        type="file"
        id="image"
        name="image"
        accept="image/*"
        multiple={false}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
};

export default ImageCard;
