import { gql, useMutation, useQuery } from "@apollo/client";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import ReactLoading from "react-loading";
import { NumericFormat } from "react-number-format";
import { OrderType } from "../../../typing";
import Button from "../../components/Button";
import Header from "../../components/Header";
import DetailsTemplate, {
  ItemDetails,
} from "../../containers/receipt/DetailsTemplate";
import OrderProduct from "../../containers/receipt/OrderProduct";
import OrderStatus from "../../containers/receipt/OrderStatus";
import setting from "../../data/setting";
import capitalizeFirstLetter from "../../helper/capitalizeFirstLetter";
import { statusColor } from "../../helper/statusColor";
import Layouts from "../../layout/Layouts";

const UpdateQuery = gql`
  mutation UpdateProgress($input: ProgressInput!) {
    updateProgress(input: $input) {
      msg
    }
  }
`;

const OrderQuery = gql`
  query Order($id: ID!) {
    order(id: $id) {
      ... on Order {
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
          coupon
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

      ... on ErrorMsg {
        error
      }
    }
  }
`;

const Order = () => {
  const router = useRouter();

  let orderId = router.query.oid;

  const [data, setData] = useState<OrderType | null>(null);

  const { refetch, loading } = useQuery(OrderQuery, {
    variables: { id: orderId },
    onCompleted: (d) => {
      if (d.order.__typename !== "ErrorMsg") {
        setData(d.order);
      }
    },
    onError: (err) => console.table(err),
  });

  const [updateProgress] = useMutation(UpdateQuery, {
    onCompleted: () => refetch(),
    onError: (err) => console.table(err),
  });

  const handleUpdate = () => {
    updateProgress({
      variables: {
        input: {
          id: data?.id,
          name: "canceled",
        },
      },
    });
  };

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
          <NumericFormat
            displayType="text"
            value={Number(data?.totalPrice).toFixed(2)}
            prefix="$"
            renderText={(value) => (
              <p className="text-neutral-700 dark:text-neutral-400">{value}</p>
            )}
          />
        ),
      },
      data?.deliveryMethod === "Pickup Station"
        && data?.phoneNumber ? {
        name: "Phone Number",
        value: data?.deliveryMethod === "Pickup Station"
        ? data?.phoneNumber : data?.address?.phoneNumber,
      } : {
        name: "Delivery Address",
        value: data?.deliveryMethod === "Pickup Station"
        ? data?.pickup :[
          data?.address.street,
          data?.address.city,
          data?.address.state,
          data?.address.country,
        ].join(", "),
      },
    ],
    data?.deliveryMethod !== "Pickup Station"
        && !data?.phoneNumber ? [
      {
        name: "Delivery Address",
        value: data?.deliveryMethod === "Pickup Station"
        ? data?.pickup :[
          data?.address.street,
          data?.address.city,
          data?.address.state,
          data?.address.country,
        ].join(", "),
      },
    ] : [],
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
    <Layouts>
      <Head>
        <title>Order: {orderId}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      {data && (
        <div className="grid place-items-center">
          <DetailsTemplate title="Order Info" list={infoItems} />
          <div className="h-4" />
          <DetailsTemplate title=" Payment Details" list={paymentItems} />
          <OrderProduct products={data?.products} />
          <OrderStatus order={data} />
          <div className="w-[80%] grid place-items-center">
            {!["canceled", "delivered"].includes(data.status) && (
              <Button
                onClick={handleUpdate}
                className="text-red-600 bg-transparent mb-2"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="w-full h-[20vw] pt-[20px] flex items-center justify-center">
          <ReactLoading type="spinningBubbles" color={setting.primary} />
        </div>
      )}
    </Layouts>
  );
};

export default Order;
