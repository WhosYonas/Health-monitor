import { createAsyncThunk } from "@reduxjs/toolkit";

export type Alert = {
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
};

const fetchAlerts = async (): Promise<Alert[]> => {
  const response = await fetch("/api/patients/alerts", {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();
  console.log("Alerts data:", data);

  if (!response.ok) {
    throw { status: response.status, detail: data.detail };
  }

  return data;
};

export const getAlertsThunk = createAsyncThunk<
  Alert[],
  void,
  { rejectValue: string }
>("alerts/getAlertsThunk", async (_, thunkAPI) => {
  try {
    return await fetchAlerts();
  } catch (error: any) {
    const errorMessage = error.detail || "Failed to fetch alerts";
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

const acknowledgeAlert = async (alertId: number): Promise<void> => {
  const response = await fetch(`/api/patients/alerts/${alertId}/acknowledge`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    redirect: "manual",
  });

  if (!response.ok) {
    const data = await response.json();
    throw {
      status: response.status,
      detail: data.detail || "Unknown error",
    };
  }
};

export const acknowledgeAlertThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("alerts/acknowledgeAlertThunk", async (alertId, thunkAPI) => {
  try {
    await acknowledgeAlert(alertId);
    return alertId;
  } catch (error: any) {
    if (error.status === 404)
      return thunkAPI.rejectWithValue("Alert not found");
    return thunkAPI.rejectWithValue("Failed to acknowledge alert");
  }
});
