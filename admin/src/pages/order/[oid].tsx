import { gql, useLazyQuery } from "@apollo/client";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import NumberFormat, { numericFormatter } from "react-number-format";
import { OrderType } from "../../../typing";
import Header from "../../components/Header";
import DetailsTemplate, {
  ItemDetails,
} from "../../containers/orders/DetailsTemplate";
import OrderProduct from "../../containers/orders/OrderProduct";
import OrderStatus from "../../containers/orders/OrderStatus";
import setting from "../../data/setting";
import capitalizeFirstLetter from "../../helper/capitalizeFirstLetter";
import { statusColor } from "../../helper/statusColor";
import Layout from "../../layout/Layout";

const OrderQuery = gql`
  query Order($id: ID!) {
    order(id: $id) {
      id
      orderId
      trackingId
      paymentId
      status
      totalPrice
      address {
        street
        city
        state
        country
        phoneNumber
      }
      paymentMethod
      deliveryMethod
      shippingFee
      pickup
      coupon {
        id
        email
        discount
        userId
        code
        expiresIn
        description
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      progress {
        name
        checked
        updatedAt
      }
      products {
        id
        quantity
        price
      }
      phoneNumber
    }
  }
`;

const Order = () => {
  const router = useRouter();

  let orderId = router.query.oid;

  const [data, setData] = useState<OrderType | null>(null);

  const [getOrder, { loading }] = useLazyQuery<{ order: OrderType }>(
    OrderQuery,
    {
      onCompleted: (d) => setData(d.order),
      onError: (err) => console.table(err),
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    getOrder({ variables: { id: orderId } });
  }, [orderId, getOrder]);

  const trueStatus = data?.progress.filter((r) => r.checked) ?? [];
  let status = trueStatus[trueStatus.length - 1]?.name ?? "Pending";

  const infoItems: ItemDetails[][] = [
    [
      {
        name: "Product ID",
        value: data?.orderId,
      },
      {
        name: "Status",
        value: ` • ${capitalizeFirstLetter(status)}`,
        color: statusColor(status),
        bold: true,
      },
    ],
    [
      {
        name: "Total price",
        value: (
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap ">
            {data
              ? numericFormatter(data.totalPrice.toString(), {
                  thousandSeparator: true,
                  prefix: "$ ",
                })
              : null}
          </p>
          // <NumberFormat
          //   displayType="text"
          //   value={Number(data?.totalPrice).toFixed(2)}
          //   prefix="$"
          //   renderText={(value) => (
          //     <p className="text-neutral-700 dark:text-neutral-400">{value}</p>
          //   )}
          // />
        ),
      },
      data?.deliveryMethod === "Pickup Station" && data?.phoneNumber
        ? {
            name: "Phone Number",
            value:
              data?.deliveryMethod === "Pickup Station"
                ? data?.phoneNumber
                : data?.address?.phoneNumber,
          }
        : {
            name: "Delivery Address",
            value:
              data?.deliveryMethod === "Pickup Station"
                ? data?.pickup
                : [
                    data?.address.street,
                    data?.address.city,
                    data?.address.state,
                    data?.address.country,
                  ].join(", "),
          },
    ],
    data?.coupon?.code
      ? [
          {
            name: "Coupon",
            value: data.coupon.code,
          },
        ]
      : [],
  ];

  const paymentItems: ItemDetails[][] = [
    [
      {
        name: "Payment ID",
        value: data?.paymentId,
      },
      {
        name: "Tracking ID",
        value: data?.trackingId,
      },
    ],
    [
      {
        name: "Payment method",
        value: data?.paymentMethod,
      },
      {
        name: "Delivery method",
        value: data?.deliveryMethod,
      },
    ],
  ];

  return (
    <Layout>
      <Head>
        <title>Order: {orderId}</title>
      </Head>

      <div className="grid place-items-center">
        {data && (
          <>
            <DetailsTemplate title="Order Info" list={infoItems} />
            <DetailsTemplate title=" Payment Details" list={paymentItems} />
            <OrderProduct products={data?.products ?? []} />
            <OrderStatus
              order={data}
              refetch={() => getOrder({ variables: { id: orderId } })}
            />
          </>
        )}

        {loading && (
          <div className="w-full h-[20vw] pt-[20px] flex items-center justify-center">
            <ReactLoading type="spinningBubbles" color={setting.primary} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Order;
