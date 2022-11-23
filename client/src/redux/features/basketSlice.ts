import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Basket, Coupon } from "../../../typing";
import { clearStorage, getStorage, setStorage } from "../../helper/localStorage";
import { RootState } from "../store";

export type BasketState = {
  basket: Array<Basket>;
  coupon: Coupon | null;
  shippingFee: number;
};

let key = "basket";

export const basketSlice = createSlice({
  name: "basket",
  initialState: {
    basket: getStorage(key, []),
    coupon: null,
    shippingFee: 2,
  } as BasketState,
  reducers: {
    add: (state: BasketState, action: PayloadAction<Basket>) => {
      // creating new instance of the basket
      const newBasket = [...state.basket];

      //  finding if the the item to add exist in the state
      const index = newBasket.findIndex(
        (basketItem: any) => basketItem.id === action.payload.id
      );

      // if item to add exist in the state i want to update the quantity
      if (index !== -1) {
        if (action.payload.quantity) {
          newBasket[index].quantity = action.payload.quantity;
        }
      } else {
        // if item to add does not exist in the state i want to add it to state
        newBasket.push(action.payload);
      }

      // updating the local state with the new value
      setStorage<Array<Basket>>(key, newBasket);

      // updating the basket state with the new value
      state.basket = newBasket;
    },
    remove: (state: BasketState, action: PayloadAction<{ id: string }>) => {
      // creating new instance of the basket
      let newBasket = [...state.basket];

      //  finding if the the items to add exist in the state
      const index = state.basket.findIndex(
        (basketItem: any) => basketItem.id === action.payload.id
      );

      // if item to delete exist in the state i want to remove it
      if (index >= 0) {
        newBasket.splice(index, 1);

        // updating the local state with the new value
        setStorage<Array<Basket>>(key, newBasket);

        state.basket = newBasket;
      }
    },
    removeAll: (state: BasketState) => {
      state.basket = [];
      // updating the local state with the new value
      clearStorage(key);
    },
    addCoupon: (state: BasketState, action: PayloadAction<Coupon>) => {
      state.coupon = action.payload;
    },
    removeCoupon: (state: BasketState) => {
      state.coupon = null;
    },
  },
});

export const { add, remove, removeAll, addCoupon, removeCoupon } =
  basketSlice.actions;

export const getBasketTotal = (basket: Basket[]) =>
  basket?.reduce(
    (amount: any, item: any) => item.price * item.quantity + amount,
    0
  );

export const selectBasket = (state: RootState) => state.basket.basket;
export const selectCoupon = (state: RootState) => state.basket.coupon;
export const selectShipping = (state: RootState) => state.basket.shippingFee;

export default basketSlice.reducer;
