import { CloseCircle, SearchNormal1 } from "iconsax-react";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

const SearchCard = () => {
  const router = useRouter();

  const [text, setText] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push(`/search/${text}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-slate-100 dark:bg-neutral-800 ml-auto ${
        text ? "flex-[0.5]" : "flex-[0.3]"
      } items-center py-[5px] px-[10px] rounded-full transition-all duration-300 ease hidden md:flex`}
    >
      {!text && (
        <SearchNormal1
          size={20}
          className="text-slate-500 dark:text-slate-100/50 text-[1rem] mr-2"
        />
      )}

      <input
        type="text"
        placeholder="Search by food name"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 outline-0 border-0 bg-transparent dark:text-slate-100 placeholder:dark:text-slate-100/50"
      />

      {text && (
        <CloseCircle
          size={20}
          variant="Bold"
          onClick={() => setText("")}
          className="text-slate-500 text-[1.2rem] dark:text-slate-100/50 cursor-pointer "
        />
      )}

      <button
        type="submit"
        className="hidden"
        disabled={text.length < 1}
      ></button>
    </form>
  );
};

export default SearchCard;
