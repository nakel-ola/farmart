import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";


type Option = {
  open: boolean;
  data: any | null;
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
  data: any | null;
};


export const dialogSlice = createSlice({
  name: "dialog",
  initialState: {
    edit: {
      open: false,
      data: null
    },
    delete: {
      open: false,
      data: null
    },
    category: {
      open: false,
      data: null
    },
    banner: {
      open: false,
      data: null
    },
    block: {
      open: false,
      data: null
    },
    coupon: {
      open: false,
      data: null
    },
    couponDelete: {
      open: false,
      data: null
    },
    inbox: {
      open: false,
      data: null
    },
    employeeEdit: {
      open: false,
      data: null
    },
    invite: {
      open: false,
      data: null
    },
  } as DialogState,
  reducers: {
    add: (state: DialogState, action: PayloadAction<PayloadProps>) => {
      state[action.payload.type] = action.payload;
    },
    remove: (state: DialogState, action: PayloadAction<{ type: Type }>) => {
      state[action.payload.type] = { open: false, data: null };
    },
  },
});

export const { add, remove } = dialogSlice.actions;

export const selectDialog = (state: RootState) => state.dialog;

export default dialogSlice.reducer;
