import { gql, useMutation } from "@apollo/client";
import { AnimatePresence } from "framer-motion";
import { Edit, Trash } from "iconsax-react";
import { useState } from "react";
import { AddressType } from "../../../typing";
import Button from "../../components/Button";
import DeleteCard from "../../components/DeleteCard";

type Props = AddressType & {
  refetch(): void;
  onEdit(): void;
};

const AddressDeleteMutation = gql`
  mutation DeleteAddress($id: ID!) {
    deleteAddress(id: $id) {
      message
    }
  }
`;

const AddressCard = (props: Props) => {
  const {
    id,
    name,
    street,
    city,
    state,
    country,
    phoneNumber,
    phoneNumber2,
    info,
    refetch,
    onEdit,
  } = props;

  const [toggle, setToggle] = useState(false);

  const onClose = () => setToggle(false);

  const [deleteAddress, { loading }] = useMutation(AddressDeleteMutation, {
    onCompleted: (data) => {
      refetch();
      onClose();
    },
    onError: (error) => console.table(error),
  });

  return (
    <>
      <div className="w-full md:w-[70%] px-[10px] py-[5px]">
        <p className="p-[2px] font-medium text-black dark:text-white ">
          {name}
        </p>
        <p className="text-black dark:text-white p-[2px] ">
          {[street, city, state, country].join(",")}
        </p>
        <p className="text-black dark:text-white p-[2px]">
          {phoneNumber} {phoneNumber2 && "," + phoneNumber2}
        </p>
        <p className="text-black dark:text-white p-[2px]">{[info].join(",")}</p>
        <div className="flex items-center">
          <Button
            className="text-green-600 bg-green-600/10 flex items-center"
            onClick={onEdit}
          >
            <Edit size={20} className="mr-1" /> Edit
          </Button>
          <Button
            className="text-red-600 bg-red-600/10 flex items-center"
            onClick={() => setToggle(true)}
          >
            <Trash size={20} className="mr-1" /> Delete
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {toggle && (
          <DeleteCard
            onClose={onClose}
            onDelete={() => deleteAddress({ variables: { id } })}
            loading={loading}
            message="Are you sure you want to delete this address ?"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AddressCard;
