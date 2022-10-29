import { Edit2 } from "iconsax-react";
import React, { ChangeEvent, Fragment } from "react";
import Avatar from "./Avatar";
import { Divider } from "./Divider";

type Item = {
  name: string;
  value: string;
};
type Props = {
  items: Item[];
  title: string;
  showEditButton?: boolean;
  showAvatar?: boolean;
  showAvatarEditButton?: boolean;
  photoUrl?: string;
  onAvatarChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onEditClick?: (value?: any) => void;
};

function UserInfo(props: Props) {
  const {
    items,
    title,
    onEditClick,
    showEditButton = true,
    showAvatar = true,
    showAvatarEditButton = false,
    photoUrl,
    onAvatarChange,
  } = props;

  return (
    <div className="w-[95%] md:w-[80%] rounded-lg dark:bg-dark dark:shadow-black/30 bg-white shadow-sm overflow-hidden pb-2">
      <div className="w-full border-b-[1px] border-b-slate-100 dark:border-b-neutral-800 flex items-center justify-between">
        <p className="py-[8px] pl-[15px] text-[1.2rem] text-black font-[600] dark:text-white">
          {title}
        </p>

        {showEditButton && (
          <button
            className={`px-3 mx-2 font-medium rounded-full py-[4px] text-green-600 bg-green-600/10 transition-all hover:scale-105 active:scale-95`}
            onClick={() => onEditClick?.()}
          >
            Edit
          </button>
        )}
      </div>

      <input
        type="file"
        id="image"
        name="image"
        accept="image/*"
        multiple={false}
        className="hidden"
        onChange={(e) => onAvatarChange?.(e)}
      />

      {showAvatar && (
        <div className="my-2 mx-8 relative h-[100px] w-[100px]">
          <Avatar
            src={photoUrl!}
            alt=""
            className="h-[100px] w-[100px] relative"
          />

          {showAvatarEditButton && (
            <label
              htmlFor="image"
              className="absolute bottom-1 right-1 w-[25px] h-[25px] bg-white dark:bg-dark shadow rounded-full flex items-center justify-center border-0 outline-0 active:scale-95 hover:scale-105 transition-all duration-300"
            >
              <Edit2
                size={20}
                className="text-black dark:text-white"
              />
            </label>
          )}
        </div>
      )}

      {items.map((item: Item, index: number) => (
        <Fragment key={index}>
          <div className="py-[5px] pl-[25px] cursor-pointer flex-1">
            <strong className="text-lg font-medium text-black dark:text-white">
            {item.name}
            </strong>
            <p className="text-neutral-700 dark:text-neutral-400">
              {item.value}
            </p>
          </div>
          {index !== items.length - 1 && <Divider />}
        </Fragment>
      ))}
    </div>
  );
}


export default UserInfo;
