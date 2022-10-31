import { CloseCircle, SearchNormal1, Sort } from "iconsax-react";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { add } from "../redux/features/dialogSlice";

const SearchCard = () => {
  const router = useRouter();
  const dispatch = useDispatch()

  const [text, setText] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push(`/search/${text}`);
  };

  return (
    <div
      className={`ml-auto flex items-center ${
        text ? "flex-[0.5]" : "flex-[0.3]"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className={`bg-slate-100 dark:bg-neutral-800  items-center py-[5px] px-[10px] rounded-full transition-all duration-300 ease hidden md:flex`}
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

      <button
        type="button"
        className=" ml-2 h-[35px] w-[35px] bg-slate-100 dark:bg-neutral-800 flex items-center justify-center rounded-full"
        onClick={() => dispatch(add({ data: null, open: true, type: "filter"}))}
      >
        <Sort />
      </button>
    </div>
  );
};

export default SearchCard;
