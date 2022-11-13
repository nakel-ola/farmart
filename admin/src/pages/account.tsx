import { gql, useMutation, useQuery } from "@apollo/client";
import Head from "next/head";
import React, { ChangeEvent, useState } from "react";
import ReactLoading from "react-loading";
import { useDispatch, useSelector } from "react-redux";
import DeleteCard from "../components/DeleteCard";
import Header from "../components/Header";
import UserInfo from "../components/UserInfo";
import CreateInviteCard from "../containers/account/CreateInviteCard";
import ImageCard from "../containers/account/ImageCard";
import InviteCard from "../containers/account/InviteCard";
import PasswordCard from "../containers/account/PasswordCard";
import EmployeeEdit from "../containers/employee/EmployeeEdit";
import setting from "../data/setting";
import { toBase64 } from "../helper/toBase64";
import Layout from "../layout/Layout";
import { add, selectDialog } from "../redux/features/dialogSlice";
import { selectUser } from "../redux/features/userSlice";

const UserQuery = gql`
  query Employee {
    employee {
      ... on Employee {
        id
        email
        name
        photoUrl
        level
        gender
        birthday
        phoneNumber
        createdAt
        updatedAt
      }

      ... on ErrorMsg {
        error
      }
    }
    employeeInvites {
      ... on EmployeeInvite {
        id
        email
        status
        level
        createdAt
      }

      ... on ErrorMsg {
        error
      }
    }
  }
`;

export type ImageType = {
  file: File | null;
  url: string | ArrayBuffer;
};

const DeleteInvite = gql`
  mutation DeleteEmployeeInvite($id: ID!) {
    deleteEmployeeInvite(id: $id) {
      msg
    }
  }
`;

const Account = () => {
  const user = useSelector(selectUser);
  const [image, setImage] = useState<ImageType>({
    file: null,
    url: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const dialog = useSelector(selectDialog);

  const {
    data,
    loading: userLoading,
    refetch,
  } = useQuery(UserQuery, {
    onError: (error) => console.table(error),
  });

  const [deleteEmployeeInvite, { loading: deleteLoading }] = useMutation(DeleteInvite);

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
    {
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

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = e.target.files;
      const newUrl = await toBase64(fileList[0]);
      setImage({ url: newUrl, file: fileList[0] });
    }
  };

  const handleDelete = async () => {
    await deleteEmployeeInvite({
      variables: { id: dialog.delete.data.id },
      onCompleted: () => {
        refetch({ employeeId: user?.id });
      },
      onError: (err) => console.table(err),
    });
  };

  return (
    <>
      <Layout>
        <Head>
          <title>Profile</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {userLoading ? (
          <div className="w-full h-full pt-[20px] flex items-center justify-center">
            <ReactLoading type="spinningBubbles" color={setting.primary} />
          </div>
        ) : (
          <>
            <Header />

            {newData && (
              <div className="w-full shrink-0 flex flex-col items-center justify-center m-0 md:m-[10px] mt-2">
                <UserInfo
                  title="My Infomation"
                  items={items}
                  photoUrl={newData.photoUrl}
                  onAvatarChange={handleChange}
                  onEditClick={() =>
                    dispatch(
                      add({
                        open: true,
                        data: newData,
                        type: "employeeEdit",
                      })
                    )
                  }
                  showAvatarEditButton
                />

                {user?.level === "Gold" ? (
                  <InviteCard
                    data={data.employeeInvites}
                    func={() => refetch({ employeeId: user?.id })}
                  />
                ) : (
                  <div className="mt-8"></div>
                )}

                <PasswordCard setLoading={setLoading} />
              </div>
            )}
          </>
        )}
      </Layout>

      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.6)] grid place-items-center z-[9999999]">
          <div className="flex items-center justify-center flex-col">
            <ReactLoading type="spinningBubbles" />
            <p className="text-white text-[1.2rem] p-[8px]">
              Updating Password
            </p>
          </div>
        </div>
      )}

      {dialog.employeeEdit.open && (
        <EmployeeEdit func={() => refetch({ employeeId: user?.id })} />
      )}
      {dialog.invite.open && (
        <CreateInviteCard func={() => refetch({ employeeId: user?.id })} />
      )}
      {dialog.delete.open && <DeleteCard func={handleDelete} loading={deleteLoading} />}

      {image.url && (
        <ImageCard
          setImage={setImage}
          image={image}
          func={() => refetch({ employeeId: user?.id })}
        />
      )}
    </>
  );
};

export default Account;
