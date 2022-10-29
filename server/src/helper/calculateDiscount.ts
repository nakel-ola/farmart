const calculateDiscount = (price: number, discount: number) => {
  const discountPrice = price * (discount! / 100);

  const total = price - discountPrice;

  return total.toFixed(2);
};

export default calculateDiscount;
