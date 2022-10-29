const OrdersUnion = (value) => {
  switch (value.type) {
    case "OrderData":
      return "OrderData";
    case "Order":
      return "Order";
    default:
      break;
  }
};

export default {OrdersUnion};
