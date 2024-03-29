import { Fragment } from "react";
import {
  IoRadioButtonOffOutline,
  IoRadioButtonOnOutline,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import CardTemplate from "../../components/CardTemplate";
import { selectShipping } from "../../redux/features/basketSlice";
import { add } from "../../redux/features/dialogSlice";

interface Props {
  deliveryMethod: "Door Delivery" | "Pickup Station";
  setDeliveryMethod: React.Dispatch<
    React.SetStateAction<"Door Delivery" | "Pickup Station">
  >;
  setPickup: React.Dispatch<React.SetStateAction<string | null>>;
  onPickClick(): void;
}
const Delivery: React.FC<Props> = (props) => {
  const { deliveryMethod, setDeliveryMethod, setPickup, onPickClick } = props;
  const dispatch = useDispatch();
  const shippingFee = useSelector(selectShipping);

  return (
    <Fragment>
      <CardTemplate className="mb-4" title="Select a delivery method">
        <div
          className="flex w-[90%] ml-[25px] items-start my-2 cursor-pointer py-2"
          onClick={() => {
            setPickup("");
            setDeliveryMethod("Door Delivery");
          }}
        >
          <div className="flex justify-center items-center mt-[3px]">
            {deliveryMethod === "Door Delivery" ? (
              <IoRadioButtonOnOutline className="text-[25px] text-primary" />
            ) : (
              <IoRadioButtonOffOutline className="text-[25px] text-primary" />
            )}
          </div>
          <div className="pl-2">
            <p className="font-medium text-black dark:text-white">
              Door Delivery
            </p>
            <p className="font text-neutral-800 dark:text-neutral-300">
              Delivery between{" "}
              <strong className="font-medium text-black dark:text-white">
                Wednesday 14 Sep
              </strong>{" "}
              and{" "}
              <strong className="font-medium text-black dark:text-white">
                Thursday 22 Sep
              </strong>{" "}
              for{" "}
              <strong className="font-medium text-primary">
                {" "}
                {shippingFee ? `$${shippingFee}` : "Free"}
              </strong>
            </p>
          </div>
        </div>

        <div
          className="flex w-[90%] items-start my-2 ml-[25px] cursor-pointer"
          onClick={onPickClick}
        >
          <div className="flex justify-center items-center mt-[3px]">
            {deliveryMethod === "Pickup Station" ? (
              <IoRadioButtonOnOutline className="text-[25px] text-primary" />
            ) : (
              <IoRadioButtonOffOutline className="text-[25px] text-primary" />
            )}
          </div>
          <div className="pl-2">
            <p className="font-medium text-black dark:text-white">
              Pickup Station
            </p>
            <p className="font text-neutral-800 dark:text-neutral-300">
              Ready for pickup between{" "}
              <strong className="font-medium text-black dark:text-white">
                Wednesday 14 Sep
              </strong>{" "}
              and{" "}
              <strong className="font-medium text-black dark:text-white">
                Thursday 22 Sep
              </strong>{" "}
              for <strong className="font-medium text-primary">Free</strong>
            </p>
          </div>
        </div>
      </CardTemplate>
    </Fragment>
  );
};

export default Delivery;
