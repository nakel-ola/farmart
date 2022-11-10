import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React from "react";
import ReactLoading from "react-loading";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import Header from "../../components/Header";
import UserInfo from "../../components/UserInfo";
import EmployeeEdit from "../../containers/employee/EmployeeEdit";
import setting from "../../data/setting";
import Layout from "../../layout/Layout";
import { add, selectDialog } from "../../redux/features/dialogSlice";
import { selectUser } from "../../redux/features/userSlice";

const EmployeeQuery = gql`
  query employee($employeeId: ID) {
    employee(employeeId: $employeeId) {
      ... on Employee {
        id
        email
        name
        gender
        birthday
        photoUrl
        phoneNumber
        level
        createdAt
        updatedAt
      }

      ... on ErrorMsg {
        error
      }
    }
  }
`;
const Employee = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  let employeeId = router.query.eid;
  const dialog = useSelector(selectDialog);
  const user = useSelector(selectUser);

  const { data, loading, refetch } = useQuery(EmployeeQuery, {
    variables: { employeeId },
    onError: (err) => console.table(err),
  });

  const newData = data && data.employee;

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
    {
      name: "Level",
      value: newData?.level,
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

  return (
    <>
      <Layout>
        {loading ? (
          <div className="w-full h-full pt-[20px] flex items-center justify-center">
            <ReactLoading type="spinningBubbles" color={setting.primary} />
          </div>
        ) : (
          <>
            <Header />

            {newData && (
              <div className="w-full shrink-0 flex flex-col items-center justify-center m-0 md:m-[10px] md:pb-0 mt-2 ">
                <UserInfo
                  title="Employee Infomation"
                  items={items}
                  photoUrl={newData.photoUrl}
                  showEditButton={user?.level === "Gold"}
                  onEditClick={() =>
                    dispatch(
                      add({
                        open: true,
                        data: newData,
                        type: "employeeEdit",
                      })
                    )
                  }
                />
                {user?.level === "Gold" && (
                  <div className="w-[95%] md:w-[80%] grid place-items-center my-8">
                    <Button className="text-red-600 bg-red-600/10 hover:scale-105 active:scale-95">
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </Layout>

      {dialog.employeeEdit.open && (
        <EmployeeEdit func={() => refetch({ employeeId })} />
      )}
    </>
  );
};

export default Employee;
