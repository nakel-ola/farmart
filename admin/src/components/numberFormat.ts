const numberFormat = (num: string) => {
  const length = num.length;

  const string = num.toString();

  let text = "";

  switch (length) {
    case 4:
      text = string.charAt(0) + "," + string.slice(1);
      break;
    case 5:
      text = string.slice(0, 2) + "," + string.slice(2);
      break;
    case 6:
      text = string.slice(0, 3) + "," + string.slice(3);
      break;
    case 7:
      text =
        string.charAt(0) + "," + string.slice(1, 4) + "," + string.slice(4);
      break;
    case 8:
      text =
        string.slice(0, 2) + "," + string.slice(2, 5) + "," + string.slice(5);
      break;
    case 9:
      text =
        string.slice(0, 3) + "," + string.slice(3, 6) + "," + string.slice(6);
      break;
    case 10:
      text =
        string.charAt(0) +
        "," +
        string.slice(1, 4) +
        "," +
        string.slice(4, 7) +
        "," +
        string.slice(7);
      break;
    case 11:
      text =
        string.slice(0, 2) +
        "," +
        string.slice(2, 5) +
        "," +
        string.slice(5, 8) +
        "," +
        string.slice(8);
      break;
    case 12:
      text =
        string.slice(0, 3) +
        "," +
        string.slice(3, 6) +
        "," +
        string.slice(6, 9) +
        "," +
        string.slice(9);
      break;
    case 13:
      text =
        string.charAt(0) +
        "," +
        string.slice(1, 4) +
        "," +
        string.slice(4, 7) +
        "," +
        string.slice(7, 10) +
        "," +
        string.slice(10);
      break;

    default:
      text = string;
    // code
  }

  return text;
};

export default numberFormat;
