import { TicketDiscount, Trash } from "iconsax-react";
import React from "react";
import { IoQrCode } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { Coupon } from "../../../typing";
import Button from "../../components/Button";
import CardTemplate from "../../components/CardTemplate";
import { add } from "../../redux/features/dialogSlice";

const CouponCard = ({
  data,
  canEdit,
}: {
  data: Coupon[];
  canEdit: boolean;
}) => {
  const dispatch = useDispatch();

  return (
    <CardTemplate
      title="Customer coupons"
      showEditButton
      editTitle={
        canEdit && (
          <Button
            className="text-green-600 bg-green-600/10 mr-2"
            onClick={() =>
              dispatch(add({ open: true, data: null, type: "coupon" }))
            }
          >
            Create coupon
          </Button>
        )
      }
      className="pb-2 mt-8"
    >

      {data && data?.length > 0 ? (
        <div className="grid place-items-center">
          <div className="flex flex-wrap items-center justify-center md:justify-start md:items-evenly w-[95%]">
            {data?.map((coupon: Coupon, index: number) => (
              <Card key={index} {...coupon} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center m-2 my-8">
          <TicketDiscount
            size={100}
            className="text-5xl text-neutral-700 dark:text-neutral-400"
          />
          <p className="text-black dark:text-white text-lg">No Coupon yet!</p>
        </div>
      )}
    </CardTemplate>
  );
};

const Card = (props: Coupon) => {
  const dispatch = useDispatch();
  return (
    <article className="relative w-[95%] md:w-[300px] lg:w-[350px] min-h-[140px] bg-slate-200/30 dark:bg-neutral-800 shadow m-3 md:m-3 lg:m-3 mx-4 rounded-lg ">
      <div className="relative h-full w-full mx-[17.5px] flex xs:flex-col-reverse xs:justify-center sm:flex-row">
        <div className="xs:w-[85%] w-[50%] flex flex-col justify-between">
          <div className="">
            <h1 className="m-2 mb-0 text-3xl font-bold text-primary xs:text-center">
              {props.discount}% Off
            </h1>
            <p className="mx-2 text-neutral-700 font-medium xs:text-center dark:text-neutral-400 text-sm">
              {props.description?.length! > 0
                ? props.description
                : "On your next purchase"}
            </p>
          </div>
          {props.expiresIn && (
            <p className="m-2 text-neutral-700 xs:text-center font-medium dark:text-neutral-400 text-sm">
              Use before {new Date(Number(props.expiresIn)).toDateString()}
            </p>
          )}
        </div>
        <div className="xs:mb-1 xs:w-[85%] w-[50%] flex items-center justify-center flex-col">
          <div className="bg-transparent">
            <IoQrCode className="text-8xl text-primary" />
          </div>
          <p className="font-bold text-primary">{props.code}</p>
        </div>
      </div>

      <div className="absolute top-[50%] translate-y-[-50%] left-[-17.5px] h-[35px] w-[35px] bg-white dark:bg-dark rounded-full" />

      <div
        className="absolute top-[50%] translate-y-[-50%] right-[-17.5px] h-[35px] w-[35px] bg-red-600/10 z-[1] rounded-full flex items-center justify-center hover:scale-105 active:scale-95 cursor-pointer"
        onClick={() =>
          dispatch(
            add({
              open: true,
              data: {
                id: props.id,
                message: `
                    Are you sure you want to delete coupon with code:${" "}
                    <strong className="text-red-600">${props.code}</strong> ?
                `,
              },
              type: "delete",
            })
          )
        }
      >
        <Trash className="text-red-600 " />
      </div>
    </article>
  );
};

export default CouponCard;
