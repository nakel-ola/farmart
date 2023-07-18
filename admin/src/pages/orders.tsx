import { gql, useLazyQuery, useQuery } from "@apollo/client";
import clsx from "clsx";
import { ShoppingCart } from "iconsax-react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import NumberFormat, { numericFormatter } from "react-number-format";
import { GraphQLOrdersResponse, OrdersData } from "../../typing";
import Pagination from "../components/Pagination";
import {
  Header,
  Table,
  TableBody,
  TableContent,
  TableHead,
  TableRow,
} from "../components/tables";
import capitalizeFirstLetter from "../helper/capitalizeFirstLetter";
import { statusColor } from "../helper/statusColor";
import truncate from "../helper/truncate";
import Layout from "../layout/Layout";

const sortList: string[] = ["All", "Pending", "Delivered", "Canceled"];
export const tableList: any[] = [
  { title: "Order Id" },
  { title: "Status" },
  { title: "Price" },
  { title: "Date" },
  { title: "Payment" },
  { title: "Delivery" },
];

let limit = 10;

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

export const FilterById = gql`
  query FilterById($input: FilterByIdInput!) {
    filterById(input: $input) {
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
          productId
          quantity
          price
        }
      }
    }
  }
`;

export const FilterByStatus = gql`
  query FilterByStatus($input: FilterByStatusInput!) {
    filterByStatus(input: $input) {
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
          productId
          quantity
          price
        }
      }
    }
  }
`;

const Orders = () => {
  const [active, setActive] = useState(sortList[0]);
  const [input, setInput] = useState("");
  const router = useRouter();

  const [data, setData] = useState<GraphQLOrdersResponse>();

  const { refetch } = useQuery<GraphQLOrdersResponse>(OrdersQuery, {
    variables: {
      input: {
        page: 1,
        limit,
        status: active.toLowerCase() === "all" ? null : active,
      },
    },
    fetchPolicy: "network-only",
    onCompleted: (data) => setData(data),
    onError: (data) => console.table(data),
  });

  const [filterById] = useLazyQuery(FilterById);
  const [filterByStatus] = useLazyQuery(FilterByStatus, {
    fetchPolicy: "network-only",
  });

  let pageCount = roundUp(
    Math.abs((data?.orders as OrdersData)?.totalItems! / limit)
  );

  const handlePageChange = (e: ChangeEvent, page: number): void => {
    refetch({
      input: { page, limit, status: active === "All" ? null : active },
    });
  };

  const handleSortClick = useCallback(
    async (e: MouseEvent<HTMLDivElement>, selected: string) => {
      let status = selected.toLowerCase();
      if (e)
        router.push(status === "all" ? "/orders" : `/orders?type=${status}`);

      if (selected === active) return;

      let toastId = toast.loading("Sorting......");
      if (status === "all") {
        refetch({ input: { page: 1, limit, status: null } });
        toast.dismiss(toastId);
      } else {
        await filterByStatus({
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
        toast.dismiss(toastId);
      }
      setActive(status);
    },
    [filterByStatus, active, refetch, router]
  );

  const getData = useCallback(async () => {
    let e: any;
    let selected = router.query?.type?.toString() ?? "all";
    handleSortClick(e, selected);
  }, [handleSortClick, router.query?.type]);

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

  useEffect(() => {
    getData();
  }, [router.query.type, getData]);

  return (
    <Layout className="flex items-center flex-col">
      <Head>
        <title>Orders</title>
      </Head>

      <div className="w-[95%] md:w-[90%]">
        <Table
          headerComponent={
            <Header
              width="w-[670px]"
              title="Order History"
              sortList={sortList}
              activeSort={
                router.query.type
                  ? capitalizeFirstLetter(router.query.type.toString())
                  : active
              }
              searchValue={input}
              onSearchChange={(e) => setInput(e.target.value)}
              onSearchSubmit={handleSubmit}
              onSortClick={handleSortClick}
              placeholder="Search by order ID"
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
              (data?.orders as OrdersData)?.results.length! > 0 ? false : true
            }
            tableList={tableList}
          />

          {(data?.orders as OrdersData)?.results?.length! > 0 ? (
            <TableBody disableDivider={pageCount > 1 ? false : true}>
              {(data?.orders as OrdersData).results.map(
                (props, index: number) => {
                  const trueStatus = props.progress.filter((r) => r.checked);
                  let status =
                    trueStatus[trueStatus.length - 1]?.name ?? "Pending";
                  return (
                    <TableRow
                      key={index}
                      onClick={() => {
                        router.push(`/order/${props.id}`);
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
                        <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                          {numericFormatter(props.totalPrice.toString(), {
                            thousandSeparator: true,
                            prefix: "$ ",
                          })}
                        </p>
         
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
    </Layout>
  );
};

export const roundUp = (num: number) => {
  const string = num.toString().split(".");
  if (string.length > 1) return Number(string[0]) + 1;
  else return Number(num);
};

export default Orders;
