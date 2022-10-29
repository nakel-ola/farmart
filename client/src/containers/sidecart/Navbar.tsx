import { useRouter } from "next/router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import { removeAll, selectBasket } from "../../redux/features/basketSlice";

export const pathMatch = ["/checkout", "/cart"];

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const basket = useSelector(selectBasket);

  const isSummary = pathMatch.includes(router.pathname);

  return (
    <div className="flex items-center justify-between p-[5px] pr-0 ">
      <p className="font-[1.2rem] font-[600] text-black dark:text-white">
        {isSummary ? "Summary" : "Cart"}{" "}
      </p>

      {basket.length > 0 &&
        (isSummary ? (
          <div className="bg-white dark:bg-dark w-[35px] h-[35px] flex items-center justify-center rounded-lg">
            <p className="text-black dark:text-white">{basket.length}</p>
          </div>
        ) : (
          <Button
            className="text-primary bg-transparent"
            onClick={() => dispatch(removeAll())}
          >
            Clear ({basket.length})
          </Button>
        ))}
    </div>
  );
};

export default Navbar;
