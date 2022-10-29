/* eslint-disable @next/next/no-img-element */
import { Add, Trash } from "iconsax-react";
import React from "react";
import { useDispatch } from "react-redux";
import { BannerType } from "../../../typing";
import { add } from "../../redux/features/dialogSlice";


const Banners = ({ data,canEdit }: { data: BannerType[]; canEdit: boolean }) => {
  const dispatch = useDispatch();

  return (
    <div
      className={`w-full m-3 pl-5 ${
        data && data.length > 0
          ? "flex items-center overflow-scroll"
          : "grid place-items-center"
      } `}
    >
      {data &&
        data.map((banner: BannerType, index: number) => (
          <div
            key={index}
            className="max-h-[200px] w-[80%] mr-2 rounded-lg overflow-hidden shrink-0 relative "
          >
            <img
              src={banner.image}
              alt=""
              className="w-full h-full object-contain relative"
            />


            {canEdit && (
            <button
              className="m-2 font-medium rounded-full text-red-600 hover:bg-red-600/10 absolute top-0 right-0 h-[35px] w-[35px] flex items-center justify-center"
              onClick={() =>
                dispatch(add({
                  type: "delete",
                  open: true,
                  product: {
                    id: banner.id,
                    message: "Are you sure you want to delete banner ?",
                  },
                }))
              }
            >
              <Trash variant="Bold" className="drop-shadow-lg" />
            </button>

            )}

          </div>
        ))}

      <AddCard />
    </div>
  );
};

const AddCard = () => {
  const dispatch = useDispatch();

  return (
    <div
      className="flex items-center justify-center flex-col m-2 mr-4 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 shrink-0"
      onClick={() =>
        dispatch(add({ type: "banner", product: null, open: true }))
      }
    >
      <div className="h-[50px] w-[50px] rounded-full flex items-center justify-center shadow-sm bg-slate-200 dark:bg-neutral-700 mt-2">
        <Add size={50} variant="Outline" />
      </div>
      <p className="font-medium">Create banners</p>
    </div>
  );
};
export default Banners;
