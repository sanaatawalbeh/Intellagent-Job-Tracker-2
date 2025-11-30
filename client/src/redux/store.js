// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import applicationsReducer from "./applicationsSlice";
import themeReducer from "./themeSlice";
import userReducer from "./userSlice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, applicationsReducer);

export const store = configureStore({
  reducer: {
    applications: persistedReducer,
    theme: themeReducer,
    user: userReducer,
  },
});

export const persistor = persistStore(store);
