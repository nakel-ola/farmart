import { gql, useMutation, useQuery } from "@apollo/client";
import { AnimatePresence } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import ReactLoading from "react-loading";
import { useSelector } from "react-redux";
import Button from "../../components/Button";
import DeleteCard from "../../components/DeleteCard";
import UserInfo from "../../components/UserInfo";
import CouponCard from "../../containers/customer/CouponCard";
import IndoxCard from "../../containers/customer/IndoxCard";
import UserOrders from "../../containers/customer/UserOrders";
import setting from "../../data/setting";
import Layout from "../../layout/Layout";
import { useSession } from "next-auth/react";

const CustomerQuery = gql`
  query user($uid: ID, $input: InboxInput!) {
    user(uid: $uid) {
      id
      email
      name
      gender
      birthday
      photoUrl
      phoneNumber
      blocked
      createdAt
      updatedAt
    }

    coupons(customerId: $uid) {
      id
      userId
      code
      discount
      expiresIn
      description
    }

    inboxes(input: $input) {
      page
      totalItems
      results {
        id
        title
        description
        userId
        createdAt
      }
    }
  }
`;

const BlockMutation = gql`
  mutation BlockUser($input: BlockUserInput!) {
    blockUser(input: $input) {
      message
    }
  }
`;

let limit: number = 5;

const Customer = () => {
  const router = useRouter();
  let customerId = router.query.cid;
  const { data: sessionData } = useSession()
  const user = sessionData?.user;

  const [toggle, setToggle] = useState(false);

  const variables = {
    uid: customerId,
    input: { page: 1, limit, customerId },
  };

  const { data, loading, refetch } = useQuery(CustomerQuery, {
    variables,
    onError: (err) => console.table(err),
  });

  const [blockUser, { loading: blockLoading }] = useMutation(BlockMutation);

  const newData = data && data.user;

  let canEdit = user?.level === "Gold" || user?.level === "Silver";

  const blockData = {
    blocked: newData?.blocked ? false : true,
    email: newData?.email,
    customerId: newData?.id,
  };

  const items = newData
    ? [
        {
          name: "Full Name",
          value: newData?.name,
        },
        {
          name: "Email Address",
          value: newData?.email,
        },
        {
          name: "Gender",
          value: newData?.gender ?? "none",
        },
        {
          name: "Phone Number",
          value: newData?.phoneNumber,
        },
        {
          name: "Birthday",
          value: newData?.birthday
            ? new Date(newData?.birthday).toDateString()
            : "none",
        },
        {
          name: "Created At",
          value: new Date(newData?.createdAt).toDateString(),
        },
        {
          name: "Last updated",
          value: new Date(newData?.updatedAt).toDateString(),
        },
      ]
    : [];

  const onClose = () => setToggle(false);

  const handleBlock = async () => {
    await blockUser({
      variables: { input: blockData },
      onCompleted: () => {
        refetch(variables);
      },
    });
    onClose();
  };

  return (
    <>
      <Head>
        <title>Customer | {newData?.name} </title>
      </Head>
      <Layout>
        {loading ? (
          <div className="w-full h-full pt-[20px] flex items-center justify-center">
            <ReactLoading type="spinningBubbles" color={setting.primary} />
          </div>
        ) : (
          <>
            {newData && (
              <div className="w-full shrink-0 flex flex-col items-center m-0 md:m-[10px] md:pb-0 mt-8 lg:mt-10">
                <UserInfo
                  title="Customer Infomation"
                  items={items}
                  photoUrl={newData.photoUrl}
                  showEditButton={false}
                />
                <CouponCard
                  data={data?.coupons!}
                  canEdit={canEdit}
                  refetch={() => refetch(variables)}
                  user={newData}
                />
                <div className="w-[95%] md:w-[80%] ">
                  <UserOrders />
                </div>

                <IndoxCard
                  data={data?.inboxes!}
                  refetch={(page: number) =>
                    refetch({
                      uid: customerId,
                      input: { page: page ?? 1, limit, customerId },
                    })
                  }
                  canEdit={canEdit}
                />

                {user?.level === "Gold" && (
                  <div className="w-[95%] md:w-[80%] grid place-items-center mb-8">
                    <Button
                      className="text-red-600 bg-red-600/10"
                      onClick={() => setToggle(true)}
                    >
                      {newData.blocked ? "Unblock user" : "Block user"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </Layout>

      <AnimatePresence>
        {toggle && (
          <DeleteCard
            loading={blockLoading}
            message={`Are you sure you want to ${
              newData.blocked ? "unblock" : "block"
            } this user ?`}
            onClose={onClose}
            onDelete={handleBlock}
            title={`${newData.blocked ? "Unblock" : "Block"}`}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Customer;
