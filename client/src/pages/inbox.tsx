import { gql, useQuery } from "@apollo/client";
import { DirectboxNotif } from "iconsax-react";
import Head from "next/head";
import { ChangeEvent } from "react";
import { InboxType } from "../../typing";
import CardTemplate from "../components/CardTemplate";
import Divider from "../components/Divider";
import Header from "../components/Header";
import Pagination from "../components/Pagination";
import roundUp from "../helper/roundUp";
import Layouts from "../layout/Layouts";
import ReactLoading from "react-loading";



const InboxQuery = gql`
  query Inboxes($input: InboxInput!) {
    inboxes(input: $input) {
      page
      totalItems
      results {
        id
        title
        description
        userId
        createdAt
      }
    }
  }
`;

let limit = 5;

const Inbox = () => {

  const { data, loading, refetch } = useQuery(InboxQuery, {
    variables: { input: { page: 1, limit } },
    onCompleted: (err) => console.table(err),
    onError: (err) => console.table(err),
  });

  let pageCount = roundUp(Math.abs(data?.inboxes?.totalItems! / limit));

  const handlePageChange = (e: ChangeEvent, page: number) => {
    refetch({
      input: { page, limit },
    });
  };

  return (
    <Layouts>
      <Head>
        <title>Indox</title>
      </Head>

      <Header />

      {loading ? (
        <div className="w-full h-[80%] flex items-center justify-center">
          <ReactLoading type="spinningBubbles" />
        </div>
      ) : (
        <div className="w-full shrink-0 flex flex-col items-center justify-center mt-2">
          <CardTemplate title="Inbox">
            {data?.inboxes?.results?.length > 0 ? (
              <div className="">
                {data.inboxes.results.map(
                  (result: InboxType, index: number) => (
                    <div key={index}>
                      <Card {...result} />
                      {index !== data.inboxes.results.length - 1 && <Divider />}
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center m-2 my-8">
                <DirectboxNotif
                  size={100}
                  className="text-5xl text-neutral-700 dark:text-neutral-400"
                />
                <p className="text-black dark:text-white text-lg">
                  No Inbox yet!
                </p>
              </div>
            )}
          </CardTemplate>

          <div className="grid place-items-center w-[95%] md:w-[80%] mb-8 mt-4">
            {pageCount > 1 && (
              <Pagination
                pageCount={pageCount}
                forcePage={data.inboxes.page ?? 1}
                pageRangeDisplayed={10}
                breakLabel="•••"
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      )}
    </Layouts>
  );
};

const Card = ({ title, description, createdAt }: InboxType) => {
  return (
    <>
      <div className="m-2 mx-4">
        <h1 className="text-lg font-medium text-black dark:text-white">
          {title}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">{description}</p>
        <time className="text-sm text-neutral-600 dark:text-neutral-400">
          {new Date(createdAt).toDateString()}
        </time>
      </div>
    </>
  );
};

export default Inbox;
