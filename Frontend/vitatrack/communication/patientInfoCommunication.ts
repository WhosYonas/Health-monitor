import { createAsyncThunk } from "@reduxjs/toolkit";

type patientPayload = {
  person_number: string;
};

type patientResponse = {
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  person_number: string | null;
  relative_fullname: string | null;
  relative_phone_number: string | null;
  critical_level: number | null;
};

const postGetPatientInfo = async (payload: patientPayload) => {
  const response = await fetch(`/api/patient_info`, {
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

export const postGetPatientInfoThunk = createAsyncThunk<
  patientResponse,
  patientPayload,
  { rejectValue: string }
>("patient/postGetPatientInfoThunk", async (payload, thunkAPI) => {
  try {
    const data = await postGetPatientInfo(payload);
    const patientInfo = data.patient_info as patientResponse;

    return patientInfo;
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
