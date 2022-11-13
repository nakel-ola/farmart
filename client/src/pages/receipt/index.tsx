import { gql, useLazyQuery, useQuery } from "@apollo/client";
import clsx from "clsx";
import { Receipt21 } from "iconsax-react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, MouseEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { NumericFormat } from "react-number-format";
import { useSelector } from "react-redux";
import { GraphQLOrdersResponse, OrdersData, OrderType } from "../../../typing";
import Header from "../../components/Header";
import LoginCard from "../../components/LoginCard";
import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import TableContent from "../../components/TableContent";
import TableHeader from "../../components/TableHeader";
import TableList from "../../components/TableList";
import TableRow from "../../components/TableRow";
import capitalizeFirstLetter from "../../helper/capitalizeFirstLetter";
import roundUp from "../../helper/roundUp";
import { statusColor } from "../../helper/statusColor";
import truncate from "../../helper/truncate";
import Layouts from "../../layout/Layouts";
import { selectUser } from "../../redux/features/userSlice";
import ReactLoading from "react-loading";
import setting from "../../data/setting";


export const OrdersQuery = gql`
  query Orders($input: OrdersInput!) {
    orders(input: $input) {
      __typename
      ... on OrderData {
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
      ... on ErrorMsg {
        error
      }
    }
  }
`;

export const FilterById = gql`
  query FilterById($input: FilterByIdInput!) {
    filterById(input: $input) {
      ... on OrderData {
        page
        status
        totalItems
        results {
          id
          userId
          orderId
          trackingId
          paymentId
          status
          totalPrice
          paymentMethod
          deliveryMethod
          createdAt
          updatedAt
          progress {
            name
            checked
            updatedAt
          }
          address {
            street
            city
            state
            country
            phoneNumber
          }
          products {
            id
            quantity
            price
          }
        }
      }
      ... on ErrorMsg {
        error
      }
    }
  }
`;
export const FilterByStatus = gql`
  query FilterByStatus($input: FilterByStatusInput!) {
    filterByStatus(input: $input) {
      ... on OrderData {
        page
        status
        totalItems
        results {
          id
          userId
          orderId
          trackingId
          paymentId
          status
          totalPrice
          paymentMethod
          deliveryMethod
          createdAt
          updatedAt
          progress {
            name
            checked
            updatedAt
          }
          address {
            street
            city
            state
            country
            phoneNumber
          }
          products {
            id
            quantity
            price
          }
        }
      }

      ... on ErrorMsg {
        error
      }
    }
  }
`;

const sortList: string[] = [
  "All",
  "Pending",
  "Delivered",
  "Canceled",
];
export const tableList: string[] = [
  "Order Id",
  "Status",
  "Price",
  "Date",
  "Payment",
  "Delivery",
];

let limit = 10;

