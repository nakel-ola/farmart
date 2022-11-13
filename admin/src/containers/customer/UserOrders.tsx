import { gql, useQuery } from "@apollo/client";
import clsx from "clsx";
import { ShoppingCart } from "iconsax-react";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import NumberFormat from "react-number-format";
import { useDispatch } from "react-redux";
import { GraphQLOrdersResponse, OrdersData, OrderType } from "../../../typing";
import Pagination from "../../components/Pagination";
import {
    Table,
    TableBody,
    TableContent,
    TableHead,
    TableRow
} from "../../components/tables";
import Header from "../../components/tables/Header";
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

const tableList: any[] = [
  { title: "Order Id" },
  { title: "Status" },
  { title: "Price" },
  { title: "Date" },
  { title: "Payment" },
];

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
    <>
      <Table
        headerComponent={<Header title="Customer Orders" showSearch={false} />}
        footerComponent={
          pageCount > 1 ? (
            <Pagination
              width="w-[540px]"
              pageCount={pageCount}
              forcePage={(data?.orders as OrdersData).page ?? 1}
              pageRangeDisplayed={10}
              breakLabel="•••"
              onPageChange={handlePageChange}
            />
          ) : null
        }
      >
        <TableHead tableList={tableList} />
        {(data?.orders as OrdersData)?.results?.length! > 0 ? (
          <TableBody>
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
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                        {props.orderId}
                      </p>
                    </TableContent>
                    <TableContent>
                      <p
                        className={clsx(
                          "text-sm font-medium text-left w800espace-nowrap py-[2px] rounded-lg",
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
                          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                            {value}
                          </p>
                        )}
                      />
                    </TableContent>
                    <TableContent>
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                        {truncate(
                          new Date(props.createdAt).toDateString(),
                          15,
                          "middle"
                        )}
                      </p>
                    </TableContent>
                    <TableContent>
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                        {truncate(props.paymentMethod, 15, "middle")}
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
        <div className="grid my-10 place-items-center bg-white dark:bg-dark -mt-6 shadow rounded-lg py-8">
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
    </>
  );
};

export default UserOrders;
