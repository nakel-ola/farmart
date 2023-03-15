import { gql, useMutation, useQuery } from "@apollo/client";
import { AnimatePresence } from "framer-motion";
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
import clean from "../helper/clean";
import Layouts from "../layout/Layouts";
import { getBasketTotal, removeAll } from "../redux/features/basketSlice";
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
  const [toggle, setToggle] = useState({
    createAddress: false,
    addressList: false,
    pickup: false,
  });

  const user = useSelector(selectUser);

  const { refetch } = useQuery(AddressesQuery, {
    onCompleted: (data) => {
      setAddress(data?.addresses[0]);
    },
    onError: (e: any) => {
      console.table(e);
    },
  });

  const reset = () =>
    setToggle({ createAddress: false, addressList: false, pickup: false });

  const [createOrder] = useMutation(OrderMutation);

  const handleAddress = () => {
    setProgress("payment");
  };

  const handleOrder = async (type: string, paymentId: string) => {
    const data = {
      totalPrice: `${Number(getBasketTotal(basket)).toFixed(2)}`,
      pickup,
      address: !pickup ? clean({ ...address, __typename: null }) : null,
      coupon: coupon ? clean({ ...coupon, __typename: null }) : null,
      paymentMethod: type,
      shippingFee: `${shippingFee}`,
      phoneNumber: pickup ? user?.phoneNumber : null,
      deliveryMethod,
      products: basket.map((b: Basket) => ({
        productId: b.id,
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

  const handleButtonClick = () => {
    if (address) setToggle({ ...toggle, addressList: true });
    if (!address) setToggle({ ...toggle, createAddress: true });
  };

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
                    onButtonClick={handleButtonClick}
                    onPickClick={() => setToggle({ ...toggle, pickup: true })}
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

      <AnimatePresence>
        {toggle.addressList && (
          <AddressList
            key="address-list"
            func={setAddress}
            defaultAddress={address}
            onClose={reset}
            onCreate={() => setToggle({ ...toggle, createAddress: true })}
          />
        )}

        {toggle.pickup && (
          <Popup
            key="pickup"
            setDeliveryMethod={setDeliveryMethod}
            deliveryMethod={deliveryMethod}
            pickup={pickup}
            setPickup={setPickup}
            onClose={reset}
          />
        )}

        {toggle.createAddress && (
          <AddressForm
            key="create-address"
            func={() => refetch()}
            onClose={reset}
          />
        )}
      </AnimatePresence>
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
