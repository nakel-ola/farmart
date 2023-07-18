import { ShoppingCart } from "iconsax-react";
import { useDispatch, useSelector } from "react-redux";
import { selectBasket } from "../redux/features/basketSlice";
import { add } from "../redux/features/dialogSlice";

const CartIcon = () => {
  const dispatch = useDispatch();
  const basket = useSelector(selectBasket);

  return (
    <button
      onClick={() => dispatch(add({ type: "cart", open: true, data: null }))}
      className="relative h-[35px] w-[35px] bg-slate-100 dark:bg-neutral-800 rounded-full flex items-center justify-center"
    >
      <ShoppingCart
        size={25}
        className="text-black dark:text-white text-[25px] relative"
      />
      {basket.length >= 1 && (
        <span className="absolute top-[-2px] right-[-2px] w-[15px] h-[15px] rounded-full flex items-center justify-center bg-primary">
          <p className="text-white text-[0.8rem] font-[500] text-center">
            {basket.length}
          </p>
        </span>
      )}
    </button>
  );
};


export default CartIcon