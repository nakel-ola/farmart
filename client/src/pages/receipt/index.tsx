import { gql, useQuery } from "@apollo/client";
import clsx from "clsx";
import { ShoppingCart } from "iconsax-react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import ReactLoading from "react-loading";
import { NumericFormat as NumberFormat } from "react-number-format";
import { useSelector } from "react-redux";
import { GraphQLOrdersResponse, OrdersData } from "../../../typing";
import LoginCard from "../../components/LoginCard";
import Pagination from "../../components/Pagination";
import {
  Header,
  Table,
  TableBody,
  TableContent,
  TableHead,
  TableRow,
} from "../../components/tables";
import setting from "../../data/setting";
import capitalizeFirstLetter from "../../helper/capitalizeFirstLetter";
import roundUp from "../../helper/roundUp";
import { statusColor } from "../../helper/statusColor";
import truncate from "../../helper/truncate";
import Layouts from "../../layout/Layouts";
import { selectUser } from "../../redux/features/userSlice";

export const OrdersQuery = gql`
  query Orders($input: OrdersInput!) {
    orders(input: $input) {
      page
      status
      totalItems
      results {
        id
        orderId
        totalPrice
        paymentMethod
        deliveryMethod
        createdAt
        progress {
          name
          checked
          updatedAt
        }
      }
    }
  }
`;


export const tableList: any[] = [
  { title: "Order Id" },
  { title: "Status" },
  { title: "Price" },
  { title: "Date" },
  { title: "Payment" },
  { title: "Delivery" },
];

let limit = 10;

const Receipt: NextPage = () => {
  const router = useRouter();
  const user = useSelector(selectUser);
  const [page, setPage] = useState(1);

  const [data, setData] = useState<GraphQLOrdersResponse>();

  const { refetch, loading } = useQuery<GraphQLOrdersResponse>(OrdersQuery, {
    variables: {
      input: {
        page: 1,
        limit,
      },
    },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setData(data);
    },
    onError: (data) => console.table(data),
  });

  let pageCount = roundUp(
    Math.abs((data?.orders as OrdersData)?.totalItems! / limit)
  );

  const handlePageChange = (e: ChangeEvent, page: number): void => {
    setPage(page);
    refetch({ input: { page, limit } });
  };

  return (
    <Layouts>
      <Head>
        <title>Receipt</title>
      </Head>
      {user ? (
        <div className="h-full w-full flex items-center flex-col">
          {!loading ? (
            <div className="w-[95%] md:w-[90%]">
              <Table
                headerComponent={
                  <Header
                    width="w-[670px]"
                    title="Order History"
                    showSearch={false}
                  />
                }
                footerComponent={
                  pageCount > 1 ? (
                    <Pagination
                      width="w-[670px]"
                      pageCount={pageCount}
                      forcePage={(data?.orders as OrdersData).page ?? 1}
                      pageRangeDisplayed={10}
                      breakLabel="•••"
                      onPageChange={handlePageChange}
                    />
                  ) : null
                }
              >
                <TableHead
                  disableDivider={
                    (data?.orders as OrdersData)?.results.length! > 0
                      ? false
                      : true
                  }
                  tableList={tableList}
                />

                {(data?.orders as OrdersData)?.results?.length! > 0 ? (
                  <TableBody disableDivider={pageCount > 1 ? false : true}>
                    {(data?.orders as OrdersData).results.map(
                      (props, index: number) => {
                        const trueStatus = props.progress.filter(
                          (r) => r.checked
                        );
                        let status =
                          trueStatus[trueStatus.length - 1]?.name ?? "Pending";
                        return (
                          <TableRow
                            key={index}
                            onClick={() => {
                              router.push(`/receipt/${props.id}`);
                            }}
                            className="cursor-pointer"
                          >
                            <TableContent>
                              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                                {props.orderId}
                              </p>
                            </TableContent>
                            <TableContent>
                              <p
                                className={clsx(
                                  "text-sm font-medium text-left whitespace-nowrap py-[2px] rounded-lg",
                                  statusColor(status)
                                )}
                              >
                                •{" "}
                                {truncate(
                                  capitalizeFirstLetter(status),
                                  10,
                                  "middle"
                                )}
                              </p>
                            </TableContent>

                            <TableContent>
                              <NumberFormat
                                thousandSeparator
                                displayType="text"
                                value={Number(props.totalPrice).toFixed(2)}
                                prefix="$"
                                renderText={(value: string) => (
                                  <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                                    {value}
                                  </p>
                                )}
                              />
                            </TableContent>

                            <TableContent>
                              <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                                {truncate(
                                  new Date(props.createdAt).toDateString(),
                                  15,
                                  "middle"
                                )}
                              </p>
                            </TableContent>
                            <TableContent>
                              <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                                {truncate(props.paymentMethod, 15, "middle")}
                              </p>
                            </TableContent>
                            <TableContent>
                              <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                                {truncate(props.deliveryMethod, 50, "middle")}
                              </p>
                            </TableContent>
                          </TableRow>
                        );
                      }
                    )}
                  </TableBody>
                ) : null}
              </Table>

              {(data?.orders as OrdersData)?.results?.length! === 0 ? (
                <div className="grid my-10 place-items-center">
                  <div className="flex items-center justify-center flex-col">
                    <ShoppingCart
                      size={100}
                      className="text-neutral-700 dark:text-neutral-400"
                    />
                    <p className="text-neutral-700 dark:text-neutral-400 text-lg font-semibold my-1">
                      No Orders Yet!
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="w-full h-[80%] grid place-items-center">
              <ReactLoading type="spinningBubbles" color={setting.primary} />
            </div>
          )}
        </div>
      ) : (
        <LoginCard />
      )}
    </Layouts>
  );
};

export default Receipt;
