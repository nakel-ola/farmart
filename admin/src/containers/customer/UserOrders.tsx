import { gql, useQuery } from "@apollo/client";
import clsx from "clsx";
import { ShoppingCart } from "iconsax-react";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import Lottie from "react-lottie-player";
import NumberFormat from "react-number-format";
import { useDispatch } from "react-redux";
import { GraphQLOrdersResponse, OrdersData, OrderType } from "../../../typing";
import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import TableContent from "../../components/TableContent";
import TableHeader from "../../components/TableHeader";
import TableList from "../../components/TableList";
import TableRow from "../../components/TableRow";
import lottieJson from "../../data/lf30_editor_mh2nforn.json";
import capitalizeFirstLetter from "../../helper/capitalizeFirstLetter";
import { statusColor } from "../../helper/statusColor";
import truncate from "../../helper/truncate";
import { roundUp } from "../../pages/orders";
import { add } from "../../redux/features/orderSlice";

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

const tableList: string[] = ["Order Id", "Status", "Price", "Date", "Payment"];

let limit = 10;

const UserOrders = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  const { data, refetch } = useQuery<GraphQLOrdersResponse>(OrdersQuery, {
    variables: {
      input: { page: 1, limit, customerId: router.query.cid },
    },
    onError: (data) => console.table(data),
  });

  let pageCount = roundUp(
    Math.abs((data?.orders as OrdersData)?.totalItems! / limit)
  );

  const handlePageChange = (e: ChangeEvent, page: number): void => {
    setPage(page);
    refetch({
      input: { page, limit, customerId: router.query.cid },
    });
  };

  return (
    <Table>
      <TableHeader
        title="Customer Orders"
        tableList={tableList}
        showSearch={false}
      />

      {(data?.orders as OrdersData)?.results?.length! > 0 ? (
        <>
          <TableList>
            {(data?.orders as OrdersData).results.map(
              (props: OrderType, i: number) => {
                const trueStatus = props.progress.filter((r) => r.checked);
                let status =
                  trueStatus[trueStatus.length - 1]?.name ?? "Pending";
                return (
                  <TableRow
                    key={i}
                    onClick={() => {
                      dispatch(add(props));
                      router.push(`/order/${props.id}`);
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
                        {truncate(capitalizeFirstLetter(status), 10, "middle")}
                      </p>
                    </TableContent>
                    <TableContent>
                      <NumberFormat
                        thousandSeparator
                        displayType="text"
                        value={Number(props.totalPrice).toFixed(2)}
                        prefix="$"
                        renderText={(value) => (
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
                    {/* <TableContent>
                    <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                      {truncate(props.deliveryMethod, 10, "middle")}
                    </p>
                  </TableContent> */}
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
        </>
      ) : (
        <div className="flex-[0.35] h-[200px] grid place-items-center mt-2 mb-5 rounded-lg dark:bg-dark dark:shadow-black/30 bg-white shadow-sm w-full">
          <div className="flex items-center justify-center flex-col ">
            <ShoppingCart
              size={100}
              className="text-5xl text-neutral-700 dark:text-neutral-400"
            />
            <p className="text-[1.2rem] text-slate-900 dark:text-white">
              No Orders
            </p>
          </div>
        </div>
      )}
    </Table>
  );
};

export default UserOrders;
