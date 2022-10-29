import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductType } from "../../../typing";
import { RootState } from "../store";

export type BasketState = {
  basket: ProductType[];
};

export const basketSlice = createSlice({
  name: "basket",
  initialState: {
    basket: [],
  } as BasketState,
  reducers: {
    add: (state: BasketState, action: PayloadAction<ProductType>) => {
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
  },
});

export const { add, remove, removeAll } = basketSlice.actions;

export const getBasketTotal = (basket: any) =>
  basket?.reduce(
    (amount: any, item: any) => item.price * item.quantity + amount,
    0
  );

export const selectBasket = (state: RootState) => state.basket.basket;

export default basketSlice.reducer;
