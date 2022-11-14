import { Edit2 } from "iconsax-react";
import React, { ChangeEvent, Fragment } from "react";
import Avatar from "./Avatar";
import CardTemplate from "./CardTemplate";
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
    <CardTemplate
      title={title}
      onEditClick={() => onEditClick?.()}
      showEditButton={showEditButton}
      className="pb-2"
    >
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
              <Edit2 size={20} className="text-black dark:text-white" />
            </label>
          )}
        </div>
      )}

      {items.map((item: Item, index: number) => (
        <Fragment key={index}>
          <div className="py-[5px] pl-[25px] cursor-pointer flex-1">
            <strong className="text-base font-medium text-black dark:text-white">
              {item.name}
            </strong>
            <p className="text-neutral-600 text-base dark:text-neutral-400">
              {item.value}
            </p>
          </div>
          {index !== items.length - 1 && <Divider />}
        </Fragment>
      ))}
    </CardTemplate>
  );
}

export default UserInfo;
