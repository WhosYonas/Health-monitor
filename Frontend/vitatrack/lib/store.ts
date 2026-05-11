import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/models/redux/userSlice";
import patientReducer from "@/models/redux/patientSlice";
import patientManagementReducer from "@/models/redux/patientManagementSlice";
import alertReducer from "@/models/redux/alertSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      patient: patientReducer,
      patientManagement: patientManagementReducer,
      alerts: alertReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
