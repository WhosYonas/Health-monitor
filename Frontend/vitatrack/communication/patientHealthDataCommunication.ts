import { createAsyncThunk } from "@reduxjs/toolkit";

type patientPayload = {
  person_number: string;
};

type healthDataResponse = {
  pulse: number | null;
  body_temperature: number | null;
  blood_oxygen_level: number | null;
};

const postGetPatientHealthData = async (payload: patientPayload) => {
  const response = await fetch(`/api/patient_health_data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
    redirect: "manual",
  });

  const data = await response.json();
  if (!response.ok) {
    throw {
      status: response.status,
      detail: data.detail,
    };
  }

  return data;
};

export const postGetPatientHealthDataThunk = createAsyncThunk<
  healthDataResponse,
  patientPayload,
  { rejectValue: string }
>("patient/postGetPatientHealthDataThunk", async (payload, thunkAPI) => {
  try {
    const data = await postGetPatientHealthData(payload);
    const healthData = data.health_data as healthDataResponse;

    return healthData;
  } catch (error: any) {
    if (error.status === 404) {
      return thunkAPI.rejectWithValue("Patient not found");
    }
    if (error.status === 500) {
      return thunkAPI.rejectWithValue(
        "Something went wrong when connecting to the server, try again later",
      );
    }
    return thunkAPI.rejectWithValue("Unknown error");
  }
});
