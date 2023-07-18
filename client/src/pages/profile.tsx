import { useApolloClient, useMutation } from "@apollo/client";
import { AnimatePresence } from "framer-motion";
import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { ChangeEvent, useState } from "react";
import ReactLoading from "react-loading";
import { useDispatch } from "react-redux";
import Button from "../components/Button";
import Header from "../components/Header";
import LoginCard from "../components/LoginCard";
import { LogoutMutation } from "../components/Sidebar";
import UserInfo from "../components/UserInfo";
import AccountSettingCard from "../containers/profile/AccountSettingCard";
import ImageCard from "../containers/profile/ImageCard";
import PasswordCard from "../containers/profile/PasswordCard";
import UserEdit from "../containers/profile/UserEdit";
import capitalizeFirstLetter from "../helper/capitalizeFirstLetter";
import { toBase64 } from "../helper/toBase64";
import useUser from "../hooks/useUser";
import Layouts from "../layout/Layouts";
import { logout } from "../redux/features/userSlice";

export type ImageType = {
  file: File | null;
  url: string | ArrayBuffer;
};

const Profile: NextPage = () => {
  const { data } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();
  const user = data?.user;
  const [logOut] = useMutation(LogoutMutation);
  const client = useApolloClient();
  const { getUser } = useUser(true);

  const [image, setImage] = useState<ImageType>({
    file: null,
    url: "",
  });
  const [loading, setLoading] = useState(false);

  const [toggle, setToggle] = useState({
    edit: false,
    image: false,
  });

  const items = [
    {
      name: "Full Name",
      value: user?.name!,
    },
    {
      name: "Email Address",
      value: user?.email!,
    },
    {
      name: "Gender",
      value: user?.gender! ? capitalizeFirstLetter(user?.gender) : "none",
    },
    {
      name: "Phone Number",
      value: user?.phoneNumber! ?? "none",
    },
    {
      name: "Birthday",
      value: user?.birthday ? new Date(user?.birthday!).toDateString() : "none",
    },
  ];

  const handleLogOut = async () => {
    await signOut({ redirect: false }).then(({ ok, error }: any) => {
      if (ok) {
        client.resetStore().then(() => {
          dispatch(logout());
          router.push("/");
        });
      } else {
        console.log(error);
      }
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
              onEditClick={() => setToggle({ ...toggle, edit: true })}
              showAvatarEditButton
            />
            <AccountSettingCard />

            <PasswordCard setLoading={setLoading} />

            <Button
              onClick={handleLogOut}
              className="mb-2 text-primary bg-transparent"
            >
              Log Out
            </Button>
          </div>
        ) : (
          <LoginCard />
        )}
      </Layouts>

      <AnimatePresence>
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
          <ImageCard setImage={setImage} image={image} func={() => getUser()} />
        )}

        {toggle.edit && user && (
          <UserEdit
            user={user}
            func={() => getUser()}
            onClose={() => setToggle({ ...toggle, edit: false })}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Profile;
