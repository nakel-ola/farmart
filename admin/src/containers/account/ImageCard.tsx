import { gql, useMutation } from "@apollo/client";
import { Edit2 } from "iconsax-react";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import Avatar from "../../components/Avatar";
import Button from "../../components/Button";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import { ImageType } from "../../pages/account";


const UpdateMutation = gql`
  mutation UpdateEmployeePhotoUrl($image: Upload!){
    updateEmployeePhotoUrl(image: $image) {
      msg
    }
  }
`;

const ImageCard = ({
  setImage,
  image,
  func
}: {
  setImage(value: ImageType): void;
  image: ImageType;
  func: any
}) => {
  const { user } = useSelector((store: any) => store.user);
  const ref = useRef<HTMLDivElement>(null);

  const [updateEmployeePhotoUrl] = useMutation(UpdateMutation)

  useOnClickOutside(ref, () =>
    setImage({
      file: null,
      url: "",
    })
  );

  const handleSubmit = async () => {
    await updateEmployeePhotoUrl({
      variables: {
        image: image.file
      },
      onCompleted: () => {
        func?.();
        setImage({
          file: null,
          url: "",
        })
      },
      onError: (err) => console.table(err)
    })
  };

  return (
    <div className="fixed top-0 w-full h-full z-[999999] bg-black/50 grid place-items-center">
      <div
        ref={ref}
        className="w-[300px] h-[200px] bg-white dark:bg-dark rounded-xl shadow dark:shadow-black grid place-items-center"
      >
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

        <div className="flex w-full items-center justify-center">
          <Button
            className="bg-slate-100 dark:bg-neutral-800 text-black dark:text-white"
            onClick={() =>
              setImage({
                file: null,
                url: "",
              })
            }
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
      </div>
    </div>
  );
};

export default ImageCard;
