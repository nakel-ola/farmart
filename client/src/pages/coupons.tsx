import { gql, useQuery } from "@apollo/client";
import { TicketDiscount } from "iconsax-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { IoQrCode } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Coupon } from "../../typing";
import Button from "../components/Button";
import Header from "../components/Header";
import LoginCard from "../components/LoginCard";
import Layouts from "../layout/Layouts";
import { selectUser } from "../redux/features/userSlice";
import ReactLoading from "react-loading";


const CouponQuery = gql`
  query Coupons {
    coupons {
      id
      email
      discount
      code
      userId
      expiresIn
      description
    }
  }
`;

const Coupons = () => {
  const router = useRouter();

  const { data, loading } = useQuery<{ coupons: Coupon[] }>(CouponQuery);
  const user = useSelector(selectUser);

  return (
    <Layouts>
      <Head>
        <title>Coupons</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="h-full">
        <Header title="Coupons" />

        {user ? (
          loading ? (
            <div className="w-full h-[80%]  grid place-items-center">
              <ReactLoading type="spinningBubbles" />
            </div>
          ) : data?.coupons?.length! > 0 ? (
            <div className="flex flex-wrap items-center justify-center">
              {data?.coupons.map((coupon: Coupon, index: number) => (
                <Card key={index} {...coupon} />
              ))}
            </div>
          ) : (
            <div className="grid place-items-center h-[80%]">
              <div className="flex flex-col items-center justify-center">
                <div className="w-[100px] h-[100px] rounded-full bg-teal-500/10 flex items-center justify-center">
                  <TicketDiscount
                    size={100}
                    className="text-5xl text-neutral-700 dark:text-neutral-400"
                  />
                </div>
                <p className="font-medium text-lg p-2">
                  You currently have no available Coupon
                </p>
                <p className="p-2">
                  All your avaliable coupon will be displayed here
                </p>
                <Button onClick={() => router.push("/")}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          )
        ) : (
          <LoginCard />
        )}
      </div>
    </Layouts>
  );
};

const Card = ({ discount, description, expiresIn, code }: Coupon) => {
  return (
    <article className="relative w-[360px] h-[140px] bg-white dark:bg-dark shadow m-3 rounded-lg dark:shadow-black/30 ">
      <div className="relative h-full w-full mx-[17.5px] flex">
        <div className="w-[50%] flex flex-col justify-between">
          <div className="">
            <h1 className="m-2 mb-0 text-3xl font-bold text-primary">
              {discount}% Off
            </h1>
            <p className="mx-2 text-neutral-700 font-medium dark:text-neutral-400 text-sm">
              {description?.length! > 0 ? description : "On your next purchase"}{" "}
            </p>
          </div>
          {expiresIn && (
            <p className="m-2 text-neutral-700 font-medium dark:text-neutral-400 text-sm">
              Use before {new Date(Number(expiresIn)).toDateString()}
            </p>
          )}
        </div>
        <div className="w-[50%] flex items-center justify-center flex-col">
          <div className="bg-white dark:bg-dark">
            <IoQrCode className="text-8xl text-primary" />
          </div>
          <p className="font-bold text-primary">{code}</p>
        </div>
      </div>

      <div className="absolute top-[50%] translate-y-[-50%] left-[-17.5px] h-[35px] w-[35px] bg-slate-100 dark:bg-neutral-800 rounded-full" />
      <div className="absolute top-[50%] translate-y-[-50%] right-[-17.5px] h-[35px] w-[35px] bg-slate-100 dark:bg-neutral-800 rounded-full" />
    </article>
  );
};

export default Coupons;
