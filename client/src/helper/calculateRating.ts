import { RatingType } from "./../../typing.d";

export interface RatingReturnValue {
  average: number;
  total: number;
  ratings: Array<RatingType>;
}
const calculateRating = (v: Array<RatingType>): RatingReturnValue => {
  let rating = v.map((item) => item.value).reverse();
  let totalValue = v.reduce((amount, item) => item.value + amount, 0);
  let total = rating.reduce((amount, item) => item + amount, 0);
  let n = rating.reduce(
    (amount, item, index) => item * (index + 1) + amount,
    0
  );
  let ar = n / total;

  return {
    average: Number.isNaN(ar) ? 0 : Number(ar.toFixed(1)),
    total: totalValue,
    ratings: v,
  };
};

export default calculateRating;
