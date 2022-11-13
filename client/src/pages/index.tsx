import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useRef, useState } from "react";
import { IoFilter } from "react-icons/io5";
import { useDispatch } from "react-redux";
import Banners from "../containers/home/Banners";
import Cards from "../containers/home/Cards";
import InputField from "../containers/home/InputField";
import Layouts from "../layout/Layouts";
import { add } from "../redux/features/dialogSlice";

const Home: NextPage = () => {
  const ref = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const [input, setInput] = useState("");

  const dispatch = useDispatch();


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push(`/search/?q=${input}`);
  };

  return (
    <Layouts ref={ref}>
      <Head>
        <title>Home</title>
      </Head>

      <form
        className="w-full grid place-items-center pt-[5px] md:hidden"
        onSubmit={handleSubmit}
      >
        <InputField
          endAction={
            <IoFilter
              className="text-[25px] text-primary"
              onClick={() =>
                dispatch(add({ data: null, open: true, type: "filter" }))
              }
            />
          }

          value={input}
          onChange={(e: any) => setInput(e.target.value)}
          placeholder="Search by product"
          clearInput={() => setInput("")}
        />
        <button type="submit" style={{ display: "none" }}></button>
      </form>

      <Banners />
      <Cards containerRef={ref} />
    </Layouts>
  );
};
export default Home;
