import { DirectboxNotif } from "iconsax-react";
import { useRouter } from "next/router";
import React, { ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { InboxData, InboxType } from "../../../typing";
import Button from "../../components/Button";
import { Divider } from "../../components/Divider";
import Pagination from "../../components/Pagination";
import { roundUp } from "../../pages/orders";
import { add } from "../../redux/features/dialogSlice";

type Props = {
  data: InboxData;
  refetch: any;
  canEdit: boolean;
};

let limit = 5;
const IndoxCard = ({ data, refetch, canEdit }: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  let pageCount = roundUp(Math.abs(data?.totalItems! / limit));

  const handlePageChange = (e: ChangeEvent, page: number) => {
    refetch({
      customerId: router.query.cid,
      input: { page, limit, customerId: router.query.cid },
    });
  };

  return (
    <>
      <div className="w-[95%] md:w-[80%] rounded-lg dark:bg-dark dark:shadow-black/30 bg-white shadow-sm overflow-hidden pb-2 mb-2">
        <div className="w-full border-b-[1px] border-b-slate-100 dark:border-b-neutral-800 flex items-center justify-between">
          <p className="py-[8px] pl-[15px] text-[1.2rem] text-black font-[600] dark:text-white">
            Customer Inbox
          </p>

          {canEdit && (
            <Button
              className="text-green-600 bg-green-600/10"
              onClick={() =>
                dispatch(add({ type: "inbox", open: true, data: null }))
              }
            >
              Send inbox
            </Button>
          )}
        </div>

        {data.results.length > 0 ? (
          <div className="">
            {data.results.map((result: InboxType, index: number) => (
              <div key={index}>
                <Card {...result} />
                {index !== data.results.length - 1 && <Divider />}
              </div>
            ))}
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
      </div>
      <div className="grid place-items-center w-[95%] md:w-[80%] mb-8">
        {pageCount > 1 && (
          <Pagination
            pageCount={pageCount}
            forcePage={data?.page ?? 1}
            pageRangeDisplayed={10}
            breakLabel="•••"
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

const Card = (props: InboxType) => {
  return (
    <>
      <div className="m-2 mx-4">
        <h1 className="text-lg font-medium text-black dark:text-white">
          {props.title}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
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
