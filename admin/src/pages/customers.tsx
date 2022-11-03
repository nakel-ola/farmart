import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React, { ChangeEvent, useState } from "react";
import Lottie from "react-lottie-player";
import { GraphQLUserResponse, UserData, UserType } from "../../typing";
import Pagination from "../components/Pagination";
import Table from "../components/Table";
import TableContent from "../components/TableContent";
import TableHeader from "../components/TableHeader";
import TableList from "../components/TableList";
import TableRow from "../components/TableRow";
import lottieJson from "../data/lf30_editor_mh2nforn.json";
import truncate from "../helper/truncate";
import Layout from "../layout/Layout";
import { roundUp } from "./orders";

const tableList: string[] = ["Name", "Phone", "Email", "Gender", "Created"];

const UsersQuery = gql`
  query users($input: UsersInput!) {
    users(input: $input) {
      ... on UsersData {
        page
        totalItems
        results {
          id
          email
          name
          gender
          phoneNumber
          createdAt
        }
      }

      ... on ErrorMsg {
        error
      }
    }
  }
`;

let limit = 10;

const Customers = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, refetch } = useQuery<GraphQLUserResponse>(UsersQuery, {
    variables: { input: { admin: false, limit, page: 1 } },
    fetchPolicy: "network-only",
    onError: (data) => console.table(data),
  });

  let pageCount = roundUp(
    Math.abs((data?.users as UserData)?.totalItems! / limit)
  );

  const handlePageChange = (e: ChangeEvent, page: number): void => {
    setPage(page);
    refetch({
      input: { page, limit, admin: false },
    });
  };

  return (
    <Layout className="flex items-center flex-col">
      <div className="w-[95%] md:w-[90%]">
        {data?.users?.__typename !== "ErrorMsg" && (
          <Table>
            <TableHeader
              title="List of Customers"
              showSearch={false}
              tableList={tableList}
            />
            {(data?.users as UserData)?.results?.length! > 0 ? (
              <>
                <TableList>
                  {(data?.users as UserData)?.results.map(
                    (user: UserType, index: number) => (
                      <TableRow
                        key={index}
                        onClick={() => router.push(`/customer/${user.id}`)}
                      >
                        <TableContent>
                          <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                            {user.name}
                          </p>
                        </TableContent>
                        <TableContent>
                          <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                            {user.phoneNumber}
                          </p>
                        </TableContent>
                        <TableContent>
                          <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                            {user.email}
                          </p>
                        </TableContent>
                        <TableContent>
                          <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                            {user.gender}
                          </p>
                        </TableContent>
                        <TableContent>
                          <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                            {truncate(
                              new Date(user.createdAt).toDateString(),
                              15,
                              "middle"
                            )}
                          </p>
                        </TableContent>
                      </TableRow>
                    )
                  )}
                </TableList>

                <div className="grid place-items-center w-full">
                  {pageCount > 1 && (
                    <Pagination
                      pageCount={pageCount}
                      forcePage={(data?.users as UserData).page ?? 1}
                      pageRangeDisplayed={10}
                      breakLabel="•••"
                      onPageChange={handlePageChange}
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="flex-[0.35] ml-[5px] h-[80%] grid place-items-center my-5">
                <div className="flex items-center justify-center flex-col ">
                  <Lottie
                    loop={false}
                    animationData={lottieJson}
                    play
                    style={{ width: 250, height: 250 }}
                  />
                  <p className="text-[1.2rem] text-slate-900 dark:text-white">
                    No Users Yet!
                  </p>
                </div>
              </div>
            )}
          </Table>
        )}
      </div>
    </Layout>
  );
};

export default Customers;
