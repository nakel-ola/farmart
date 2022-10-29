import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";


type Option = {
  open: boolean;
  product: any | null;
};

export type DialogState = {
  edit: Option;
  delete: Option;
  category: Option;
  banner: Option;
  block: Option;
  coupon: Option;
  couponDelete: Option;
  inbox: Option;
  employeeEdit: Option;
  invite: Option;
};

type Type = "edit" | "delete" | "category" | "banner" | "block" | "coupon" | "couponDelete" | "inbox" | "employeeEdit" | "invite";

type PayloadProps = {
  type: Type;
  open: boolean;
  product: any | null;
};


export const dialogSlice = createSlice({
  name: "dialog",
  initialState: {
    edit: {
      open: false,
      product: null
    },
    delete: {
      open: false,
      product: null
    },
    category: {
      open: false,
      product: null
    },
    banner: {
      open: false,
      product: null
    },
    block: {
      open: false,
      product: null
    },
    coupon: {
      open: false,
      product: null
    },
    couponDelete: {
      open: false,
      product: null
    },
    inbox: {
      open: false,
      product: null
    },
    employeeEdit: {
      open: false,
      product: null
    },
    invite: {
      open: false,
      product: null
    },
  } as DialogState,
  reducers: {
    add: (state: DialogState, action: PayloadAction<PayloadProps>) => {
      state[action.payload.type] = action.payload;
    },
    remove: (state: DialogState, action: PayloadAction<{ type: Type }>) => {
      state[action.payload.type] = { open: false, product: null };
    },
  },
});

export const { add, remove } = dialogSlice.actions;

export const selectDialog = (state: RootState) => state.dialog;

export default dialogSlice.reducer;
