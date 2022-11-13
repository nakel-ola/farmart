import { gql, useQuery } from "@apollo/client";
import { DirectboxNotif } from "iconsax-react";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import CardTemplate from "../components/CardTemplate";
import Divider from "../components/Divider";
import Header from "../components/Header";
import AddressCard from "../containers/address/AddressCard";
import AddressForm from "../containers/address/AddressForm";
import Layouts from "../layout/Layouts";
import { add, selectDialog } from "../redux/features/dialogSlice";
import ReactLoading from "react-loading";




export const AddressesQuery = gql`
  query Addresses {
    addresses {
      id
      name
      street
      city
      state
      country
      info
      phoneNumber
      phoneNumber2
      default
    }
  }
`;

const Address = () => {
  const dispatch = useDispatch();
  const dialog = useSelector(selectDialog);

  const { data, refetch, loading } = useQuery(AddressesQuery, {
    onError: (e: any) => {
      console.log(e);
    },
  });

  return (
    <>
      <Layouts>
        <Head>
          <title>Address</title>
        </Head>

        <Header />

        {loading ? (
          <div className="w-full h-[80%] flex items-center justify-center">
            <ReactLoading type='spinningBubbles' />
          </div>
        ) : (
          <div className="w-full shrink-0 flex flex-col items-center justify-center mt-2">
            <CardTemplate
              title="Address"
              showEditButton
              editTitle="Create"
              onEditClick={() =>
                dispatch(
                  add({
                    open: true,
                    data: null,
                    type: "address",
                  })
                )
              }
            >
              {data?.addresses.length > 0 ? (
                <div className="">
                  {data?.addresses.map((address: any, index: number) => (
                    <div key={index} className="ml-[15px]">
                      <AddressCard {...address} refetch={refetch} />
                      {index !== data.addresses.length - 1 && <Divider />}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center m-2 my-8">
                  <DirectboxNotif
                    size={100}
                    className="text-5xl text-neutral-700 dark:text-neutral-400"
                  />
                  <p className="text-neutral-700 dark:text-neutral-400 text-lg font-bold">
                    No Inbox yet!
                  </p>
                </div>
              )}
            </CardTemplate>
          </div>
        )}
      </Layouts>
      {dialog.address.open && <AddressForm func={() => refetch()} />}
    </>
  );
};

export default Address;
