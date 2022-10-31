import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { ChangeEvent, useState } from "react";
import ReactLoading from "react-loading";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/Button";
import Header from "../components/Header";
import LoginCard from "../components/LoginCard";
import { LogoutMutation } from "../components/Sidebar";
import UserInfo from "../components/UserInfo";
import AccountSettingCard from "../containers/profile/AccountSettingCard";
import ImageCard from "../containers/profile/ImageCard";
import PasswordCard from "../containers/profile/PasswordCard";
import UserEdit from "../containers/profile/UserEdit";
import { toBase64 } from "../helper/toBase64";
import Layouts from "../layout/Layouts";
import { add, selectDialog } from "../redux/features/dialogSlice";
import { login, logout, selectUser } from "../redux/features/userSlice";
import { UserQuery } from "./_app";

export type ImageType = {
  file: File | null;
  url: string | ArrayBuffer;
};

const Profile: NextPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectUser);
  const dialog = useSelector(selectDialog);
  const [logOut] = useMutation(LogoutMutation);
  const client = useApolloClient();

  const {
    data,
    refetch,
  } = useQuery(UserQuery, {
    fetchPolicy: "network-only",
    onCompleted: (results) => {
      if (results.user?.__typename !== "ErrorMsg") {
        dispatch(login(results.user));
      }
    },
    onError: (error) => console.table(error),

  });

  const newData = data && data.user;

  const [image, setImage] = useState<ImageType>({
    file: null,
    url: "",
  });
  const [loading, setLoading] = useState(false);

  const userData = newData ?? user;

  const items = [
    {
      name: "Full Name",
      value: userData?.name!,
    },
    {
      name: "Email Address",
      value: userData?.email!,
    },
    {
      name: "Gender",
      value: userData?.gender!,
    },
    {
      name: "Phone Number",
      value: userData?.phoneNumber!,
    },
    userData?.birthday && {
      name: "Birthday",
      value: new Date(userData?.birthday!).toDateString(),
    },
    {
      name: "Created At",
      value: new Date(userData?.createdAt!).toDateString(),
    },
    {
      name: "Last updated",
      value: new Date(userData?.updatedAt!).toDateString(),
    },
  ].filter(Boolean);

  const handleLogOut = async () => {
    await logOut({
      onCompleted: () => {
        client.resetStore().then(() => {
          dispatch(logout());
          router.push("/");
        });
      },
      onError: (er) => console.table(er),
    });
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = e.target.files;
      const newUrl = await toBase64(fileList[0]);
      setImage({ url: newUrl, file: fileList[0] });
    }
  };

  return (
    <>
      <Layouts>
        <Head>
          <title>Profile | {user?.name}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />

        {user ? (
          <div className="w-full shrink-0 flex flex-col items-center justify-center mt-2">
            <UserInfo
              title="My Infomation"
              items={items}
              photoUrl={user?.photoUrl}
              onAvatarChange={handleChange}
              showEditButton
              onEditClick={() =>
                dispatch(
                  add({
                    open: true,
                    data: newData,
                    type: "userEdit",
                  })
                )
              }
              showAvatarEditButton
            />
            <AccountSettingCard />

            <PasswordCard setLoading={setLoading} />

            <Button onClick={handleLogOut} className="mb-2 text-primary bg-transparent">
              Log Out
            </Button>
          </div>
        ) : (
          <LoginCard />
        )}
      </Layouts>

      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.6)] grid place-items-center z-10">
          <div className="flex items-center justify-center flex-col">
            <ReactLoading type="spinningBubbles" />
            <p className="text-white text-[1.2rem] p-[8px]">
              Updating Password
            </p>
          </div>
        </div>
      )}
      {image.url && (
        <ImageCard
          setImage={setImage}
          image={image}
          func={() => refetch({ userId: user?.id })}
        />
      )}

      {dialog.userEdit.open && (
        <UserEdit func={() => refetch({ employeeId: user?.id })} />
      )}
    </>
  );
};

export default Profile;
