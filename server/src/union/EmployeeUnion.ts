const EmployeeUnion = (value) => {
  console.log(value);
  switch (value.type) {
    case "Employee":
      return (value) => {
        return 
      }
      ;
    case "EmployeeData":
      return "EmployeeData";
    case "OrderData":
      return "OrderData";
    case "Order":
      return "Order";
    case "ErrorMsg":
      return "ErrorMsg";
    default:
      break;
  }
};

export default EmployeeUnion;
