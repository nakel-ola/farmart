import { configureStore,  AnyAction, combineReducers, } from "@reduxjs/toolkit";
import { HYDRATE,createWrapper } from "next-redux-wrapper";
import basketReducer, { BasketState } from "./features/basketSlice";
import categoryReducer, { CategoryState } from "./features/categorySlice";
import orderReducer, { OrderState } from "./features/orderSlice";
import userReducer, { UserState } from "./features/userSlice";
import dialogReducer, { DialogState } from "./features/dialogSlice";



export type RootState = {
  basket: BasketState;
  user: UserState;
  category: CategoryState;
  order: OrderState;
  dialog: DialogState;
}
const combinedReducer = combineReducers({
  basket: basketReducer,
  user: userReducer,
  dialog: dialogReducer,
  category: categoryReducer,
  order: orderReducer,
});

const masterReducer = (state: any, action: AnyAction) => {
  if(action.type === HYDRATE) {
    const nextState = {
      ...state,
      user: {
        ...state.user,
        user: action.payload.user.user ?? null,
        cookies: action.payload.user.cookies ?? null
      },
      category: {
        category: action.payload.category.category ?? []
      }
    }
    return nextState
  }else {
    return combinedReducer(state, action)
  }
}

export const makeStore = () => configureStore({
  reducer: masterReducer,
  devTools: true
});

export const wrapper = createWrapper(makeStore, { debug: false });

