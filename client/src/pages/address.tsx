import { gql, useQuery } from "@apollo/client";
import { AnimatePresence } from "framer-motion";
import { Book } from "iconsax-react";
import Head from "next/head";
import { useState } from "react";
import ReactLoading from "react-loading";
import type { AddressType } from "../../typing";
import CardTemplate from "../components/CardTemplate";
import Divider from "../components/Divider";
import Header from "../components/Header";
import AddressCard from "../containers/address/AddressCard";
import AddressForm from "../containers/address/AddressForm";
import Layouts from "../layout/Layouts";
import { AddressesResponse } from "../types/graphql.types";

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
      userId
      phoneNumber
      phoneNumber2
      default
    }
  }
`;

const Address = () => {
  const [toggle, setToggle] = useState<boolean | AddressType>(false);

  const { data, refetch, loading } = useQuery<AddressesResponse>(
    AddressesQuery,
    {
      onError: (e: any) => console.table(e),
    }
  );

  return (
    <>
      <Layouts>
        <Head>
          <title>Address</title>
        </Head>

        <Header />

        {loading ? (
          <div className="w-full h-[80%] flex items-center justify-center">
            <ReactLoading type="spinningBubbles" />
          </div>
        ) : (
          <div className="w-full shrink-0 flex flex-col items-center justify-center mt-2">
            <CardTemplate
              title="Address"
              showEditButton
              editTitle="Create"
              onEditClick={() => setToggle(true)}
            >
              {data && data?.addresses.length > 0 ? (
                <div className="">
                  {data?.addresses.map((address, index: number) => (
                    <div key={index} className="ml-[15px]">
                      <AddressCard
                        {...address}
                        refetch={refetch}
                        onEdit={() => setToggle(address)}
                      />
                      {index !== data.addresses.length - 1 && <Divider />}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center m-2 my-8">
                  <Book
                    size={100}
                    className="text-5xl text-neutral-700 dark:text-neutral-400"
                  />
                  <p className="text-neutral-700 dark:text-neutral-400 text-lg font-bold">
                    No Address yet!
                  </p>
                </div>
              )}
            </CardTemplate>
          </div>
        )}
      </Layouts>
      <AnimatePresence>
        {toggle && (
          <AddressForm
            func={() => refetch()}
            onClose={() => setToggle(false)}
            address={(typeof toggle !== "boolean" && toggle) as AddressType}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Address;
