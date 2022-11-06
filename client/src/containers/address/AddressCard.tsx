import { gql, useMutation } from "@apollo/client";
import { Edit, Trash } from "iconsax-react";
import { useDispatch } from "react-redux";
import Button from "../../components/Button";
import { add } from "../../redux/features/dialogSlice";

type Props = {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  phoneNumber: string;
  phoneNumber2: string;
  info: string;
  refetch(): void;
};

const AddressDeleteMutation = gql`
  mutation DeleteAddress($id: ID!) {
    deleteAddress(id: $id) {
      msg
    }
  }
`;

const AddressCard = ({
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
}: Props) => {
  const dispatch = useDispatch();
  const [deleteAddress] = useMutation(AddressDeleteMutation, {
    onCompleted: (data) => {
      refetch();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <div className="w-full md:w-[70%] px-[10px] py-[5px]">
      <p className="p-[2px] font-medium text-black dark:text-white ">{name}</p>
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
          onClick={() => {
            dispatch(
              add({
                type: "address",
                open: true,
                data: {
                  id,
                  name,
                  street,
                  city,
                  state,
                  country,
                  phoneNumber,
                  phoneNumber2,
                  info,
                },
              })
            );
          }}
        >
          <Edit size={20} className="mr-1" /> Edit
        </Button>
        <Button
          className="text-red-600 bg-red-600/10 flex items-center"
          onClick={() => deleteAddress({ variables: { id } })}
        >
          <Trash size={20} className="mr-1" /> Delete
        </Button>
      </div>
    </div>
  );
};

export default AddressCard;
