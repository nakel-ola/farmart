import clsx from "clsx";
import { ShoppingCart } from "iconsax-react";
import { useRouter } from "next/router";
import React from "react";
import { numericFormatter } from "react-number-format";
import { OrderType } from "../../../typing";
import {
  Table,
  TableBody,
  TableContent,
  TableHead,
  TableRow,
} from "../../components/tables";
import Header from "../../components/tables/Header";
import capitalizeFirstLetter from "../../helper/capitalizeFirstLetter";
import { statusColor } from "../../helper/statusColor";
import truncate from "../../helper/truncate";

const Orders = ({ items }: { items: OrderType[] }) => {
  const router = useRouter();

  const tableList: any[] = [
    { title: "Date" },
    { title: "Status" },
    { title: "Price" },
  ];

  return (
    <div className="w-[95vw] md:w-[50%] overflow-hidden rounded-lg md:rounded-r-none">
      <Table
        headerComponent={
          <Header
            title="Order History"
            showSearch={false}
            rightComponent={
              <p
                className="text-[1rem] mr-[10px] text-blue-500 font-[500] md:hover:underline cursor-pointer"
                onClick={() => router.push("/orders")}
              >
                See all
              </p>
            }
          />
        }
      >
        <TableHead disableDivider={items.length === 0} tableList={tableList} />
        {items.length > 0 ? (
          <TableBody disableDivider={true}>
            {items.map((props: OrderType, i: number) => {
              const trueStatus = props.progress.filter((r) => r.checked);
              let status = trueStatus[trueStatus.length - 1]?.name ?? "Pending";
              return (
                <TableRow
                  key={i}
                  className="cursor-pointer"
                  onClick={() => {
                    router.push(`/order/${props.id}`);
                  }}
                >
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
                    <p
                      className={clsx(
                        "text-sm font-medium text-left whitespace-nowrap py-[2px] rounded-lg",
                        statusColor(status)
                      )}
                    >
                      • {truncate(capitalizeFirstLetter(status), 10, "middle")}
                    </p>
                  </TableContent>
                  <TableContent>
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap ">
                      {numericFormatter(props.totalPrice.toString(), {
                        thousandSeparator: true,
                        prefix: "$ ",
                      })}
                    </p>
                  </TableContent>
                </TableRow>
              );
            })}
          </TableBody>
        ) : null}
      </Table>

      {items.length === 0 ? (
        <div className="grid my-10 place-items-center">
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
    </div>
  );
};
export default Orders;
