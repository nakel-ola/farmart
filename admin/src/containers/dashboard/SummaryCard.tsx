import { ArrowRight, ShoppingCart, Icon, Truck, BagCross,Bag2 } from "iconsax-react";
import { useRouter } from "next/router";
import React from "react";
import { ProductSummaryType } from "../../../typing";
import { Divider } from "../../components/Divider";

export interface Item {
  Icon: Icon;
  title: string;
  amount: number;
  link: string;
  color?: string;
}


const SummaryCard = ({data} : {data: ProductSummaryType}) => {
  const router = useRouter();
  const items: Item[] = [
    {
      Icon: ShoppingCart,
      title: "Total Orders",
      amount: data.totalOrders,
      link: "/orders",
      color: "bg-orange-600",
    },
    {
      Icon: Truck,
      title: "Total Delivered",
      amount: data.totalDelivered,
      link: "/orders?type=delivered",
      color: "bg-blue-600",
    },
    {
      Icon: Bag2,
      title: "Total stock",
      amount: data.totalStock,
      link: "/products",
      color: "bg-pink-600",
    },
    {
      Icon: BagCross,
      title: "Out of stock",
      amount: data.outOfStock,
      link: "/products?type=outofstock",
      color: "bg-green-600",
    },
  ];
  return (
    <div className="w-[95%] md:w-[90%] flex flex-wrap justify-evenly items-center mt-[15px]">
      {items.map(({ Icon, color, title,amount,link }: Item, index: number) => (
        <div
          key={index}
          className="bg-white dark:bg-dark w-full md:w-fit md:flex-1 rounded-lg m-[8px] shadow-sm dark:shadow-black/30"
        >
          <div className="flex items-center m-1 mb-0">
            <div
              className={`w-[45px] m-[5px] h-[45px] shrink-0 rounded-full flex items-center justify-center ${color}`}
            >
              <Icon size={25} variant="Bold" className="text-white" />
            </div>

            <div className="ml-2">
              <p className="text-[1.1rem] text-black dark:text-white whitespace-nowrap font-medium">
                {title}
              </p>
              <p className="text-[0.8rem] text-neutral-700 dark:text-neutral-400 font-medium">
                {amount}
              </p>
            </div>
          </div>
          <Divider />

          <button className="flex items-center p-2 pt-0 w-full" onClick={() => router.push(link)}>
            <p className="text-sm  font-medium text-neutral-500">See more</p>
            <ArrowRight size={20} className="mx-2 text-neutral-500"/>
          </button>
        </div>
      ))}
    </div>
  );
};

export default SummaryCard;
