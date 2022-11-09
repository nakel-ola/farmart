import { gql } from "@apollo/client";
import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import { request } from 'graphql-request';


// Establish connection to Stripe

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY!);

const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

const PaymentQuery = gql`
  mutation CreateOrder($input: OrderInput!) {
    createOrder(input: $input) {
      id
      orderId
      trackingId
      userId
    }
  }
`;

const fulfillOrder = async (session: any, headers: any) => {
  let metadata = session.metadata;

  let variables = {
    input: {
      totalPrice: `${session.amount_total / 100}`,
      shippingFee: `${session.total_details.amount_shipping / 100}`,
      address: metadata?.address ? JSON.parse(metadata?.address) : null,
      pickup: metadata?.pickup ?? null,
      products: metadata?.products ? JSON.parse(metadata?.products) : null,
      coupon: metadata?.coupon ? JSON.parse(metadata?.coupon) : null,
      paymentMethod: metadata.paymentMethod,
      deliveryMethod: metadata.deliveryMethod,
      phoneNumber: metadata.phoneNumber,
    }
  };

  await request({
    url: process.env.SERVER_URL!,
    document: PaymentQuery,
    variables: variables,
    requestHeaders: {
        ...headers,
        userId: metadata.userId
    },
  }).then((data) => console.log(data))
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const requestBuffer = await buffer(req);
    const payload = requestBuffer.toString();
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err: any) {
      console.log("Error: ", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    //  Handle checkout session completed eventd

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      return fulfillOrder(session, req.headers)
        .then(() => res.status(200))
        .catch((err: any) => {
          console.log(err);
          res.status(400).send(`Webhook Error: ${err.message}`);
        });
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
