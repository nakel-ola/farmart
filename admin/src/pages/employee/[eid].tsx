import { gql, useMutation, useQuery } from "@apollo/client";
import { AnimatePresence } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import ReactLoading from "react-loading";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import DeleteCard from "../../components/DeleteCard";
import UserInfo from "../../components/UserInfo";
import EmployeeEdit from "../../containers/employee/EmployeeEdit";
import setting from "../../data/setting";
import { UserQuery } from "../../hooks/useUser";
import Layout from "../../layout/Layout";
import { useSession } from "next-auth/react";

const DeleteMutation = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id) {
      message
    }
  }
`;

const Employee = () => {
  const router = useRouter();

  let employeeId = router.query.eid;
  const { data: sessionData } = useSession()
  const user = sessionData?.user;
  const [toggle, setToggle] = useState({ edit: false, delete: false });

  const { data, loading, refetch } = useQuery(UserQuery, {
    variables: { uid: employeeId },
    onError: (err) => console.table(err),
  });

  const [deleteEmployee, { loading: deleteLoading }] =
    useMutation(DeleteMutation);

  const newData = data && data.user;

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
          name: "Level",
          value: newData?.level,
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

  const reset = () => setToggle({ edit: false, delete: false });

  const handleDelete = async () => {
    if (!newData || user?.level !== "Gold") return;
    await deleteEmployee({ variables: { id: newData.id } });
  };

  return (
    <>
      <Head>
        <title>Employee | {user?.name}</title>
      </Head>
      <Layout>
        {loading ? (
          <div className="w-full h-full pt-[20px] flex items-center justify-center">
            <ReactLoading type="spinningBubbles" color={setting.primary} />
          </div>
        ) : (
          <>
            {newData && (
              <div className="w-full shrink-0 flex flex-col items-center justify-center m-0 md:m-[10px] md:pb-0 mt-2 lg:mt-10">
                <UserInfo
                  title="Employee Infomation"
                  items={items}
                  photoUrl={newData.photoUrl}
                  showEditButton={user?.level === "Gold"}
                  onEditClick={() => setToggle({ ...toggle, edit: true })}
                />

                {user?.level === "Gold" && (
                  <div className="w-[95%] md:w-[80%] grid place-items-center my-8">
                    <Button
                      className="text-red-600 bg-red-600/10 hover:scale-105 active:scale-95"
                      onClick={() => setToggle({ ...toggle, delete: true })}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </Layout>

      <AnimatePresence>
        {toggle.edit && (
          <EmployeeEdit
            onClose={reset}
            func={() => refetch({ uid: employeeId })}
            user={newData}
          />
        )}

        {toggle.delete && (
          <DeleteCard
            loading={deleteLoading}
            message="Are you sure you want to delete employee ?"
            onClose={reset}
            onDelete={handleDelete}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Employee;
