import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type CategoryState = {
  category: { name: string }[];
};
export const categorySlice = createSlice({
  name: "category",
  initialState: {
    category: [],
  } as CategoryState,
  reducers: {
    add: (state: CategoryState, action: PayloadAction<{ name: string }[]>) => {
      state.category = action.payload;
    },
  },
});

export const { add } = categorySlice.actions;

export const selectCatagory = (state: RootState) => state.category.category;

export default categorySlice.reducer;
