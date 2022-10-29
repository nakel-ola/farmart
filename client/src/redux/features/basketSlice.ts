import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Basket, Coupon } from "../../../typing";
import { RootState } from "../store";

export type BasketState = {
  basket: Basket[];
  coupon: Coupon | null;
  shippingFee: number;
};

export const basketSlice = createSlice({
  name: "basket",
  initialState: {
    basket: [],
    coupon: null,
    shippingFee: 2,
  } as BasketState,
  reducers: {
    add: (state: BasketState, action: PayloadAction<Basket>) => {
      const existing = state.basket.find(
        (basketItem: any) => basketItem.id === action.payload.id
      );

      if (existing) {
        if (action.payload.quantity) {
          existing.quantity = action.payload.quantity;
        }
      }

      if (!existing) {
        return {
          ...state,
          basket: [action.payload, ...state.basket],
        };
      }
    },
    remove: (state: BasketState, action: PayloadAction<{ id: string }>) => {
      let newBasket = [...state.basket];
      const index = state.basket.findIndex(
        (basketItem: any) => basketItem.id === action.payload.id
      );

      if (index >= 0) {
        newBasket.splice(index, 1);
      }
      return {
        ...state,
        basket: newBasket,
      };
    },
    removeAll: (state: BasketState) => {
      let newBasket = [...state.basket];

      newBasket.splice(0, newBasket.length);

      return {
        ...state,
        basket: newBasket,
      };
    },
    addCoupon: (state: BasketState, action: PayloadAction<Coupon>) => {
      state.coupon = action.payload;
    },
    removeCoupon: (state: BasketState) => {
      state.coupon = null;
    },
  },
});

export const { add, remove, removeAll, addCoupon,removeCoupon } = basketSlice.actions;

export const getBasketTotal = (basket: Basket[]) =>
  basket?.reduce(
    (amount: any, item: any) => item.price * item.quantity + amount,
    0
  );

export const selectBasket = (state: RootState) => state.basket.basket;
export const selectCoupon = (state: RootState) => state.basket.coupon;
export const selectShipping = (state: RootState) => state.basket.shippingFee;

export default basketSlice.reducer;
