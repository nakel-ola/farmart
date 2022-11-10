import { ArrowDown2 } from "iconsax-react";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { OrderStatisticsType } from "../../../typing";
import Button from "../../components/Button";
import { Divider } from "../../components/Divider";
import capitalizeFirstLetter from "../../helper/capitalizeFirstLetter";
import useOnClickOutside from "../../hooks/useOnClickOutside";
const IncomeAreaChart = dynamic(() => import("./IncomeAreaChart"), {
  ssr: false,
});

const OrderSummary = ({ data }: { data: OrderStatisticsType }) => {
  const [slot, setSlot] = useState<"month" | "week">("month");
  const [toggle, setToggle] = useState(false);
  const [series, setSeries] = useState({
    name: "Page Views",
    data: data.month,
  });
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setToggle(false));

  return (
    <div className="w-[95%] md:w-[90%] rounded-lg dark:bg-dark dark:shadow-black/30 bg-white shadow-sm overflow-hidden pb-2 mt-8">
      <div className="w-full flex items-center justify-between py-2 border-b-[1px] border-slate-100 dark:border-neutral-800">
        <p className="pl-[15px] text-[1.2rem] text-black font-[600] dark:text-white">
          Orders Statistics
        </p>

        <div ref={ref} className="relative">
          <Button
            className={`text-green-600 bg-green-600/10 mr-2 relative flex items-center`}
            onClick={() => setToggle(!toggle)}
          >
            {capitalizeFirstLetter(slot)}
            <ArrowDown2 />
          </Button>
          {toggle && (
            <Card
              onClick={(value: "month" | "week") => {
                setSlot(value);
                setSeries({
                  ...series,
                  data: value === "month" ? data.month : data.week,
                });
                setToggle(false);
              }}
            />
          )}
        </div>
      </div>

      <div className="w-[100%] grid place-items-center ">
        <IncomeAreaChart slot={slot.toLowerCase()} series={series} />
      </div>
    </div>
  );
};

const Card = ({ onClick }: { onClick: (value: "month" | "week") => void }) => {
  return (
    <div className="absolute top-8 z-10 right-1 w-[120px] max-h-[200px] overflow-scroll bg-white dark:bg-dark shadow-md shadow-slate-300 dark:shadow-black/10 rounded-lg scrollbar-hide">
      <div
        className="flex items-center p-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-neutral-800"
        onClick={() => onClick("week")}
      >
        <p className="pl-1 text-black dark:text-white font-medium">Week</p>
      </div>
      <div
        className="flex items-center p-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-neutral-800"
        onClick={() => onClick("month")}
      >
        <p className="pl-1 text-black dark:text-white font-medium">Month</p>
      </div>
    </div>
  );
};

export default OrderSummary;
