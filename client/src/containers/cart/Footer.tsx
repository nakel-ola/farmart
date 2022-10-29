import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Button from "../../components/Button";
import { getBasketTotal, selectBasket } from "../../redux/features/basketSlice";

const Footer = () => {
  const router = useRouter();
  const basket = useSelector(selectBasket);

  return (
    <div className="grid place-items-center bottom-0 fixed z-10 dark:bg-dark bg-white w-full">
      <div className="w-[90%] flex items-center justify-between mt-2 mb-4">
        <div className="flex items-center">
          <strong className="text-black dark:text-white">Total: </strong>
          <p className="pl-2 text-black dark:text-white">${getBasketTotal(basket).toFixed(2)}</p>
        </div>
        <Button
          className="bg-primary text-white"
          onClick={() => router.push("/checkout")}
        >
          Checkout
        </Button>
      </div>
    </div>
  );
};

export default Footer;
