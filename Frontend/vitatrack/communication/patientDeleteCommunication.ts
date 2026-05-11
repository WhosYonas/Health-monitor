import { createAsyncThunk } from "@reduxjs/toolkit";

type patientDeletePayload = {
  patient_id: number;
};

const postDeletePatient = async (payload: patientDeletePayload) => {
  const response = await fetch(`/api/users/patient/${payload.patient_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    redirect: "manual",
  });

  if (response.status === 204) {
    return payload.patient_id;
  }

  const data = await response.json();
  if (!response.ok) {
    const errorData = data as { detail?: string };

    throw {
      status: response.status,
      detail: errorData.detail || "Unknown error",
    };
  }

  return payload.patient_id;
};

export const postDeletePatientThunk = createAsyncThunk<
  number,
  patientDeletePayload,
  { rejectValue: string }
>("patient/postDeletePatientThunk", async (payload, thunkAPI) => {
  try {
    const deletedId = await postDeletePatient(payload);
    return deletedId;
  } catch (error: any) {
    if (error.status === 401) {
      return thunkAPI.rejectWithValue("Not logged in");
    }
    if (error.status === 403) {
      return thunkAPI.rejectWithValue("Only caregivers can delete patients");
    }
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
