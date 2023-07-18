import filterById from "./filter_by_id";
import filterByStatus from "./filter_by_status";
import order from "./order";
import orders from "./orders";
import ordersStatistics from "./orders_statistics";
import ordersSummary from "./orders_summary";

const queries = {
  orders,
  order,
  filterById,
  filterByStatus,
  ordersSummary,
  ordersStatistics,
};
export default queries;
