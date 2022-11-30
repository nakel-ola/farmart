import { useLazyQuery } from "@apollo/client";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { StripeElementsOptions } from "@stripe/stripe-js";
import axios from "axios";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import {
  IoRadioButtonOffOutline,
  IoRadioButtonOnOutline,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Coupon } from "../../../typing";
import Button from "../../components/Button";
import CardTemplate from "../../components/CardTemplate";
import LoadingCard from "../../components/LoadingCard";
import setting from "../../data/setting";
import calculateDiscount from "../../helper/calculateDiscount";
import getStripe from "../../helper/getStripe";
import { formatAmountForStripe } from "../../helper/stripe-helpers";
import { addCoupon, getBasketTotal } from "../../redux/features/basketSlice";
import { selectUser } from "../../redux/features/userSlice";
import { RootState } from "../../redux/store";
import { useTheme } from "../../styles/theme";
import { VerifyCouponQuery } from "../sidecart/Footer";
import PromoCard from "../sidecart/PromoCard";

const stripePromise = getStripe();

const Payment = ({
  onNext,
}: {
  onNext: (value: string, id: string) => void;
}) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [input, setInput] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState(false);

  const { basket, coupon, shippingFee } = useSelector(
    (store: RootState) => store.basket
  );
  const user = useSelector(selectUser);

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

  const { systemTheme, theme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  const createClientSecret = async () => {
    setLoading(true);
    const amount = basket.reduce(
      (total, item) =>
        total + formatAmountForStripe(item.price * item.quantity, "USD"),
      0
    );
    // Create PaymentIntent as soon as the page loads
    await axios
      .post("/api/create-payment-intent", {
        amount,
      })
      .then((data) => {
        setLoading(false);
        setClientSecret(data.data.clientSecret);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  let isDark = currentTheme === "dark";

  const options: StripeElementsOptions = {
    // passing the client secret obtained from the server
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: setting.primary,
        colorText: isDark ? "white" : "black",
        colorBackground: isDark ? "rgb(38,38,38)" : "rgb(241,245,249)",
        borderRadius: "8px",
      },
    },
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
            setPaymentMethod("Stripe");
            createClientSecret();
          }}
        >
          <div className="flex justify-center items-center mt-[3px]">
            {paymentMethod === "Stripe" ? (
              <IoRadioButtonOnOutline className="text-[25px] text-primary" />
            ) : (
              <IoRadioButtonOffOutline className="text-[25px] text-primary" />
            )}
          </div>
          <div className="pl-2">
            <p className="font-medium text-black dark:text-white">Stripe</p>
            <p className="font text-neutral-800 dark:text-neutral-300">
              Pay with a secure platform
            </p>
          </div>
        </div>

        <div
          className="flex w-[90%] items-start my-2 ml-[25px] cursor-pointer"
          // onClick={() => setPaymentMethod("Cash On Delivery")}
        >
          <div className="flex justify-center items-center mt-[3px]">
            {paymentMethod === "Cash On Delivery" ? (
              <IoRadioButtonOnOutline className="text-[25px] text-primary" />
            ) : (
              <IoRadioButtonOffOutline className="text-[25px] text-neutral-600" />
            )}
          </div>
          <div className="pl-2">
            <p className="font-medium text-neutral-600">Cash On Delivery</p>
            <p className="font text-neutral-600">
              Not available for your orders
            </p>
          </div>
        </div>
      </CardTemplate>

      {loading ? (
        <LoadingCard title="" />
      ) : (
        clientSecret &&
        stripePromise &&
        !success && (
          <CardTemplate showHeader={false} className="mb-4">
            <div className="flex w-[90%] items-center justify-center my-2 ml-[25px] cursor-pointer">
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm onNext={onNext} setSuccess={setSuccess} />
              </Elements>
            </div>
          </CardTemplate>
        )
      )}
    </div>
  );
};

interface CheckoutFormProps {
  setSuccess: Dispatch<SetStateAction<boolean>>;
  onNext(value: string, id: string): void;
}
const CheckoutForm = ({ onNext, setSuccess }: CheckoutFormProps) => {
  const elements = useElements();
  const stripe = useStripe();
  const user = useSelector(selectUser);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
        receipt_email: user?.email,
      },
      redirect: "if_required",
    });

    if (error) {
      console.log(error);
      setSuccess(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onNext("Stripe", paymentIntent?.id);
      setSuccess(true);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} id="paymentform" className="w-full">
      <PaymentElement className="" />
      <div className="w-full grid place-items-center mt-4">
        <Button disabled={!stripe || loading}>
          {loading ? "Processing..." : "Pay"}
        </Button>
      </div>
    </form>
  );
};

export default Payment;
