import { AnimatePresence } from "framer-motion";
import { DirectboxNotif } from "iconsax-react";
import { useRouter } from "next/router";
import React, { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { InboxData, InboxType } from "../../../typing";
import Button from "../../components/Button";
import CardTemplate from "../../components/CardTemplate";
import { Divider } from "../../components/Divider";
import Pagination from "../../components/Pagination";
import { roundUp } from "../../pages/orders";
import { add } from "../../redux/features/dialogSlice";
import CreateInboxCard from "./CreateInboxCard";

type Props = {
  data: InboxData;
  refetch(page?: number): void;
  canEdit: boolean;
};

let limit = 5;
const IndoxCard = ({ data, refetch }: Props) => {
  const router = useRouter();
  let pageCount = roundUp(Math.abs(data?.totalItems! / limit));

  const [toggle, setToggle] = useState(false);

  return (
    <>
      <CardTemplate
        title="Customer Inbox"
        showEditButton
        editTitle="Send inbox"
        className="mb-8"
        onEditClick={() => setToggle(true)}
      >
        {data.results.length > 0 ? (
          <div className="">
            {data.results.map((result: InboxType, index: number) => (
              <div key={index}>
                <Card {...result} />
                {index !== data.results.length - 1 && <Divider />}
              </div>
            ))}
            <div className="grid place-items-center w-full">
              {pageCount > 1 && (
                <Pagination
                  width="border-t-[1px] border-slate-100 dark:border-neutral-800 w-full"
                  pageCount={pageCount}
                  forcePage={data?.page ?? 1}
                  pageRangeDisplayed={10}
                  breakLabel="•••"
                  onPageChange={(e, page) => refetch(page)}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center m-2 my-8">
            <DirectboxNotif
              size={100}
              className="text-5xl text-neutral-700 dark:text-neutral-400"
            />
            <p className="text-black dark:text-white text-lg">No Inbox yet!</p>
          </div>
        )}
      </CardTemplate>

      <AnimatePresence>
        {toggle && (
          <CreateInboxCard
            func={refetch}
            customerId={router.query.cid?.toString()!}
            onClose={() => setToggle(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const Card = (props: InboxType) => {
  const { userId, title, description, createdAt } = props;
  return (
    <>
      <div className="m-2 mx-4">
        <h1 className="text-base font-medium text-black dark:text-white">
          {props.title}
        </h1>
        <p className="text-neutral-600 text-base dark:text-neutral-400">
          {props.description}
        </p>
        <time className="text-sm text-neutral-600 dark:text-neutral-400">
          {new Date(props.createdAt).toDateString()}
        </time>
      </div>
    </>
  );
};

export default IndoxCard;
