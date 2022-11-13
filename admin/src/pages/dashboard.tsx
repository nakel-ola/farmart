import { gql, useQuery } from "@apollo/client";
import Head from "next/head";
import {
  GraphQLDashboardResponse,
  OrderStatisticsType,
  OrderSummaryType,
  OrderType,
  ProductSummaryType,
} from "../../typing";
import OrderOverview from "../containers/dashboard/OrderOverview";
import Orders from "../containers/dashboard/Orders";
import OrderSummary from "../containers/dashboard/OrderSummary";
import SummaryCard from "../containers/dashboard/SummaryCard";
import Layout from "../layout/Layout";

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
          createdAt
          totalPrice
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

    productsSummary {
      ... on ProductSummary {
        totalOrders
        totalDelivered
        totalStock
        outOfStock
      }

      ... on ErrorMsg {
        error
      }
    }

    ordersSummary {
      ... on OrderSummary {
        pending
        delivered
        canceled
      }

      ... on ErrorMsg {
        error
      }
    }

    ordersStatistics {
      ... on OrderStatistics {
        min
        max
        week
        month
      }

      ... on ErrorMsg {
        error
      }
    }
  }
`;

const Dashboard = () => {
  const { data } = useQuery<GraphQLDashboardResponse>(OrdersQuery, {
    variables: { input: { page: 1, limit: 5 } },
    onError: (data) => console.table(data),
  });

  const validate = (data: OrderSummaryType) => {
    const { canceled,delivered,pending } = data;
    if(canceled > 0 || pending > 0 || delivered > 0) {
      return true
    }
    return false;
  }

  return (
    <Layout>
      <Head>
        <title>Dashboard</title>
      </Head>

      <div className="grid place-items-center">
        {data ? (
          <>
            {data.productsSummary.__typename !== "ErrorMsg" && (
              <SummaryCard
                data={
                  (data as { productsSummary: ProductSummaryType })
                    .productsSummary
                }
              />
            )}

            {data.ordersStatistics.__typename !== "ErrorMsg" && (
              <OrderSummary
                data={
                  (data as { ordersStatistics: OrderStatisticsType })
                    .ordersStatistics
                }
              />
            )}

            <div className="flex w-full md:w-[90%] flex-col md:flex-row justify-center items-center md:items-start md:justify-between mb-0 md:mb-8">
              {data.ordersSummary.__typename !== "ErrorMsg" &&
                validate((data as { ordersSummary: OrderSummaryType }).ordersSummary) && (
                  <OrderOverview
                    data={
                      (data as { ordersSummary: OrderSummaryType })
                        .ordersSummary
                    }
                  />
                )}
              {data.orders.__typename !== "ErrorMsg" &&
                (data?.orders as { results: OrderType[] }).results.length >
                  0 && (
                  <Orders
                    items={(data.orders as { results: OrderType[] }).results}
                  />
                )}
            </div>
          </>
        ) : (
          <div className=""></div>
        )}
      </div>
    </Layout>
  );
};
export default Dashboard;
