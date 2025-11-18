// redux
// constants
import { baseApi } from "@/api";
import {
  DEV,
  PERSIST_BLACKLIST,
  PERSIST_DATA_TIME,
  PERSIST_VERSION,
  PERSIST_WHITELIST, // PERSIST_WHITELIST,
  STATE_MIGRATIONS,
} from "@/constants";
// utils
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { rtkQueryErrorLogger } from "./middleware";
// reducers
import assessmentReducer from "./reducers/assessment";
import searchReducer from "./reducers/common";
import permissionReducer from "./reducers/permission";
import translationReducer from "./reducers/translationSlice";
import uiReducer from "./reducers/ui";
import userReducer from "./reducers/user";

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  ui: uiReducer,
  user: userReducer,
  searchCommonData: searchReducer,
  translationData: translationReducer,
  assessment: assessmentReducer,
  permissions: permissionReducer,
});

const makeStore = () => {
  // eslint-disable-next-line no-console
  console.error("please remove redux option devTool to set DEV variable!");
  const store = configureStore({
    devTools: true,
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware, rtkQueryErrorLogger),
  });
  return { store };
};

const { store } = makeStore();
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// export const persistor = persistorStore

// actions
export {
  resetUser,
  setCurrentUser,
  setIsLoggedIn,
  setNotification,
} from "./reducers/user";
// store
export default store;
