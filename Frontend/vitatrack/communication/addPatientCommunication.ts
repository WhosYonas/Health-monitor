import { createAsyncThunk } from "@reduxjs/toolkit";
type RootState = { user: { token?: string | null } };
type patientPayload = {
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  personnummer: string | null;
  relative_fullname: string | null;
  relative_phone_number: string | null;
  critical_level: number | null;
  password: string | null;
};

type addPatientResponse = {
  response_message: string | null;
};

const postAddPatient = async (payload: patientPayload) => {
  const response = await fetch("/api/users/register/patient", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
    redirect: "manual",
  });
  const data = await response.json();
  if (!response.ok) throw { status: response.status, detail: data.detail };
  return data;
};

const assignPatientToCaregiver = async (patientId: number, token: string) => {
  const response = await fetch(`/api/patients/${patientId}/assign`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });
  if (!response.ok) {
    const data = await response.json();
    throw { status: response.status, detail: data.detail };
  }
};

export const postAddPatientThunk = createAsyncThunk<
  addPatientResponse,
  patientPayload,
  { rejectValue: string }
>("patientManagement/postAddPatientThunk", async (payload, thunkAPI) => {
  try {
    const state = thunkAPI.getState() as RootState;
    const token = state.user.token;

    if (!token) return thunkAPI.rejectWithValue("Not authenticated");

    const data = await postAddPatient(payload);
    console.log("created patient: ", data);
    await assignPatientToCaregiver(data.patient_id, token);
    return data.response_message as addPatientResponse;
  } catch (error: any) {
    if (error.status === 409) {
      return thunkAPI.rejectWithValue(
        "Patient with this person number already exists",
      );
    }
    return thunkAPI.rejectWithValue("Unknown error");
  }
});
