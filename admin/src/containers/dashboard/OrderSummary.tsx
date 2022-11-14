import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown2 } from "iconsax-react";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { OrderStatisticsType } from "../../../typing";
import Button from "../../components/Button";
import CardTemplate from "../../components/CardTemplate";
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
    <CardTemplate
      title="Orders Statistics"
      className="md:w-[90%] pb-2 mt-8"
      showEditButton
      editTitle={
        <div ref={ref} className="relative">
          <Button
            className={`text-green-600 bg-green-600/10 mr-2 relative flex items-center`}
            onClick={() => setToggle(!toggle)}
          >
            {capitalizeFirstLetter(slot)}
            <ArrowDown2 />
          </Button>
          <AnimatePresence>
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
          </AnimatePresence>
        </div>
      }
    >
      <div className="w-[100%] grid place-items-center ">
        <IncomeAreaChart slot={slot.toLowerCase()} series={series} />
      </div>
    </CardTemplate>
  );
};

const Card = ({ onClick }: { onClick: (value: "month" | "week") => void }) => {
  return (
    <motion.div
      initial={{ height: "0px" }}
      animate={{ height: "80px" }}
      exit={{ height: "0px" }}
      transition={{ duration: 0.3 }}
      className="absolute top-8 z-10 right-1 w-[120px] h-[80px] max-h-[200px] overflow-scroll bg-white dark:bg-dark shadow-md shadow-slate-300 dark:shadow-black/10 rounded-lg scrollbar-hide"
    >
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
    </motion.div>
  );
};

export default OrderSummary;
