import { ArrowLeft } from "iconsax-react";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import { removeAll, selectBasket } from "../../redux/features/basketSlice";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const basket = useSelector(selectBasket);

  return (
    <div className="fixed top-0 z-10 w-full bg-white dark:bg-dark flex items-center justify-between py-1">
      <div className="flex items-center">
        <button
          className="w-[35px] h-[35px] rounded-full flex items-center justify-center m-[5px]"
          onClick={() => router.back()}
        >
          <ArrowLeft
            size={25}
            className="text-[25px] text-black dark:text-white"
          />
        </button>
        <p className="text-[1.2rem] font-[600] text-black dark:text-white">
          Cart
        </p>
      </div>

      {basket.length > 0 && (
        <Button
          onClick={() => dispatch(removeAll())}
          className="bg-transparent text-primary"
        >
          Clear ({basket.length})
        </Button>
      )}
    </div>
  );
};

export default Navbar;
