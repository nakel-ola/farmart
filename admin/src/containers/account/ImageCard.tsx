import { gql, useMutation } from "@apollo/client";
import { Edit2 } from "iconsax-react";
import React from "react";
import { useSelector } from "react-redux";
import Avatar from "../../components/Avatar";
import Button from "../../components/Button";
import LoadingCard from "../../components/LoadingCard";
import PopupTemplate from "../../components/PopupTemplate";
import { ImageType } from "../../pages/account";

const UpdateMutation = gql`
  mutation UpdateEmployeePhotoUrl($image: Upload!) {
    updateEmployeePhotoUrl(image: $image) {
      msg
    }
  }
`;

const ImageCard = ({
  setImage,
  image,
  func,
}: {
  setImage(value: ImageType): void;
  image: ImageType;
  func: any;
}) => {
  const { user } = useSelector((store: any) => store.user);

  const [updateEmployeePhotoUrl, { loading }] = useMutation(UpdateMutation);

  const close = () => setImage({ file: null, url: "" });

  const handleSubmit = async () => {
    await updateEmployeePhotoUrl({
      variables: {
        image: image.file,
      },
      onCompleted: () => {
        func?.();
        setImage({
          file: null,
          url: "",
        });
      },
      onError: (err) => console.table(err),
    });
  };

  return (
    <PopupTemplate title="Change Photo" onOutsideClick={close}>
      {!loading ? (
        <div className="py-[10px] grid place-items-center">
          <div className="relative w-[100px] h-[100px]">
            <Avatar
              src={image.url.toString()}
              className="rounded-full w-[100px] h-[100px] relative"
              alt={user?.title}
            />

            <label
              htmlFor="image"
              className="absolute bottom-1 right-1 w-[25px] h-[25px] bg-white dark:bg-dark shadow rounded-full flex items-center justify-center border-0 outline-0 active:scale-95 hover:scale-105 transition-all duration-300"
            >
              <Edit2 size={20} className="text-black dark:text-white" />
            </label>
          </div>

          <div className="flex w-full items-center justify-center mt-5">
            <Button
              className="bg-slate-100 dark:bg-neutral-800 text-black dark:text-white mx-2"
              onClick={close}
            >
              Cancel
            </Button>
            <Button
              disabled={!image}
              onClick={handleSubmit}
              className="bg-primary text-white mx-2"
            >
              Submit
            </Button>
          </div>
        </div>
      ) : (
        <LoadingCard title="Updating photo" />
      )}
    </PopupTemplate>
  );
};

export default ImageCard;
