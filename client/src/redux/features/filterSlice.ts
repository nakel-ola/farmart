import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type FilterState = {
  filter: {
    category: null | string[];
    price: number[] | null;
    rating: number | null;
    discount: string[] | null;
  } | null;
};

type PayloadType = {
  category: null | string[];
  price: number[] | null;
  rating: number | null ;
  discount: string[] | null;
};

export const filterSlice = createSlice({
  name: "filter",
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
