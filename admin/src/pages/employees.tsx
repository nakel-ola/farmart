import { gql, useQuery } from "@apollo/client";
import { UserOctagon } from "iconsax-react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { ChangeEvent, useState } from "react";
import { useSelector } from "react-redux";
import { GraphQLEmployeesResponse, UserType } from "../../typing";
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
import { selectUser } from "../redux/features/userSlice";
import { roundUp } from "./orders";

const tableList: any[] = [
  { title: "Name" },
  { title: "Phone" },
  { title: "Email" },
  { title: "Gender" },
  { title: "Created" },
];

const UsersQuery = gql`
  query Employees($input: UsersInput!) {
    employees(input: $input) {
      ... on EmployeeData {
        page
        totalItems
        results {
          id
          email
          name
          gender
          phoneNumber
          createdAt
          level
        }
      }

      ... on ErrorMsg {
        error
      }
    }
  }
`;

let limit = 10;

const Employees = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const user = useSelector(selectUser);
  const { data, refetch } = useQuery<GraphQLEmployeesResponse>(UsersQuery, {
    variables: { input: { admin: true, limit, page: 1 } },
    fetchPolicy: "network-only",
    onError: (data) => console.table(data),
  });

  let pageCount = roundUp(Math.abs(data?.employees.totalItems! / limit));

  const handlePageChange = (e: ChangeEvent, page: number): void => {
    setPage(page);
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
                  forcePage={data?.employees.page ?? 1}
                  pageRangeDisplayed={10}
                  breakLabel="•••"
                  onPageChange={handlePageChange}
                />
              ) : null
            }
          >
            <TableHead tableList={tableList} />

            {data?.employees?.results?.length! > 0 ? (
              <TableBody disableDivider={pageCount > 1 ? false : true}>
                {data?.employees?.results.map(
                  (employee: UserType, index: number) =>
                    user?.id !== employee.id && (
                      <TableRow
                        className="cursor-pointer"
                        onClick={() => router.push(`/employee/${employee.id}`)}
                        key={index}
                      >
                        <TableContent>
                          <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                            {employee.name}
                          </p>
                        </TableContent>
                        <TableContent>
                          <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                            {employee.phoneNumber}
                          </p>
                        </TableContent>
                        <TableContent>
                          <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                            {employee.email}
                          </p>
                        </TableContent>
                        <TableContent>
                          <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                            {employee.gender ?? "none"}
                          </p>
                        </TableContent>
                        <TableContent>
                          <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
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

          {data?.employees?.results?.length! === 0 && (
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
          {/* <Table>
          <TableHeader
            title="List of Employees"
            showSearch={false}
            tableList={tableList}
          />
          {data?.employees?.results?.length! > 0 ? (
            <>
              <TableList>
                {data?.employees?.results.map(
                  (employee: UserType, index: number) => user?.id !== employee.id && (
                    <TableRow
                      onClick={() => router.push(`/employee/${employee.id}`)}
                      key={index}
                    >
                      <TableContent>
                        <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                          {employee.name}
                        </p>
                      </TableContent>
                      <TableContent>
                        <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                          {employee.phoneNumber}
                        </p>
                      </TableContent>
                      <TableContent>
                        <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                          {employee.email}
                        </p>
                      </TableContent>
                      <TableContent>
                        <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                          {employee.gender}
                        </p>
                      </TableContent>
                      <TableContent>
                        <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
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
              </TableList>

              <div className="grid place-items-center w-full">
                {pageCount > 1 && (
                  <Pagination
                    pageCount={pageCount}
                    forcePage={data?.employees.page ?? 1}
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
        </Table> */}
        </div>
      </Layout>
    </>
  );
};

export default Employees;
