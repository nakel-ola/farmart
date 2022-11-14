import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { OrderSummaryType } from "../../../typing";
import CardTemplate from "../../components/CardTemplate";
import { Divider } from "../../components/Divider";
import { useTheme } from "../../styles/theme";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});


const OrderOverview = ({data} : {data: OrderSummaryType }) => {
  const { systemTheme, theme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;
  const columnChartOptions: ApexOptions = {
    chart: {
      type: "donut",
      height: 300,
      width: "100%",
      toolbar: {
        show: true,
      },
    },
    xaxis: {
  
      labels: {
        show: false,
      },
    },
    tooltip: {
      y: {
        formatter(val: number) {
          return `${val}`;
        },
      },
      cssClass: "",
      theme: currentTheme === "dark" ? "dark" : "light",
    },
    legend: {
      show: false,
    },
    
    labels: ["Pending", "Delivered", "Cancaled"],
    colors: ["#2563eb", "#22c55e", "#ef4444"],
    responsive: [
      {
        breakpoint: 600,
        options: {
          yaxis: {
            show: false,
          },
        },
      },
    ],
  };
  const options = columnChartOptions;
  const series = [data.pending, data.delivered, data.canceled];

  let items = [
    {
      name: "Pending",
      color: "#2563eb",
      data: [data.pending],
    },
    {
      name: "Delivered",
      color: "#22c55e",
      data: [data.delivered],
    },
    {
      name: "Cancaled",
      color: "#ef4444",
      data: [data.canceled],
    },
  ];

  let totalPrice = items.reduce((amount, item) => amount + item.data[0], 0);

  return (
    <CardTemplate title="Orders Overview" className="w-[95%] md:w-[48%] pb-2 mt-8">

      <div className="w-[100%] h-[300px] grid place-items-center">
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          height={300}
          width="100%"

        />
      </div>

      <div className="w-full grid place-items-center">
        <div className="py-2 px-[25px] flex items-center justify-between w-full">
          <strong className="text-lg ml-2 font-medium text-black dark:text-white flex-[0.3]">
            Total
          </strong>

          <p className="text-neutral-700 dark:text-neutral-400 ml-2">
            {totalPrice}
          </p>
        </div>
        {items.map((item, index: number) => (
          <div
            key={index}
            className="py-2 px-[25px] flex items-center justify-between w-full"
          >
            <div className="flex items-center flex-[0.3]">
              <strong
                className="h-[10px] w-[10px] mx-2 rounded-full"
                style={{ backgroundColor: item.color }}
              ></strong>
              <strong className="text-lg font-normal text-black dark:text-white">
                {item.name}
              </strong>
            </div>

            <p className="text-neutral-700 dark:text-neutral-400 ml-2">
              {item.data[0]}
            </p>
          </div>
        ))}
      </div>
    </CardTemplate>
  );
};

export default OrderOverview;
