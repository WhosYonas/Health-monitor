import { createAsyncThunk } from "@reduxjs/toolkit";

type patientPayload = {
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  person_number: string | null;
  relative_fullname: string | null;
  relative_phone_number: string | null;
  critical_level: number | null;
  password: string | null;
};

type addPatientResponse = {
  response_message: string | null;
};

const postAddPatient = async (payload: patientPayload) => {
  const response = await fetch("http://127.0.0.1:8000/register/patient", {
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

export const postAddPatientThunk = createAsyncThunk<
  addPatientResponse,
  patientPayload,
  { rejectValue: string }
>("patientManagement/postAddPatientThunk", async (payload, thunkAPI) => {
  try {
    const data = await postAddPatient(payload);
    const response_message = data.response_message as addPatientResponse;

    return response_message;
  } catch (error: any) {
    if (error.status === 409) {
      return thunkAPI.rejectWithValue(
        "Patient with this person number already exists",
      );
    }

    return thunkAPI.rejectWithValue("Unknown error");
  }
});
