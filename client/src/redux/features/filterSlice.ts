import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type FilterState = {
  filter: {
    category: string | string[];
    price: number[];
    rating: number;
    discount: string[];
  } | null;
};

type PayloadType = {
  category: string | string[];
  price: number[];
  rating: number;
  discount: string[];
};

export const filterSlice = createSlice({
  name: "category",
  initialState: {
    filter: null ,
  } as FilterState,
  reducers: {
    add: (state: FilterState, action: PayloadAction<PayloadType>) => {
      state.filter = action.payload;
    },
  },
});

export const { add } = filterSlice.actions;

export const selectFilter = (state: RootState) => state.filter.filter;

export default filterSlice.reducer;
