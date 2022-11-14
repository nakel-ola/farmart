import { gql, useMutation } from "@apollo/client";
import { Fade, Grow } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown2 } from "iconsax-react";
import React, { useRef, useState } from "react";
import { IoCheckmark } from "react-icons/io5";
import { OrderProgress, OrderType } from "../../../typing";
import Button from "../../components/Button";
import CardTemplate from "../../components/CardTemplate";
import InputField from "../../components/InputField";
import { statusbg, statusColor } from "../../helper/statusColor";
import useOnClickOutside from "../../hooks/useOnClickOutside";

const UpdateQuery = gql`
  mutation UpdateProgress($input: ProgressInput!) {
    updateProgress(input: $input) {
      msg
    }
  }
`;

const OrderStatus = ({
  order,
  refetch,
}: {
  order: OrderType;
  refetch(): void;
}) => {
  const trueStatus = order.progress.filter((r) => r.checked);
  const [status, setStatus] = useState(
    trueStatus[trueStatus.length - 1]?.name ?? ""
  );

  const [updateProgress] = useMutation(UpdateQuery, {
    onCompleted: () => refetch(),
    onError: (err) => console.table(err),
  });

  const handleUpdate = () => {
    updateProgress({
      variables: {
        input: {
          id: order.id,
          name: status.toLowerCase(),
        },
      },
    });
  };

  let isCanceled = !!order.progress.find(
    (p) => p.name === "canceled" && p.checked === true
  );
  let isDelivered = !!order.progress.find(
    (p) => p.name === "delivered" && p.checked === true
  );
  let isPending = !!order.progress.find(
    (p) => p.name === "pending" && p.checked === true
  );

  return (
    <CardTemplate title="Order Status" className="pb-2 mb-8 ">
      <div className="pl-[25px] mt-5">
        <StatusInputCard
          value={status}
          isCanceled={isCanceled}
          isDelivered={isDelivered}
          isPending={isPending}
          placeholder="Change Progress Status"
          onChange={(value: string) => setStatus(value)}
        />

        <div className="w-[80%] md:w-[60%] mt-5">
          <Button
            className="bg-primary text-white disabled:opacity-40 "
            disabled={
              trueStatus[trueStatus.length - 1]?.name ===
                status.toLowerCase() || !status
            }
            onClick={handleUpdate}
          >
            Save Changes
          </Button>

          <p className="text-black dark:text-white font-medium my-2 mx-1 mb-4">
            Updated {new Date(order.updatedAt).toLocaleString()}
          </p>
        </div>

        <hr className="w-[90%] border-0 h-[1px] bg-slate-100 dark:bg-neutral-800" />

        <div className="md:w-[60%] w-[80%] mt-2">
          {order.progress.map((item: OrderProgress, index: number) => {
            let isLast = index !== order.progress.length - (isCanceled ? 2 : 1);
            let show =
              index === 1
                ? item.name === "canceled" && item.checked
                : index === 2
                ? !isCanceled
                : true;

            return (
              show && (
                <div key={index}>
                  <div className="flex items-center my-2">
                    <div
                      className={`h-[35px] w-[35px] rounded-full  flex items-center justify-center m-2 ${
                        item.checked
                          ? statusbg(item.name)
                          : "bg-slate-100 dark:bg-neutral-800"
                      }`}
                    >
                      <IoCheckmark
                        size={25}
                        className={` ${
                          item.checked
                            ? statusColor(item.name)
                            : "text-black dark:text-white"
                        }`}
                      />
                    </div>

                    <p className="font-medium text-black dark:text-white ml-2">
                      {item.name.toUpperCase()}
                    </p>
                  </div>
                  {isLast && <Divider />}
                </div>
              )
            );
          })}
        </div>
      </div>
    </CardTemplate>
  );
};

const Divider = () => (
  <div className="flex items-center">
    <div className="w-[35px] flex items-center justify-center mx-2">
      <hr className="h-[25px] border-0 w-1 bg-slate-100 dark:bg-neutral-800 rounded-full" />
    </div>
  </div>
);

const StatusInputCard = ({
  value,
  onChange,
  placeholder,
  isCanceled,
  isDelivered,
  isPending
}: {
  value: string | number;
  onChange(value: string): void;
  placeholder?: string;
  isCanceled: boolean;
  isDelivered: boolean;
  isPending: boolean;
}) => {
  const statusList = [
    "Pending",
    !isCanceled && "Delivered",
    !isDelivered && "Canceled",
  ].filter(Boolean) as string[];

  const ref = useRef<HTMLDivElement>(null);
  const [toggle, setToggle] = useState(false);

  useOnClickOutside(ref, () => toggle && setToggle(false));

  let disabled = (isPending && isDelivered) || isPending && isCanceled

  return (
    <div ref={ref} className="relative md:w-[60%] w-[80%] my-2">
      <InputField
        IconLeft="disabled"
        className="relative cursor-pointer"
        inputClassName="cursor-pointer"
        value={value}
        placeholder={placeholder}
        readOnly
        onClick={() => !disabled && setToggle(!toggle)}
        IconRight={
          <div
            className="flex items-center justify-center"
            onClick={() => setToggle(!toggle)}
          >
            <button
              className="flex items-center justify-center border-0 outline-0"
              onClick={() => {}}
            >
              <ArrowDown2
                variant="Bold"
                size={25}
                className="text-[20px] px-[2px] text-[#212121] dark:text-neutral-300"
              />
            </button>
          </div>
        }
      />

      <AnimatePresence>
        {!disabled && toggle && (
          <motion.div
            className={`grid absolute left-0 w-full place-items-center transition-all duration-300 z-[1] mt-1`}
          >
            <motion.div
              className="w-[100%] max-h-[200px] overflow-scroll bg-white dark:bg-dark shadow-md shadow-slate-300 dark:shadow-black/10 rounded-lg scrollbar-hide"
              initial={{ maxHeight: "0px" }}
              animate={{ maxHeight: "200px" }}
              exit={{ height: "0px" }}
              transition={{ duration: 0.3 }}
            >
              {statusList.map((s: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center p-2 cursor-pointer hover:bg-slate-100 dark:bg-neutral-800"
                  onClick={() => {
                    onChange(s);
                    setToggle(false);
                  }}
                >
                  <p className="pl-1 text-black dark:text-white font-medium">
                    {s}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* <Grow
        timeout={{ enter: 500, exit: 500, appear: 500 }}
        appear={toggle}
        in={toggle}
      >
        <div
          className={`grid absolute left-0 w-full place-items-center transition-all duration-300 z-[1] mt-1`}
        >
          <div className="w-[100%] max-h-[200px] overflow-scroll bg-white dark:bg-dark shadow-md shadow-slate-300 dark:shadow-black/10 rounded-lg scrollbar-hide">
            {statusList.map((s: string, index: number) => (
              <div
                key={index}
                className="flex items-center p-2 cursor-pointer hover:bg-slate-100 dark:bg-neutral-800"
                onClick={() => {
                  onChange(s);
                  setToggle(false);
                }}
              >
                <p className="pl-1 text-black dark:text-white font-medium">
                  {s}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Grow> */}
    </div>
  );
};

export default OrderStatus;
