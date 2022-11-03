import {
  Action,
  AnyAction,
  combineReducers,
  configureStore,
  EnhancedStore,
  getDefaultMiddleware,
  MiddlewareArray,
  Store,
  ThunkAction
} from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import basketReducer, { BasketState } from "./features/basketSlice";
import categoryReducer, { CategoryState } from "./features/categorySlice";
import dialogReducer, { DialogState } from "./features/dialogSlice";
import filterReducer, { FilterState } from "./features/filterSlice";
import orderReducer, { OrderState } from "./features/orderSlice";
import userReducer, { UserState } from "./features/userSlice";

export type RootState = {
  basket: BasketState;
  user: UserState;
  category: CategoryState;
  order: OrderState;
  dialog: DialogState;
  filter: FilterState;
};

const combinedReducer = combineReducers({
  basket: basketReducer,
  user: userReducer,
  dialog: dialogReducer,
  category: categoryReducer,
  order: orderReducer,
  filter: filterReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["basket"],
};

export type AppStore = ReturnType<typeof setupStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

const masterReducer = (state: any, action: AnyAction) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      user: {
        ...state.user,
        user: action.payload.user.user ?? null,
        cookies: action.payload.user.cookies ?? null,
      },
      category: {
        category: action.payload.category.category ?? [],
      },
    };
    return nextState;
  } else {
    return combinedReducer(state, action);
  }
};

export const makeStore = () =>
  configureStore({
    reducer: masterReducer,
    devTools: true,
  });

const persistedReducer = persistReducer(persistConfig, masterReducer);

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false,
});

export const setupStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: customizedMiddleware,
  });
};

export const persistor = (store: Store) => persistStore(store);
export const store = setupStore();

export const wrapper = createWrapper(setupStore, { debug: false });
