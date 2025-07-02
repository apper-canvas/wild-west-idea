import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  devTools: typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__,
});

export default store;