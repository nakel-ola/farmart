import { gql, useQuery } from "@apollo/client";
import { Profile2User } from "iconsax-react";
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
import Header from "../containers/products/Header";
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
            <TableHead tableList={tableList} />

            {(data?.users as UserData)?.results?.length! > 0 ? (
              <TableBody disableDivider={pageCount > 1 ? false : true}>
                {(data?.users as UserData)?.results.map(
                  (user: UserType, index: number) => (
                    <TableRow
                      key={index}
                      className="cursor-pointer"
                      onClick={() => router.push(`/customer/${user.id}`)}
                    >
                      <TableContent>
                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                          {user.name}
                        </p>
                      </TableContent>
                      <TableContent>
                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                          {user.phoneNumber}
                        </p>
                      </TableContent>
                      <TableContent>
                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                          {user.email}
                        </p>
                      </TableContent>
                      <TableContent>
                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                          {user.gender}
                        </p>
                      </TableContent>
                      <TableContent>
                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
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
  );
};

export default Customers;
