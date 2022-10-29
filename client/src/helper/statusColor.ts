export const statusColor = (word: string) => {
  let letter = word.toLowerCase();
  switch (letter) {
    case "pending":
      return "text-blue-500";
    case "delivered":
      return "text-green-500";
    case "canceled":
      return "text-red-500";
    default:
      return "";
  }
};

export const statusbg = (word: string) => {
  let letter = word.toLowerCase();
  switch (letter) {
    case "pending":
      return "bg-blue-600/10";
    case "delivered":
      return "bg-green-500/10";
    case "canceled":
      return "bg-red-500/10";
    default:
      return "";
  }
};