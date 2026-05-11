import { createSlice } from "@reduxjs/toolkit";
import { getAlertsThunk } from "@/communication/getAlertsCommunication";

export interface Alert {
  alert_id: number;
  measurement_id: number;
  patient_id: number;
  alert_type: "heart_rate" | "blood_oxygen" | "temperature";
  severity: "warning" | "critical";
  message: string;
  triggered_at: string;
  acknowledged: boolean;
  notified: boolean;
  acknowledged_by: number | null;
  first_name: string;
  last_name: string;
  personnummer: string;
}

interface AlertState {
  items: Alert[];
  alert_loading: boolean;
  error_message: string | null;
}

const initialState: AlertState = {
  items: [],
  alert_loading: false,
  error_message: null,
};

export const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    clearAlerts: (state) => {
      state.items = [];
      state.error_message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAlertsThunk.pending, (state) => {
        state.alert_loading = true;
        state.error_message = null;
      })
      .addCase(getAlertsThunk.fulfilled, (state, action) => {
        state.alert_loading = false;
        state.items = action.payload;
        state.error_message = null;
      })
      .addCase(getAlertsThunk.rejected, (state, action) => {
        state.alert_loading = false;
        state.error_message =
          (action.payload as string) ??
          action.error.message ??
          "Failed to fetch alerts";
      });
  },
});

export const { clearAlerts } = alertsSlice.actions;
export default alertsSlice.reducer;
