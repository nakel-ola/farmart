import { gql, useQuery } from "@apollo/client";
import { Profile2User } from "iconsax-react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { ChangeEvent, useState } from "react";
import { GraphQLUserResponse, UserData, UserType } from "../../typing";
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
import { roundUp } from "./orders";

const tableList: any[] = [
  { title: "Name" },
  { title: "Phone" },
  { title: "Email" },
  { title: "Gender" },
  { title: "Created" },
];

export const UsersQuery = gql`
  query users($input: UsersInput!) {
    users(input: $input) {
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
  }
`;

let limit = 10;

const Customers = () => {
  const router = useRouter();
  const { data, refetch } = useQuery<GraphQLUserResponse>(UsersQuery, {
    variables: { input: { limit, page: 1 } },
    fetchPolicy: "network-only",
    onError: (data) => console.table(data),
  });

  let pageCount = roundUp(
    Math.abs((data?.users as UserData)?.totalItems! / limit)
  );

  const handlePageChange = (e: ChangeEvent, page: number): void => {
    refetch({
      input: { page, limit, admin: false },
    });
  };

  return (
    <>
      <Head>
        <title>Customers</title>
      </Head>
      <Layout className="flex items-center flex-col">
        <div className="w-[95%] md:w-[90%]">
          {data?.users && (
            <Table
              headerComponent={
                <Header title="List of Customers" showSearch={false} />
              }
              footerComponent={
                pageCount > 1 ? (
                  <Pagination
                    pageCount={pageCount}
                    forcePage={(data?.users as UserData).page ?? 1}
                    pageRangeDisplayed={10}
                    breakLabel="•••"
                    onPageChange={handlePageChange}
                  />
                ) : null
              }
            >
              <TableHead
                tableList={tableList}
                disableDivider={
                  (data?.users as UserData)?.results?.length! > 0 ? false : true
                }
              />

              {(data?.users as UserData)?.results?.length! > 0 ? (
                <TableBody disableDivider={pageCount > 1 ? true : false}>
                  {(data?.users as UserData)?.results.map(
                    (user: UserType, index: number) => (
                      <TableRow
                        key={index}
                        className="cursor-pointer"
                        onClick={() => router.push(`/customer/${user.id}`)}
                      >
                        <TableContent>
                          <p className="text-base text-neutral-700 dark:text-neutral-400 whitespace-nowrap">
                            {user.name}
                          </p>
                        </TableContent>
                        <TableContent>
                          <p className="text-base text-neutral-700 dark:text-neutral-400 whitespace-nowrap">
                            {user.phoneNumber}
                          </p>
                        </TableContent>
                        <TableContent>
                          <p className="text-base text-neutral-700 dark:text-neutral-400 whitespace-nowrap">
                            {user.email}
                          </p>
                        </TableContent>
                        <TableContent>
                          <p className="text-base text-neutral-700 dark:text-neutral-400 whitespace-nowrap">
                            {user.gender ?? "none"}
                          </p>
                        </TableContent>
                        <TableContent>
                          <p className="text-base text-neutral-700 dark:text-neutral-400 whitespace-nowrap">
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
                </TableBody>
              ) : null}
            </Table>
          )}
        </div>

        {(data?.users as UserData)?.results?.length! === 0 && (
          <div className="grid my-10 place-items-center">
            <div className="flex items-center justify-center flex-col">
              <Profile2User
                size={100}
                className="text-neutral-700 dark:text-neutral-400"
              />
              <p className="text-neutral-700 dark:text-neutral-400 text-lg font-semibold my-1">
                No Customers Yet!
              </p>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};

export default Customers;
