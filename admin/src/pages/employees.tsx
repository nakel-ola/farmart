import { useQuery } from "@apollo/client";
import { UserOctagon } from "iconsax-react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { ChangeEvent } from "react";
import {
  GraphQLUserResponse,
  UserType,
} from "../../typing";
import Pagination from "../components/Pagination";
import {
  Table,
  TableBody,
  TableContent,
  TableHead,
  TableRow,
} from "../components/tables";
import Header from "../components/tables/Header";
import truncate from "../helper/truncate";
import Layout from "../layout/Layout";
import { UsersQuery } from "./customers";
import { roundUp } from "./orders";

const tableList: any[] = [
  { title: "Name" },
  { title: "Phone" },
  { title: "Email" },
  { title: "Gender" },
  { title: "Created" },
];

let limit = 10;

const Employees = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();

  const user = sessionData?.user;
  const { data, refetch } = useQuery<GraphQLUserResponse>(UsersQuery, {
    variables: { input: { employee: true, limit, page: 1 } },
    fetchPolicy: "network-only",
    onError: (data) => console.table(data),
  });

  let pageCount = roundUp(Math.abs(data?.users.totalItems! / limit));

  const handlePageChange = (e: ChangeEvent, page: number): void => {
    refetch({
      input: { page, limit, admin: true },
    });
  };

  return (
    <>
      <Head>
        <title>Employees</title>
      </Head>
      <Layout className="flex items-center flex-col">
        <div className="w-[95%] md:w-[90%]">
          <Table
            headerComponent={
              <Header title="List of Employees" showSearch={false} />
            }
            footerComponent={
              pageCount > 1 ? (
                <Pagination
                  pageCount={pageCount}
                  forcePage={data?.users.page ?? 1}
                  pageRangeDisplayed={10}
                  breakLabel="•••"
                  onPageChange={handlePageChange}
                />
              ) : null
            }
          >
            <TableHead tableList={tableList} />

            {data?.users?.results?.length! > 0 ? (
              <TableBody disableDivider={pageCount > 1 ? false : true}>
                {data?.users?.results.map(
                  (employee: UserType, index: number) => (
                    <TableRow
                      className="cursor-pointer"
                      onClick={() =>
                        router.push(
                          user?.id === employee.id
                            ? `/account`
                            : `/employee/${employee.id}`
                        )
                      }
                      key={index}
                    >
                      <TableContent>
                        <p className="text-base text-neutral-700 dark:text-neutral-400 whitespace-nowrap">
                          {employee.name}
                        </p>
                      </TableContent>
                      <TableContent>
                        <p className="text-base text-neutral-700 dark:text-neutral-400 whitespace-nowrap">
                          {employee.phoneNumber}
                        </p>
                      </TableContent>
                      <TableContent>
                        <p className="text-base text-neutral-700 dark:text-neutral-400 whitespace-nowrap">
                          {employee.email}
                        </p>
                      </TableContent>
                      <TableContent>
                        <p className="text-base text-neutral-700 dark:text-neutral-400 whitespace-nowrap">
                          {employee.gender ?? "none"}
                        </p>
                      </TableContent>
                      <TableContent>
                        <p className="text-base text-neutral-700 dark:text-neutral-400 whitespace-nowrap">
                          {truncate(
                            new Date(employee.createdAt).toDateString(),
                            15,
                            "middle"
                          )}
                        </p>
                      </TableContent>
                    </TableRow>
                  )
                )}
              </TableBody>
            ) : null}
          </Table>

          {data?.users?.results?.length! === 0 && (
            <div className="grid my-10 place-items-center">
              <div className="flex items-center justify-center flex-col">
                <UserOctagon
                  size={100}
                  className="text-neutral-700 dark:text-neutral-400"
                />
                <p className="text-neutral-700 dark:text-neutral-400 text-lg font-semibold my-1">
                  No Employee Yet!
                </p>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default Employees;
