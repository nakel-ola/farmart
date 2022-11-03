import { useLazyQuery } from "@apollo/client";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  IoRadioButtonOffOutline,
  IoRadioButtonOnOutline,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Coupon } from "../../../typing";
import Button from "../../components/Button";
import CardTemplate from "../../components/CardTemplate";
import calculateDiscount from "../../helper/calculateDiscount";
import { addCoupon, getBasketTotal } from "../../redux/features/basketSlice";
import { selectUser } from "../../redux/features/userSlice";
import { RootState } from "../../redux/store";
import { VerifyCouponQuery } from "../sidecart/Footer";
import PromoCard from "../sidecart/PromoCard";

let stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Payment = ({ onNext }: { onNext: (value: string) => void }) => {
  const [type, setType] = useState("Paystack");
  const [input, setInput] = useState("");

  const { basket, coupon, shippingFee } = useSelector(
    (store: RootState) => store.basket
  );
  const user = useSelector(selectUser);

  const router = useRouter();

  let sessionId= router.query?.session_id

  const price = getBasketTotal(basket);

  const dispatch = useDispatch();

  const [verifyCoupon] = useLazyQuery<{ verifyCoupon: Coupon }>(
    VerifyCouponQuery,
    {
      onCompleted: (data) => {
        console.log(data);
        dispatch(addCoupon(data.verifyCoupon));
      },
      onError: (err: any) => console.table(err),
    }
  );

  const handleApply = () => {
    verifyCoupon({
      variables: {
        input: {
          email: user?.email,
          coupon: input,
        },
      },
    });
  };

  const createStripeSession = async () => {
    const stripe = await stripePromise;
    const res = await axios.post("/api/checkout_sessions", {
      products: basket,
      discount: null,
      email: user?.email,
    });

    console.log(res.data);

    const result = await stripe?.redirectToCheckout({
      sessionId: res.data.id,
    });

    console.log(result);
  };

  return (
    <div className="w-full grid place-items-center mt-5">
      <CardTemplate title="Payment Summary">
        <div className="w-[90%] items-start my-2 ml-[25px] cursor-pointer">
          <div className="w-[70%]">
            {coupon ? (
              <div className="font-medium text-black dark:text-white">
                <strong className="text-primary">{coupon?.code}</strong> is
                Applyed
              </div>
            ) : (
              <PromoCard
                value={input}
                placeholder="Coupon Code"
                onChange={(e: any) => setInput(e.target.value)}
                onClear={() => setInput("")}
                handleApply={handleApply}
              />
            )}
          </div>
          <div className="py-[5px] pl-[2px] cursor-pointer flex items-center">
            <strong className="text-base font-medium text-black dark:text-white">
              Items Total:{" "}
            </strong>
            <p className="text-black dark:text-white pl-2">
              ${price.toFixed(2)}
            </p>
          </div>

          <div className="py-[5px] pl-[2px] cursor-pointer flex items-center">
            <strong className="text-base font-medium text-black dark:text-white">
              Shipping fee:{" "}
            </strong>
            <p className="text-black dark:text-white pl-2">${shippingFee}</p>
          </div>

          {coupon && (
            <div className="py-[5px] pl-[2px] cursor-pointer flex items-center">
              <strong className="text-base font-medium text-black dark:text-white">
                Discount:{" "}
              </strong>
              <p className="text-red-600 font-medium pl-2">
                {" "}
                -{coupon?.discount}%
              </p>
            </div>
          )}

          <div className="py-[5px] pl-[2px] cursor-pointer flex items-center">
            <strong className="text-base font-medium text-black dark:text-white">
              Total:{" "}
            </strong>
            <p className="text-primary font-bold pl-2">
              $
              {Number(
                (coupon ? calculateDiscount(price, coupon?.discount) : price) +
                  Number(shippingFee) ?? 0
              ).toFixed(2)}
            </p>
          </div>
        </div>
      </CardTemplate>

      <CardTemplate title="Select a payment method" className="my-4">
        <div
          className="flex w-[90%] items-start my-2 ml-[25px] cursor-pointer"
          onClick={() => {
            setType("Paystack");
          }}
        >
          <div className="flex justify-center items-center mt-[3px]">
            {type === "Paystack" ? (
              <IoRadioButtonOnOutline className="text-[25px] text-primary" />
            ) : (
              <IoRadioButtonOffOutline className="text-[25px] text-primary" />
            )}
          </div>
          <div className="pl-2">
            <p className="font-medium text-black dark:text-white">Paystack</p>
            <p className="font text-neutral-800 dark:text-neutral-300">
              Pay with a secure platform
            </p>
          </div>
        </div>

        <div
          className="flex w-[90%] items-start my-2 ml-[25px] cursor-pointer"
          onClick={() => setType("Cash On Delivery")}
        >
          <div className="flex justify-center items-center mt-[3px]">
            {type === "Cash On Delivery" ? (
              <IoRadioButtonOnOutline className="text-[25px] text-primary" />
            ) : (
              <IoRadioButtonOffOutline className="text-[25px] text-primary" />
            )}
          </div>
          <div className="pl-2">
            <p className="font-medium text-black dark:text-white">
              Cash On Delivery
            </p>
            <p className="font text-neutral-800 dark:text-neutral-300">
              Not available for your orders
            </p>
          </div>
        </div>
      </CardTemplate>

      <div className="w-full grid place-items-center mb-4">
        <Button onClick={createStripeSession}>{sessionId ? "Proceed" : "Pay Now"}</Button>
      </div>
    </div>
  );
};

export default Payment;
