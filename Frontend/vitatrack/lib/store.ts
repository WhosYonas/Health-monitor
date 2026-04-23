import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/models/redux/userSlice";
import patientReducer from "@/models/redux/patientSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      patient: patientReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
