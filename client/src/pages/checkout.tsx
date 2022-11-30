import { gql, useMutation, useQuery } from "@apollo/client";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { Book1, Wallet2 } from "iconsax-react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddressType, Basket } from "../../typing";
import EmptyCart from "../components/EmptyCart";
import Header from "../components/Header";
import LoginCard from "../components/LoginCard";
import AddressForm from "../containers/address/AddressForm";
import Address from "../containers/checkout/Address";
import AddressList from "../containers/checkout/AddressList";
import Payment from "../containers/checkout/Payment";
import Popup from "../containers/checkout/Popup";
import Summary from "../containers/checkout/Summary";
import Layouts from "../layout/Layouts";
import {
  getBasketTotal,
  removeAll,
  removeCoupon,
} from "../redux/features/basketSlice";
import { selectDialog } from "../redux/features/dialogSlice";
import { selectUser } from "../redux/features/userSlice";
import { RootState } from "../redux/store";
import { AddressesQuery } from "./address";

const OrderMutation = gql`
  mutation CreateOrder($input: OrderInput!) {
    createOrder(input: $input) {
      id
      orderId
      trackingId
      userId
    }
  }
`;

const Checkout: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [progress, setProgress] = useState<string>("address");
  const [deliveryMethod, setDeliveryMethod] = useState<
    "Door Delivery" | "Pickup Station"
  >("Door Delivery");
  const [pickup, setPickup] = useState<string | null>(null);
  const [address, setAddress] = useState<AddressType | null>(null);
  const { basket, coupon, shippingFee } = useSelector(
    (store: RootState) => store.basket
  );

  const dialog = useSelector(selectDialog);
  const user = useSelector(selectUser);

  const { refetch } = useQuery(AddressesQuery, {
    onCompleted: (data) => {
      setAddress(data?.addresses[0]);
    },
    onError: (e: any) => {
      console.table(e);
    },
  });

  const [createOrder] = useMutation(OrderMutation);

  const handleAddress = () => {
    setProgress("payment");
  };

  const handleOrder = async (type: string, paymentId: string) => {
    const data = {
      totalPrice: `${Number(getBasketTotal(basket)).toFixed(2)}`,
      pickup,
      address: !pickup
        ? {
            name: address!.name,
            street: address!.street,
            city: address!.city,
            state: address!.state,
            country: address!.country,
            info: address!.info,
            phoneNumber: address!.phoneNumber,
            phoneNumber2: address!.phoneNumber2,
          }
        : null,
      coupon: coupon
        ? {
            id: coupon.id,
            email: coupon.email,
            coupon: coupon.code,
            discount: coupon.discount,
            userId: coupon.userId,
            description: coupon.description,
            expiresIn: coupon.expiresIn,
          }
        : null,
      paymentMethod: type,
      shippingFee: `${shippingFee}`,
      phoneNumber: pickup ? user?.phoneNumber : null,
      deliveryMethod,
      products: basket.map((b: Basket) => ({
        id: b.id,
        quantity: b.quantity,
        price: `${b.price * b.quantity}`,
      })),
      paymentId,
    };
    await createOrder({
      variables: {
        input: data,
      },
      onCompleted: (data) => {
        router.push(`/success?orderId=${data.createOrder.id}`);
        dispatch(removeAll());
      },
      onError: (data) => {
        console.table(data);
      },
    });
  };

  // "Variable "$input" got invalid value { totalPrice: "226.69", pickup: null, address: { name: "John Doe", street: "32, Suberu lamidi harmony estate agege lagos", city: "Ota", state: "Ogun State", country: "Nigeria", info: null, phoneNumber: "+2349152663635", phoneNumber2: null }, coupon: null, paymentMethod: "Stripe", shippingFee: "2", phoneNumber: null, deliveryMethod: "Door Delivery", products: [[Object], [Object], [Object], [Object], [Object]], paymentId: "pi_3M9fFgGWZB98mBX81yNBFkfN" }; Field "paymentId" is not defined by type "OrderInput"."

  return (
    <>
      <Layouts disabled={basket.length === 0}>
        <Head>
          <title>Checkout</title>
        </Head>

        <Header title="Checkout" />

        {user ? (
          basket.length >= 1 ? (
            <>
              <Stepper progress={progress} setProgress={setProgress} />

              <div className="w-full grid place-items-center">
                {progress === "address" && (
                  <Address
                    address={address}
                    onNext={handleAddress}
                    setPickup={setPickup}
                    deliveryMethod={deliveryMethod}
                    setDeliveryMethod={setDeliveryMethod}
                  />
                )}
                {progress === "payment" && <Payment onNext={handleOrder} />}
              </div>
            </>
          ) : (
            <EmptyCart />
          )
        ) : (
          <LoginCard />
        )}
      </Layouts>

      {dialog.selectAddress.open && (
        <AddressList func={setAddress} defaultAddress={address} />
      )}
      {dialog.delivery.open && (
        <Popup
          setDeliveryMethod={setDeliveryMethod}
          deliveryMethod={deliveryMethod}
          pickup={pickup}
          setPickup={setPickup}
        />
      )}

      {dialog.address.open && <AddressForm func={() => refetch()} />}
    </>
  );
};

type StepperProps = {
  progress: string;
  setProgress(value: string): void;
};

const Stepper = (props: StepperProps) => {
  const { progress, setProgress } = props;

  let isAddress = progress === "address" || progress === "payment";
  let isPayment = progress === "payment" || progress === "checkout";

  return (
    <div className="w-full grid place-items-center">
      <div className="flex items-center justify-center w-[285px] overflow-hidden">
        <div
          className={`shrink-0 h-[45px] w-[45px] flex items-center justify-center rounded-full  ${
            isAddress ? "bg-primary cursor-pointer" : "bg-neutral-300"
          }`}
          onClick={() => isAddress && setProgress("address")}
        >
          <Book1 variant="Bold" size={25} className="text-white text-[25px]" />
        </div>

        <span
          className={`w-[50px] h-[5px] ${
            progress === "address" ||
            progress === "payment" ||
            progress === "checkout"
              ? "bg-primary"
              : "bg-neutral-300"
          }`}
        ></span>

        <div
          className={`shrink-0 h-[45px] w-[45px] flex items-center justify-center rounded-full ${
            isPayment ? "bg-primary cursor-pointer" : "bg-neutral-300"
          }`}
          onClick={() => isPayment && setProgress("payment")}
        >
          <Wallet2
            variant="Bold"
            size={25}
            className="text-white text-[25px]"
          />
        </div>
      </div>

      <div className="flex items-center justify-around w-[200px]">
        <p className="text-black dark:text-white font-medium">Address</p>
        <p className="text-black dark:text-white font-medium">Payment</p>
      </div>
    </div>
  );
};

export default Checkout;
