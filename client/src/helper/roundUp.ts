const roundUp = (num: number) => {
  const string = num.toString().split(".");
  if (string.length > 1) return Number(string[0]) + 1;
  else return Number(num);
};

export  default roundUp;