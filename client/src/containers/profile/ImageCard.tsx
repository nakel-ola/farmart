import { gql, useMutation } from "@apollo/client";
import { Edit2 } from "iconsax-react";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import Avatar from "../../components/Avatar";
import Button from "../../components/Button";
import LoadingCard from "../../components/LoadingCard";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import { ImageType } from "../../pages/profile";
import { selectUser } from "../../redux/features/userSlice";
import { UploadResponse } from "../../types/graphql.types";
import { UpdateUserMutation } from "./UserEdit";

const UploadMutation = gql`
  mutation UploadFile($file: Upload!) {
    uploadFile(file: $file) {
      url
    }
  }
`;

interface Props {
  setImage: React.Dispatch<React.SetStateAction<ImageType>>;
  image: ImageType;
  func: () => void;
}

const ImageCard: React.FC<Props> = ({ setImage, image, func }) => {
  const user = useSelector(selectUser);
  const ref = useRef<HTMLDivElement>(null);

  const [updateUser, { loading: userLoading }] =
    useMutation(UpdateUserMutation);
  const [uploadFile, { loading: uploadLoading }] =
    useMutation<UploadResponse>(UploadMutation);

  const reset = () => setImage({ file: null, url: "" });

  useOnClickOutside(ref, reset);

  const upload = async () =>
    new Promise<string>(async (resolve, reject) => {
      await uploadFile({
        variables: { file: image.file },
        onCompleted: (data) => resolve(data.uploadFile.url),
        onError: (err) => console.table(err),
      });
    });

  const handleSubmit = async () => {
    const url = await upload();
    if (!url) return;

    await updateUser({
      variables: { input: { photoUrl: url } },
      onCompleted: (data) => {
        func?.();
        reset();
        console.log(data);
      },
      onError: (err) => console.table(err),
    });
  };

  const loading = userLoading || uploadLoading;

  return (
    <div className="fixed top-0 w-full h-full z-[999999] bg-black/50 grid place-items-center">
      <div
        ref={ref}
        className="w-[300px] h-[200px] bg-white dark:bg-dark rounded-xl shadow dark:shadow-black grid place-items-center"
      >
        {loading ? (
          <LoadingCard
            title={uploadLoading ? "Uploading image" : "Updating your photo"}
          />
        ) : (
          <>
            <div className="relative w-[100px] h-[100px]">
              <Avatar
                src={image.url.toString()}
                className="rounded-full w-[100px] h-[100px] relative"
                alt={user?.name}
              />

              <label
                htmlFor="image"
                className="absolute bottom-1 right-1 w-[25px] h-[25px] bg-white dark:bg-dark shadow rounded-full flex items-center justify-center border-0 outline-0 active:scale-95 hover:scale-105 transition-all duration-300"
              >
                <Edit2 size={20} className="text-black dark:text-white" />
              </label>
            </div>

            <div className="flex w-full items-center justify-center">
              <Button
                className="bg-slate-100 dark:bg-neutral-800 text-black dark:text-white"
                onClick={reset}
              >
                Cancel
              </Button>
              <Button
                disabled={!image}
                onClick={handleSubmit}
                className="bg-primary text-white"
              >
                Submit
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageCard;
