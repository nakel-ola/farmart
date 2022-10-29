import { ArrowLeft } from "iconsax-react";
import { useRouter } from "next/router";
import { ChangeEvent } from "react";
import { IoCameraOutline } from "react-icons/io5";
import Avatar from "../../components/Avatar";
import { toBase64 } from "../../helper/toBase64";

function TitleCard({ title, subtitle, photoUrl, setImage }: any) {
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = e.target.files;
      const newUrl = await toBase64(fileList[0]);
      setImage(newUrl);
    }
  };

  return (
    <div className="pt-[15px] mt-[10px] pr-[10px] pb-[10px] pl-[15px] flex items-center flex-col justify-center w-full md:w-[80%] rounded-lg shadow-sm bg-white dark:bg-dark dark:shadow-black/30 ">
      <input
        type="file"
        id="image"
        name="image"
        accept="image/*"
        multiple={false}
        className="hidden"
        onChange={handleChange}
      />

      <div className="relative">
        <Avatar
          src={photoUrl}
          className="rounded-full w-[100px] h-[100px] relative"
          alt={title}
        />

        <label
          htmlFor="image"
          className="absolute bottom-1 right-1 w-[25px] h-[25px] bg-white dark:bg-dark shadow rounded-full flex items-center justify-center border-0 outline-0 active:scale-95 hover:scale-105 transition-all duration-300"
        >
          <IoCameraOutline size={20} className="text-black dark:text-white" />
        </label>
      </div>
      <div className="pl-[10px] p-[5px] text-center">
        <p className="text-[1.3rem] p-[1px] text-primary font-medium md:text-black md:dark:text-white">
          {title}
        </p>
        <p className="p-[1px] font-[0.9rem] font-[500] text-[#424242] dark:text-neutral-400 ">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default TitleCard;
