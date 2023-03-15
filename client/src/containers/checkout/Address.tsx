import { Book1 } from "iconsax-react";
import { Fragment } from "react";
import { AddressType } from "../../../typing";
import Button from "../../components/Button";
import CardTemplate from "../../components/CardTemplate";
import AddressCard from "./AddressCard";
import Delivery from "./Delivery";

interface Props {
  address: AddressType | null;
  deliveryMethod: "Door Delivery" | "Pickup Station";
  setPickup: React.Dispatch<React.SetStateAction<string | null>>;
  setDeliveryMethod: React.Dispatch<
    React.SetStateAction<"Door Delivery" | "Pickup Station">
  >;
  onNext: () => void;
  onButtonClick: () => void;
  onPickClick(): void;
}
const Address: React.FC<Props> = (props) => {
  const {
    onNext,
    address,
    deliveryMethod,
    setDeliveryMethod,
    setPickup,
    onButtonClick,
    onPickClick
  } = props;

  return (
    <Fragment>
      <CardTemplate
        className="my-4"
        title="Shipping Address"
        showEditButton
        editTitle={address ? "Change address" : "Create an address"}
        onEditClick={onButtonClick}
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
        onPickClick={onPickClick}
      />
      <div className="w-full grid place-items-center mb-4">
        <Button disabled={!deliveryMethod || !address} onClick={onNext}>
          Next
        </Button>
      </div>
    </Fragment>
  );
};

export default Address;
