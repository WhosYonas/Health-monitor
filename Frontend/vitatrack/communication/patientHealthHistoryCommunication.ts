import { createAsyncThunk } from "@reduxjs/toolkit";

type HealthHistoryPayload = {
  person_number: string;
};

export type MeasurementPoint = {
  recorded_at: string;
  heart_rate: number | null;
  temperature: number | null;
  blood_oxygen: number | null;
};

const fetchPatientHealthHistory = async (payload: HealthHistoryPayload) => {
  const response = await fetch("/api/health/health_history", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      detail: data.detail,
    };
  }

  return data as MeasurementPoint[];
};

export const fetchPatientHealthHistoryThunk = createAsyncThunk<
  MeasurementPoint[],
  HealthHistoryPayload,
  { rejectValue: string }
>("health/health_history", async (payload, thunkAPI) => {
  try {
    return await fetchPatientHealthHistory(payload);
  } catch (error: any) {
    if (error.status === 404)
      return thunkAPI.rejectWithValue("Patient not found");
    if (error.status === 500) return thunkAPI.rejectWithValue("Server error");
    return thunkAPI.rejectWithValue("Unknown error");
  }
});
