import clsx from "clsx";
import { useRouter } from "next/router";
import React from "react";
import NumberFormat from "react-number-format";
import { OrderType } from "../../../typing";
import Table from "../../components/Table";
import TableContent from "../../components/TableContent";
import TableHeader from "../../components/TableHeader";
import TableList from "../../components/TableList";
import TableRow from "../../components/TableRow";
import capitalizeFirstLetter from "../../helper/capitalizeFirstLetter";
import { statusColor } from "../../helper/statusColor";
import truncate from "../../helper/truncate";

const Orders = ({ items }: { items: OrderType[] }) => {
  const router = useRouter();

  const tableItems: string[] = ["Date", "Status", "Price"];

  return (
    <div className="w-[95vw] md:w-[50%] overflow-hidden rounded-lg md:rounded-r-none">
      <Table>
        <TableHeader
          title="Order History"
          tableList={tableItems}
          showSearch={false}
          leftComponent={
            <p
              className="text-[1rem] mr-[10px] text-blue-500 font-[500] md:hover:underline cursor-pointer"
              onClick={() => router.push("/orders")}
            >
              See all
            </p>
          }
        />

        <TableList>
          {items.map((props: OrderType, i: number) => {
            const trueStatus = props.progress.filter((r) => r.checked);
            let status = trueStatus[trueStatus.length - 1]?.name ?? "Pending";
            return (
              <TableRow
                key={i}
                onClick={() => {
                  router.push(`/order/${props.id}`);
                }}
              >
                <TableContent>
                  <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
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
                      "text-[0.9rem] font-medium text-center w800espace-nowrap py-[2px] px-2 rounded-lg",
                      statusColor(status)
                    )}
                  >
                    • {truncate(capitalizeFirstLetter(status), 10, "middle")}
                  </p>
                </TableContent>
                <TableContent>
                  <NumberFormat
                    thousandSeparator
                    displayType="text"
                    value={Number(props.totalPrice).toFixed(2)}
                    prefix="$"
                    renderText={(value) => (
                      <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap ml-2">
                        {value}
                      </p>
                    )}
                  />
                </TableContent>
              </TableRow>
            );
          })}
        </TableList>
      </Table>
    </div>
  );
};
export default Orders;
