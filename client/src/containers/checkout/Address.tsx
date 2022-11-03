import { Bag2, Book1 } from "iconsax-react";
import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "../../components/Button";
import CardTemplate from "../../components/CardTemplate";
import { add } from "../../redux/features/dialogSlice";
import AddressCard from "./AddressCard";
import Delivery from "./Delivery";

const Address = ({
  onNext,
  address,
  deliveryMethod,
  setDeliveryMethod,
  setPickup,
}: {
  address: any;
  deliveryMethod: any;
  setPickup: (value: string) => void;
  setDeliveryMethod: (value: any) => void;
  onNext: (value: any) => void;
}) => {
  const dispatch = useDispatch();

  return (
    <Fragment>
      <CardTemplate
        className="my-4"
        title="Shipping Address"
        showEditButton
        editTitle="Change"
        onEditClick={() =>
          dispatch(
            add({
              type: "selectAddress",
              open: true,
              data: null,
            })
          )
        }
      >
        {address && <AddressCard {...address} />}

        {!address && (
          <div className="grid my-10 place-items-center">
            <div className="flex items-center justify-center flex-col">
              <Book1
                size={100}
                className="text-neutral-700 dark:text-neutral-400"
              />
              <p className="text-neutral-700 dark:text-neutral-400 text-lg font-semibold my-1">
                Choose an address
              </p>
            </div>
          </div>
        )}
      </CardTemplate>
      <Delivery
        setPickup={setPickup}
        deliveryMethod={deliveryMethod}
        setDeliveryMethod={setDeliveryMethod}
      />
      <div className="w-full grid place-items-center mb-4">
        <Button disabled={!deliveryMethod || !address} onClick={() => onNext(address)}>Next</Button>
      </div>
    </Fragment>
  );
};

export default Address;
