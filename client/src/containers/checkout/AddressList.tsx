import { useQuery } from "@apollo/client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import Divider from "../../components/Divider";
import PopupTemplate from "../../components/PopupTemplate";
import { AddressesQuery } from "../../pages/address";
import { remove } from "../../redux/features/dialogSlice";

const AddressList = ({
  func,
  defaultAddress,
}: {
  func: any;
  defaultAddress: any;
}) => {
  const dispatch = useDispatch();

  const close: any = () => dispatch(remove({ type: "selectAddress" }));

  const { data } = useQuery(AddressesQuery, {
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (e: any) => {
      console.table(e);
    },
  });

  return (
    <PopupTemplate title="Select Address" onOutsideClick={close}>
      {data?.addresses.map((address: any, index: number) => (
        <div key={index} className=" pl-[15px]">
          <Card
            {...address}
            isSelected={defaultAddress.id === address.id}
            handleSelect={() => {
              func?.(address);
              close();
            }}
          />
          {index !== data?.addresses.length - 1 && <Divider />}
        </div>
      ))}
    </PopupTemplate>
  );
};

const Card = ({
  id,
  name,
  street,
  city,
  state,
  country,
  phoneNumber,
  phoneNumber2,
  info,
  handleSelect,
  isSelected,
}: {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  phoneNumber: string;
  phoneNumber2: string;
  info: string;
  isSelected: boolean;
  handleSelect(value: any): void;
}) => {
  return (
    <div className="w-full px-[10px] py-[5px]">
      <p className="p-[2px] font-medium text-black dark:text-white ">{name}</p>
      <p className="text-black dark:text-white p-[2px] ">
        {[street, city, state, country].join(",")}
      </p>
      <p className="text-black dark:text-white p-[2px]">
        {phoneNumber} {phoneNumber2 && "," + phoneNumber2}
      </p>
      <p className="text-black dark:text-white p-[2px]">{[info].join(",")}</p>
      {!isSelected && (
        <div className="">
          <Button
            className="text-blue-600 bg-blue-600/10 "
            onClick={() =>
              handleSelect({
                id,
                name,
                street,
                city,
                state,
                country,
                phoneNumber,
                phoneNumber2,
                info,
              })
            }
          >
            Select
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddressList;
