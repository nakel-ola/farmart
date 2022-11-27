import { NextApiRequest, NextApiResponse } from "next";

/*
 * Product data can be loaded from anywhere. In this case, we’re loading it from
 * a local JSON file, but this could also come from an async call to your
 * inventory management service, a database query, or some other API call.
 *
 * The important thing is that the product info is loaded from somewhere trusted
 * so you know the pricing information is accurate.
 */

import Stripe from "stripe";
import { AddressType, Basket, Coupon } from "../../../../typing";
import clean from "../../../helper/clean";
import { formatAmountForStripe } from "../../../helper/stripe-helpers";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2022-08-01",
});

interface BodyType {
  products: Basket[];
  pickup: string;
  address: AddressType | null;
  coupon: Coupon | null;
  paymentMethod: string;
  deliveryMethod: string;
  phoneNumber: string | null;
  email: string;
  userId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const {
        products,
        pickup,
        address,
        coupon,
        paymentMethod,
        deliveryMethod,
        phoneNumber,
        email,
        userId
      }: BodyType = req.body;

      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
        products.map((product: Basket) => ({
          quantity: product.quantity,
          price_data: {
            currency: "usd",
            unit_amount: formatAmountForStripe(product.price,"USD"),
            product_data: {
              name: product.title,
              description: product.description,
              images: [product.image.url],
            },
          },
        }));

      let metadata = clean({
        email,
        userId,
        products: JSON.stringify(
          products.map((b: Basket) => ({
            id: b.id,
            quantity: b.quantity,
            price: `${b.price * b.quantity}`,
          }))
        ),
        pickup,
        address: address ? JSON.stringify(address) : null,
        coupon: coupon ? JSON.stringify(coupon) : null,
        paymentMethod,
        deliveryMethod,
        phoneNumber,
      })

      const params: Stripe.Checkout.SessionCreateParams = {
        submit_type: "pay",
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        line_items,
        success_url: `${process.env.HOST}/checkout?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.HOST}/checkout`,
        mode: "payment",
        metadata
      };

      // console.log(params);


      const checkoutSession: Stripe.Checkout.Session =
        await stripe.checkout.sessions.create(params);


      res.status(200).json(checkoutSession);
    } catch (err) {
      console.log(err);
      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

// shipping_address_collection: {
//   allowed_countries: [
//     "AC",
//     "AD",
//     "AE",
//     "AF",
//     "AG",
//     "AI",
//     "AL",
//     "AM",
//     "AO",
//     "AQ",
//     "AR",
//     "AT",
//     "AU",
//     "AW",
//     "AX",
//     "AZ",
//     "BA",
//     "BB",
//     "BD",
//     "BE",
//     "BF",
//     "BG",
//     "BH",
//     "BI",
//     "BJ",
//     "BL",
//     "BM",
//     "BN",
//     "BO",
//     "BQ",
//     "BR",
//     "BS",
//     "BT",
//     "BV",
//     "BW",
//     "BY",
//     "BZ",
//     "CA",
//     "CD",
//     "CF",
//     "CG",
//     "CH",
//     "CI",
//     "CK",
//     "CL",
//     "CM",
//     "CN",
//     "CO",
//     "CR",
//     "CV",
//     "CW",
//     "CY",
//     "CZ",
//     "DE",
//     "DJ",
//     "DK",
//     "DM",
//     "DO",
//     "DZ",
//     "EC",
//     "EE",
//     "EG",
//     "EH",
//     "ER",
//     "ES",
//     "ET",
//     "FI",
//     "FJ",
//     "FK",
//     "FO",
//     "FR",
//     "GA",
//     "GB",
//     "GD",
//     "GE",
//     "GF",
//     "GG",
//     "GH",
//     "GI",
//     "GL",
//     "GM",
//     "GN",
//     "GP",
//     "GQ",
//     "GR",
//     "GS",
//     "GT",
//     "GU",
//     "GW",
//     "GY",
//     "HK",
//     "HN",
//     "HR",
//     "HT",
//     "HU",
//     "ID",
//     "IE",
//     "IL",
//     "IM",
//     "IN",
//     "IO",
//     "IQ",
//     "IS",
//     "IT",
//     "JE",
//     "JM",
//     "JO",
//     "JP",
//     "KE",
//     "KG",
//     "KH",
//     "KI",
//     "KM",
//     "KN",
//     "KR",
//     "KW",
//     "KY",
//     "KZ",
//     "LA",
//     "LB",
//     "LC",
//     "LI",
//     "LK",
//     "LR",
//     "LS",
//     "LT",
//     "LU",
//     "LV",
//     "LY",
//     "MA",
//     "MC",
//     "MD",
//     "ME",
//     "MF",
//     "MG",
//     "MK",
//     "ML",
//     "MM",
//     "MN",
//     "MO",
//     "MQ",
//     "MR",
//     "MS",
//     "MT",
//     "MU",
//     "MV",
//     "MW",
//     "MX",
//     "MY",
//     "MZ",
//     "NA",
//     "NC",
//     "NE",
//     "NG",
//     "NI",
//     "NL",
//     "NO",
//     "NP",
//     "NR",
//     "NU",
//     "NZ",
//     "OM",
//     "PA",
//     "PE",
//     "PF",
//     "PG",
//     "PH",
//     "PK",
//     "PL",
//     "PM",
//     "PN",
//     "PR",
//     "PS",
//     "PT",
//     "PY",
//     "QA",
//     "RE",
//     "RO",
//     "RS",
//     "RU",
//     "RW",
//     "SA",
//     "SB",
//     "SC",
//     "SE",
//     "SG",
//     "SH",
//     "SI",
//     "SJ",
//     "SK",
//     "SL",
//     "SM",
//     "SN",
//     "SO",
//     "SR",
//     "SS",
//     "ST",
//     "SV",
//     "SX",
//     "SZ",
//     "TA",
//     "TC",
//     "TD",
//     "TF",
//     "TG",
//     "TH",
//     "TJ",
//     "TK",
//     "TL",
//     "TM",
//     "TN",
//     "TO",
//     "TR",
//     "TT",
//     "TV",
//     "TW",
//     "TZ",
//     "UA",
//     "UG",
//     "US",
//     "UY",
//     "UZ",
//     "VA",
//     "VC",
//     "VE",
//     "VG",
//     "VN",
//     "VU",
//     "WF",
//     "WS",
//     "XK",
//     "YE",
//     "YT",
//     "ZA",
//     "ZM",
//     "ZW",
//     "ZZ",
//   ],

// },
