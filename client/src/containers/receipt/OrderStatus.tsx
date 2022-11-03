import { IoCheckmark } from "react-icons/io5";
import { OrderProgress, OrderType } from "../../../typing";
import CardTemplate from "../../components/CardTemplate";
import { statusbg, statusColor } from "../../helper/statusColor";

const OrderStatus = ({
  order,
}: {
  order: OrderType;
}) => {

  let isCanceled = !!order.progress.find(
    (p) => p.name === "canceled" && p.checked === true
  );
  let isDelivered = !!order.progress.find(
    (p) => p.name === "delivered" && p.checked === true
  );

  return (
    <CardTemplate className="mb-4" title="Order Status">
      <div className="pl-[25px] mt-4 md:w-[60%] w-[80%] ">
        {order.progress.map((item: OrderProgress, index: number) => {
          let isLast = index === order.progress.length - (isCanceled ? 2 : 1);
          let show =
              index === 1
                ? item.name === "canceled" && item.checked
                : index === 2
                ? !isCanceled
                : true;
          return show && (
            <div key={index}>
              <div className="flex items-center my-2">
                <div
                  className={`h-[35px] w-[35px] rounded-full  flex items-center justify-center m-2 ${
                    item.checked
                      ? statusbg(item.name)
                      : "bg-slate-100 dark:bg-neutral-800"
                  }`}
                >
                  <IoCheckmark
                    size={25}
                    className={` ${
                      item.checked ? statusColor(item.name) : "text-black dark:text-white"
                    }`}
                  />
                </div>

                <p className="font-medium text-black dark:text-white ml-2">
                  {item.name.toUpperCase()}
                </p>
              </div>
              {!isLast && <Divider />}
            </div>
          );
        })}
      </div>
    </CardTemplate>
  );
};

const Divider = () => (
  <div className="flex items-center">
    <div className="w-[35px] flex items-center justify-center mx-2">
      <hr className="h-[25px] border-0 w-1 bg-slate-100 dark:bg-neutral-800 rounded-full" />
    </div>
  </div>
);

export default OrderStatus;
