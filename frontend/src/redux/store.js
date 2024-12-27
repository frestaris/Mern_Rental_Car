import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import vehiclesReducer from "./slices/vehicleSlice";
import bookingReducer from "./slices/bookingSlice";
import { combineReducers } from "redux";

// Configure persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "booking"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  vehicles: vehiclesReducer,
  booking: bookingReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
