import React from "react";
import { useDispatch } from "react-redux";
import Button from "../../components/Button";
import { add } from "../../redux/features/dialogSlice";

const ProductNav = () => {
  const dispatch = useDispatch();

  return (
    <Button
      className="text-black dark:text-white bg-slate-100 dark:bg-neutral-800 "
      onClick={() =>
        dispatch(add({ type: "category", product: null, open: true }))
      }
    >
      Create categories
    </Button>
  );
};

export default ProductNav;
