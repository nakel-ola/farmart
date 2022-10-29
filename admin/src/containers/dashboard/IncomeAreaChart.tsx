import type { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";

// third-party
import ReactApexChart from "react-apexcharts";
import setting from "../../data/setting";
import { useTheme } from "../../styles/theme";

// chart options
const areaChartOptions: ApexOptions = {
  chart: {
    height: 450,
    type: "area",
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    width: 3,
  },
};

let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let weeks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ==============================|| INCOME AREA CHART ||============================== //

type Series = {
  name: string;
  data: number[];
};

type Props = {
  slot: string;
  series: Series;
};


const IncomeAreaChart = ({ slot, series }: Props) => {
  const { systemTheme, theme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  let primary = setting.blue,
    secondary = setting.blue,
    line = currentTheme === "dark" ? setting.lineDark : setting.line;

  const [options, setOptions] = useState<ApexOptions>(areaChartOptions);

  useEffect(() => {
    setOptions((prevState: ApexOptions) => ({
      ...prevState,
      colors: [setting.primary],
      xaxis: {
        categories: slot === "month" ? months : weeks,
        axisBorder: {
          show: true,
          color: line,
        },
        tickAmount: slot === "month" ? 12 : 7,
      },
      yaxis: {
        labels: {
          formatter(val: number) {
            return `$${val}`;
          },
        },
      },
      grid: {
        borderColor: line,
        strokeDashArray: 10
      },
      tooltip: {
        theme: currentTheme === "dark" ? "dark" : "light",
      },
    }));
  }, [primary, secondary, line, slot,currentTheme]);

  return (
    <div id="chart" className="w-full h-[300px] md:h-[400px]">
      <ReactApexChart
        options={options}
        series={[series]}
        type="area"
        height="100%"
        className="text-black dark:text-white"
        width="100%"
      />
    </div>
  );
};
export default IncomeAreaChart;
