import { gql, useMutation, useQuery } from "@apollo/client";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import ReactLoading from "react-loading";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import DeleteCard from "../../components/DeleteCard";
import Header from "../../components/Header";
import UserInfo from "../../components/UserInfo";
import BlockCard from "../../containers/customer/BlockCard";
import CouponCard from "../../containers/customer/CouponCard";
import CreateCouponCard from "../../containers/customer/CreateCouponCard";
import CreateInboxCard from "../../containers/customer/CreateInboxCard";
import IndoxCard from "../../containers/customer/IndoxCard";
import UserOrders from "../../containers/customer/UserOrders";
import setting from "../../data/setting";
import Layout from "../../layout/Layout";
import { add, selectDialog } from "../../redux/features/dialogSlice";
import { selectUser } from "../../redux/features/userSlice";

const CustomerQuery = gql`
  query user($customerId: ID, $input: InboxInput!) {
    user(customerId: $customerId) {
      ... on User {
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

      ... on ErrorMsg {
        error
      }
    }

    coupons(customerId: $customerId) {
      id
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

const DeleteMutation = gql`
  mutation DeleteCoupon($id: ID!) {
    deleteCoupon(id: $id) {
      msg
    }
  }
`;

let limit: number = 5;

const Customer = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  let customerId = router.query.cid;

  const dialog = useSelector(selectDialog);
  const user = useSelector(selectUser);

  const { data, loading, refetch } = useQuery(CustomerQuery, {
    variables: { customerId, input: { page: 1, limit, customerId } },
    onCompleted: (err) => console.table(err),
    onError: (err) => console.table(err),
  });

  const newData = data && data.user;

  let canEdit = user?.level === "Gold" || user?.level === "Silver";

  const blockData = {
    blocked: newData?.blocked ? false : true,
    email: newData?.email,
    customerId: newData?.id,
  };

  const args = {
    customerId,
    input: { page: 1, limit, customerId },
  };

  const items = [
    {
      name: "Full Name",
      value: newData?.name,
    },
    {
      name: "Email Address",
      value: newData?.email,
    },
    newData?.gender && {
      name: "Gender",
      value: newData?.gender,
    },
    {
      name: "Phone Number",
      value: newData?.phoneNumber,
    },
    newData?.birthday && {
      name: "Birthday",
      value: new Date(newData?.birthday).toDateString(),
    },
    {
      name: "Created At",
      value: new Date(newData?.createdAt).toDateString(),
    },
    {
      name: "Last updated",
      value: new Date(newData?.updatedAt).toDateString(),
    },
  ].filter(Boolean);

  const [deleteCoupon, { loading: deleteLoading }] = useMutation(DeleteMutation, {
    onCompleted: (data) => console.log(data),
    onError: (data) => console.table(data),
  });

  const handleDelete = async () => {
    await deleteCoupon({
      variables: { id: dialog.couponDelete.data?.id },
      onCompleted: () => {
        refetch(args);
      },
    });
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
            <Header />

            {newData && (
              <div className="w-full shrink-0 flex flex-col items-center m-0 md:m-[10px] md:pb-0 mt-8 md:mt-0">
                <UserInfo
                  title="Customer Infomation"
                  items={items}
                  photoUrl={newData.photoUrl}
                  showEditButton={false}
                />
                <CouponCard data={data?.coupons!} canEdit={canEdit} />
                <div className="w-[95%] md:w-[80%] ">
                  <UserOrders />
                </div>

                <IndoxCard
                  data={data?.inboxes!}
                  refetch={refetch}
                  canEdit={canEdit}
                />

                {user?.level === "Gold" && (
                  <div className="w-[95%] md:w-[80%] grid place-items-center mb-8">
                    <Button
                      className="text-red-600 bg-red-600/10"
                      onClick={() =>
                        dispatch(
                          add({ open: true, data: blockData, type: "block" })
                        )
                      }
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

      {dialog.block.open && (
        <BlockCard func={() => refetch(args)} blocked={newData.blocked} />
      )}
      {dialog.coupon.open && (
        <CreateCouponCard func={() => refetch(args)} data={newData} />
      )}
      {dialog.delete.open && <DeleteCard func={handleDelete} loading={deleteLoading} />}
      {dialog.inbox.open && (
        <CreateInboxCard
          func={() => refetch(args)}
          customerId={customerId?.toString()!}
        />
      )}
    </>
  );
};

export default Customer;
