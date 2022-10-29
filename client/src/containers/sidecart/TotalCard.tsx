/* importing required files and packages */
import { useSelector } from "react-redux";
import calculateDiscount from "../../helper/calculateDiscount";
import { RootState } from "../../redux/store";

const TotalCard = ({ basketTotal }: any) => {
  const { coupon, shippingFee } = useSelector(
    (store: RootState) => store.basket
  );

  return (
    <div className="bg-white dark:bg-dark rounded-lg w-full shadow-md dark:shadow-black/10 my[8px] shadow-primary/20">
      <div className="m-[3px]">
        <div className="flex items-center justify-between p-[8px]">
          {" "}
          <p className="text-[1rem] text-[#000] dark:text-white">
            Subtotal
          </p>{" "}
          <p className="text-[1rem] text-[600] text-black dark:text-white">
            ${basketTotal.toFixed(2)}
          </p>{" "}
        </div>
        <hr className="border-0 h-[1px] bg-[#fafafa] dark:bg-black/10" />
      </div>

      <div className="m-[3px]">
        <div className="flex items-center justify-between p-[8px]">
          {" "}
          <p className="text-[1rem] text-[#000] dark:text-white ">
            Delivery
          </p>{" "}
          <p className="dark:text-white text-dark">
            {shippingFee ? `$${shippingFee}` : "Free"}
          </p>
        </div>{" "}
        <hr className="border-0 h-[1px] bg-[#fafafa] dark:bg-black/10" />
      </div>

      {coupon && (
        <div className="m-[3px]">
          <div className="flex items-center justify-between p-[8px]">
            {" "}
            <p className="text-[1rem] text-[#000] dark:text-white ">
              Discount
            </p>{" "}
            <p className="text-red-600 font-medium"> -{coupon?.discount}%</p>
          </div>{" "}
          <hr className="border-0 h-[1px] bg-[#fafafa] dark:bg-black/10" />
        </div>
      )}

      <div className="m-[3px]">
        <div className="flex items-center justify-between p-[8px]">
          {" "}
          <p className="text-[1rem] text-[#000] font-[600] dark:text-white">
            Total
          </p>{" "}
          <p className="text-[1rem] text-primary font-[600]">
            $
            {Number(
              (coupon
                ? calculateDiscount(basketTotal, coupon?.discount)
                : basketTotal) + shippingFee ?? 0
            ).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TotalCard;
