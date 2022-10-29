import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useRef, useState } from "react";
import { IoFilter } from "react-icons/io5";
import { useSelector } from "react-redux";
import Banners from "../containers/home/Banners";
import Cards from "../containers/home/Cards";
import InputField from "../containers/home/InputField";
import RowButtons from "../containers/home/RowButtons";
import Layouts from "../layout/Layouts";
import { RootState } from "../redux/store";

const Home: NextPage = () => {
  const ref = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const genre = router.query.genre;

  const [input, setInput] = useState("");

  const [open, setOpen] = useState(false);

  const { category } = useSelector((store: RootState) => store.category);

  const capitalizeFirstLetter = (string: string | undefined) =>
    string && string?.charAt(0).toUpperCase() + string?.slice(1);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push(`/search/${input}`);
  };

  return (
    <Layouts ref={ref}>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <form
        className="w-full grid place-items-center bg-white dark:bg-dark pt-[5px] md:hidden"
        onSubmit={handleSubmit}
      >
        <InputField
          endAction={
            <IoFilter
              className="text-[25px] text-primary"
              onClick={() => setOpen(true)}
            />
          }
          value={input}
          onChange={(e: any) => setInput(e.target.value)}
          placeholder="Search by food name"
          clearInput={() => setInput("")}
        />
        <button type="submit" style={{ display: "none" }}></button>
      </form>

      <Banners />

      <RowButtons items={category} />

      <div className="hidden lg:inline py-[5px] ">
        <p className="text-[1.5rem] text-black font-[600] dark:text-white/90 pl-[20px]">
          {capitalizeFirstLetter(
            "/" === router.pathname && !genre ? "all" : genre?.toString()
          )}
        </p>
      </div>
      <Cards categories={category ?? []} containerRef={ref} />
    </Layouts>
  );
};
export default Home;
