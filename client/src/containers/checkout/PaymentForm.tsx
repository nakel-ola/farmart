import {
  Elements,
  ElementsConsumer,
  PaymentElement,
  useElements,
  useStripe,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  CardElement
} from "@stripe/react-stripe-js";
import * as stripeJs from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import Stripe from "stripe";
import Button from "../../components/Button";
import CardTemplate from "../../components/CardTemplate";
import setting from "../../data/setting";
import { useTheme } from "../../styles/theme";

type Props = FormProps & {
  stripePromise: Promise<stripeJs.Stripe | null>;
  clientSecret: string;
};

const PaymentForm = (props: Props) => {
  const { stripePromise, clientSecret, onNext, setSuccess } = props;

  const { systemTheme, theme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  let isDark = currentTheme === "dark";

  const options: stripeJs.StripeElementsOptions = {
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
    <CardTemplate title="Enter card details" className="mb-4">
      <div className="flex w-[90%] items-center justify-center my-2 ml-[25px] cursor-pointer pt-5">
        <Elements stripe={stripePromise} options={options}>
          <Form onNext={onNext} setSuccess={setSuccess} />
        </Elements>
      </div>
    </CardTemplate>
  );
};

export default PaymentForm;

type FormProps = {
  setSuccess: Dispatch<SetStateAction<boolean>>;
  onNext(value: string, id: string): void;
};

const Form = (props: FormProps) => {
  const { onNext, setSuccess } = props;
  const elements = useElements();
  const stripe = useStripe();
  const { data } = useSession();
  const user = data?.user;

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<stripeJs.StripePaymentElementChangeEvent | null>(null)

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
      {/* <CardElement /> */}
      <PaymentElement className="" onChange={setForm} />
      <div className="w-full grid place-items-center mt-4">
        <Button disabled={!stripe || loading || !form?.complete}>
          {loading ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </form>
  );
};
