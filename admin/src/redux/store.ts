import { AnyAction, combineReducers, configureStore } from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import basketReducer, { BasketState } from "./features/basketSlice";
import categoryReducer, { CategoryState } from "./features/categorySlice";
import dialogReducer, { DialogState } from "./features/dialogSlice";
import orderReducer, { OrderState } from "./features/orderSlice";
import userReducer, { UserState } from "./features/userSlice";

export type RootState = {
  basket: BasketState;
  user: UserState;
  category: CategoryState;
  order: OrderState;
  dialog: DialogState;
};

const combinedReducer = combineReducers({
  basket: basketReducer,
  user: userReducer,
  category: categoryReducer,
  order: orderReducer,
  dialog: dialogReducer,
});

const masterReducer = (state: any, action: AnyAction) => {
  if(action.type === HYDRATE) {
    const nextState = {
      ...state,
      user: {
        ...state.user,
        user: action.payload.user.user ?? null,
        cookies: action.payload.user.cookies ?? null
      }
    }
    return nextState
  }else {
    return combinedReducer(state, action)
  }
}

export const makeStore = () => configureStore({
  reducer: masterReducer,
  devTools: true,
});

export const wrapper = createWrapper(makeStore, { debug: false });


export default configureStore({
  reducer: {
    basket: basketReducer,
    user: userReducer,
    category: categoryReducer,
    order: orderReducer,
    dialog: dialogReducer,
  },
});
