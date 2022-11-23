import { RatingType } from "./../../typing.d";

export interface RatingReturnValue {
  average: number;
  total: number;
  ratings: Array<RatingType>;
}
const calculateRating = (v: Array<RatingType>): RatingReturnValue => {
  let rating = v.map((item) => item.value).reverse();
  let totalValue = v.reduce((amount, item) => item.value + amount, 0);
  // AR = 1*a+2*b+3*c+4*d+5*e/(R)
  let total = rating.reduce((amount, item) => item + amount, 0);
  let n = rating.reduce(
    (amount, item, index) => item * (index + 1) + amount,
    0
  );
  let ar = n / total;
  
  return {
    average: Number(ar.toFixed(1)),
    total: totalValue,
    ratings: v
  };
};

export default calculateRating;
