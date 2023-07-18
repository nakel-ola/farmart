import { gql, useLazyQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Coupon } from "../../../typing";
import Button from "../../components/Button";
import {
  addCoupon,
  getBasketTotal,
  selectBasket,
  selectCoupon,
} from "../../redux/features/basketSlice";
import PromoCard from "./PromoCard";
import TotalCard from "./TotalCard";
import { useSession } from "next-auth/react";

export const VerifyCouponQuery = gql`
  query VerifyCoupon($input: VerifyCouponInput!) {
    verifyCoupon(input: $input) {
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
  }
`;

const Footer = ({ toggle }: { toggle?: boolean }) => {
  const router = useRouter();

  const { data } = useSession()
  const [input, setInput] = useState("");

  const basket = useSelector(selectBasket);
  const coupon = useSelector(selectCoupon);
  const user = data?.user;

  const dispatch = useDispatch();

  const [verifyCoupon] = useLazyQuery<{ verifyCoupon: Coupon }>(VerifyCouponQuery, {
    onCompleted: (data) => {
      console.log(data);
      dispatch(addCoupon(data.verifyCoupon));
    },
    onError: (err: any) => console.table(err),
  });

  const handleApply = () => {
    verifyCoupon({
      variables: {
        input: {
          email: user?.email,
          coupon: input,
        },
      },
    });
  };

  const isCheckout = router.pathname === "/checkout";

  return (
    <div className="hidden md:grid place-items-center bottom-0 fixed z-10 dark:bg-dark bg-white w-[24%]">
      {isCheckout && (
        <div className="grid place-items-center w-[90%] my-2">
          {coupon ? (
            <div className="font-medium text-black dark:text-white"><strong className="text-primary">{coupon?.code}</strong> is Applyed</div>
          ) : (
            <PromoCard
              value={input}
              placeholder="Coupon Code"
              onChange={(e: any) => setInput(e.target.value)}
              onClear={() => setInput("")}
              handleApply={handleApply}
            />
          )}

          <TotalCard basketTotal={getBasketTotal(basket)} toggle={toggle} />
        </div>
      )}

      {!isCheckout && (
        <div className="w-[90%] flex items-center justify-between mt-2 mb-4">
          <div className="flex items-center">
            <strong className="text-black dark:text-white">Total: </strong>
            <p className="pl-2 text-black dark:text-white">
              ${getBasketTotal(basket).toFixed(2)}
            </p>
          </div>
          <Button
            className="bg-primary text-white"
            onClick={() => router.push("/checkout")}
          >
            Checkout
          </Button>
        </div>
      )}
    </div>
  );
};

export default Footer;
