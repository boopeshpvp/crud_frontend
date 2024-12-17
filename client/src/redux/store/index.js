import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";
import storage from "redux-persist/lib/storage";
import constantSlice from "../slice";
import { thunk } from "redux-thunk";

const encryptor = encryptTransform({
  secretKey: "root-key",
  onerror: (error) => {
    console.log("error", error);
  },
});

const persistConfig = {
  key: "root",
  storage,
  transforms: [encryptor],
};

const persistedReducer = persistReducer(persistConfig, constantSlice);

const store = configureStore({
  reducer: persistedReducer,
  middleware: () => [thunk],
  devTools: true,
});

export const persistor = persistStore(store);

export default store;
