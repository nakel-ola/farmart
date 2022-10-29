import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrderType } from "../../../typing";
import { RootState } from "../store";


export type OrderState = {
  order: OrderType | null
}
export const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: null
  } as OrderState,
  reducers: {
    add: (state: OrderState, action: PayloadAction<OrderType>) => {
      state.order = action.payload;
    }
  },
});

export const { add } = orderSlice.actions;

export const selectOrder = (state: RootState) => state.order.order;

export default orderSlice.reducer;