const Receipt: NextPage = () => {
  const router = useRouter();
  const user = useSelector(selectUser);
  const [active, setActive] = useState(sortList[0]);
  const [page, setPage] = useState(1);
  const [input, setInput] = useState("");

  const [data, setData] = useState<GraphQLOrdersResponse>();

  const { refetch, loading } = useQuery<GraphQLOrdersResponse>(OrdersQuery, {
    variables: {
      input: {
        page: 1,
        limit,
        status: active.toLowerCase() === "all" ? null : active,
      },
    },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data.orders.__typename !== "ErrorMsg") {
        setData(data);
      }
    },
    onError: (data) => console.table(data),
  });

  const [filterById] = useLazyQuery(FilterById);
  const [filterByStatus] = useLazyQuery(FilterByStatus, {
    fetchPolicy: "network-only",
  });

  let pageCount = roundUp(
    Math.abs((data?.orders as OrdersData)?.totalItems! / limit)
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let toastId = toast.loading("Searching......");
    await filterById({
      variables: { input: { page: 1, limit: 10, orderId: input } },
      onCompleted: (data) => {
        toast.dismiss(toastId);
        setData({ orders: data.filterById });
      },
      onError: (err: any) => {
        toast.error(`Order with id: ${input} cant't be found`, { id: toastId });
        console.table(err);
      },
    });
  };

  const handleSortClick = (e: MouseEvent<HTMLDivElement>, selected: string) => {
    let status = selected.toLowerCase();
    if (e) {
      router.push(status === "all" ? "/receipt" : `/receipt?type=${status}`);
    }
    if (selected !== active) {
      let toastId = toast.loading("Sorting......");
      if (status === "all") {
        refetch({
          input: { page: 1, limit, status: null },
        });
        toast.dismiss(toastId);
      } else {
        filterByStatus({
          fetchPolicy: "network-only",
          variables: {
            input: { page: 1, limit, status },
          },
          onCompleted: (data) => {
            toast.dismiss(toastId);
            setData({ orders: data.filterByStatus });
          },
          onError: (err: any) => {
            toast.error(`No orders with the selected sort:${selected}`, {
              id: toastId,
            });
            console.table(err);
          },
        });
      }
      setActive(status);
    }
  };

  const handlePageChange = (e: ChangeEvent, page: number): void => {
    setPage(page);
    refetch({
      input: { page, limit, status: active === "All" ? null : active },
    });
  };

  return (
    <Layouts>
      <Head>
        <title>Receipt</title>
      </Head>
      <Header title="History" />
      {user ? (
        <div className="h-full w-full flex items-center flex-col">
          {!loading ? (
            (data?.orders as OrdersData)?.results?.length >= 1 ? (
              <div className="w-[95%]">
                <Table>
                  <TableHeader
                    title="Order History"
                    sortList={sortList}
                    activeSort={
                      router.query.type
                        ? capitalizeFirstLetter(router.query.type.toString())
                        : active
                    }
                    tableList={tableList}
                    searchValue={input}
                    onSearchChange={(e) => setInput(e.target.value)}
                    onSearchSubmit={handleSubmit}
                    onSortClick={handleSortClick}
                    placeholder="Search by order ID"
                  />

                  <TableList>
                    {(data?.orders as OrdersData).results.map(
                      (props: OrderType, i: number) => {
                        const trueStatus = props.progress.filter(
                          (r) => r.checked
                        );
                        let status =
                          trueStatus[trueStatus.length - 1]?.name ?? "Pending";
                        return (
                          <TableRow
                            key={i}
                            onClick={() => {
                              router.push(`/receipt/${props.id}`);
                            }}
                          >
                            <TableContent>
                              <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                                {props.orderId}
                              </p>
                            </TableContent>
                            <TableContent>
                              <p
                                className={clsx(
                                  "text-[0.9rem] font-medium text-center w800espace-nowrap py-[2px] px-2 rounded-lg",
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
                              <NumericFormat
                                thousandSeparator
                                displayType="text"
                                value={Number(props.totalPrice).toFixed(2)}
                                prefix="$"
                                renderText={(value: string) => (
                                  <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap ml-2">
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
                  </TableList>

                  <div className="grid place-items-center w-full">
                    {pageCount > 1 && (
                      <Pagination
                        pageCount={pageCount}
                        forcePage={(data?.orders as OrdersData).page ?? 1}
                        pageRangeDisplayed={10}
                        breakLabel="•••"
                        onPageChange={handlePageChange}
                      />
                    )}
                  </div>
                </Table>
              </div>
            ) : (
              <div className="ml-[5px] h-[80%] w-full grid place-items-center">
                <div className="flex items-center justify-center flex-col">
                  <Receipt21
                    size={100}
                    className="text-5xl text-neutral-700 dark:text-neutral-400"
                  />

                  <p className="text-[1.2rem] text-slate-900 dark:text-white">
                    No Order yet!!
                  </p>

                  <div
                    className="w-[80%] h-[40px] bg-primary rounded-xl flex items-center justify-center m-[10px]  "
                    onClick={() => router.back()}
                  >
                    <p className="text-white text-[1rem] p-[8px]">Go Back</p>
                  </div>
                </div>
              </div>
            )
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
