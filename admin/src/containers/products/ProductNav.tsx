import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import Button from "../../components/Button";
import CategoryCard from "./CategoryCard";

const ProductNav = () => {

  const [toggle, setToggle] = useState(false);

  return (
    <>
      <Button
        className="text-black dark:text-white bg-slate-100 dark:bg-neutral-800 "
        onClick={() => setToggle(true)}
      >
        Create categories
      </Button>

      <AnimatePresence>
        {toggle && <CategoryCard onClose={() => setToggle(false)} />}
      </AnimatePresence>
    </>
  );
};

export default ProductNav;
