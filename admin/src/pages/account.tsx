import { gql, useQuery } from "@apollo/client";
import { AnimatePresence } from "framer-motion";
import Head from "next/head";
import React, { ChangeEvent, useState } from "react";
import ReactLoading from "react-loading";
import UserInfo from "../components/UserInfo";
import ImageCard from "../containers/account/ImageCard";
import InviteCard from "../containers/account/InviteCard";
import PasswordCard from "../containers/account/PasswordCard";
import EmployeeEdit from "../containers/employee/EmployeeEdit";
import setting from "../data/setting";
import capitalizeFirstLetter from "../helper/capitalizeFirstLetter";
import { toBase64 } from "../helper/toBase64";
import useUser from "../hooks/useUser";
import Layout from "../layout/Layout";
import { useSession } from "next-auth/react";

const EmployeeInvitesQuery = gql`
  query EmployeeInvites {
    employeeInvites {
      id
      email
      status
      level
      createdAt
    }
  }
`;

export type ImageType = {
  file: File | null;
  url: string | ArrayBuffer;
};


const Account = () => {

  const { data: sessionData } = useSession()
  const user = sessionData?.user;
  const [image, setImage] = useState<ImageType>({
    file: null,
    url: "",
  });
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState({
    edit: false,
    image: false,
  });
  const { getUser } = useUser(true);

  const { data, loading: userLoading, refetch } = useQuery(EmployeeInvitesQuery, {
    onError: (error) => console.table(error),
  });

  const items = user
    ? [
        {
          name: "Full Name",
          value: user?.name,
        },
        {
          name: "Email Address",
          value: user?.email,
        },
        {
          name: "Gender",
          value: user?.gender! ? capitalizeFirstLetter(user?.gender) : "none",
        },
        {
          name: "Phone Number",
          value: user?.phoneNumber,
        },
        {
          name: "Level",
          value: user?.level,
        },
        {
          name: "Birthday",
          value: user?.birthday
            ? new Date(user?.birthday!).toDateString()
            : "none",
        },
      ]
    : [];

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = e.target.files;
      const newUrl = await toBase64(fileList[0]);
      setImage({ url: newUrl, file: fileList[0] });
    }
  };

  return (
    <>
      <Layout>
        <Head>
          <title>Account</title>
        </Head>

        {userLoading ? (
          <div className="w-full h-full pt-[20px] flex items-center justify-center">
            <ReactLoading type="spinningBubbles" color={setting.primary} />
          </div>
        ) : (
          <>
            {user && (
              <div className="w-full shrink-0 flex flex-col items-center justify-center m-0 md:m-[10px] mt-2 lg:mt-10">
                <UserInfo
                  title="My Infomation"
                  items={items!}
                  photoUrl={user.photoUrl}
                  onAvatarChange={handleChange}
                  onEditClick={() => setToggle({ ...toggle, edit: true })}
                  showAvatarEditButton
                />

                {user?.level === "Gold" ? (
                  <InviteCard
                    data={data.employeeInvites}
                    func={() => refetch()}
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

      <AnimatePresence>
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

        {toggle.edit && (
          <EmployeeEdit
            user={user!}
            func={() => getUser()}
            onClose={() => setToggle({ ...toggle, edit: false })}
            isAuth
          />
        )}

        {image.url && (
          <ImageCard setImage={setImage} image={image} func={() => getUser()} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Account;
