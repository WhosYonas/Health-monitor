import { createAsyncThunk } from "@reduxjs/toolkit";

type RootState = { user: { token?: string | null } };

type Patient = {
  patient_id: number;
  person: {
    first_name: string;
    last_name: string;
    phone_number: string | null;
    personnummer: string;
  };
};

const fetchMyPatients = async (token: string | null): Promise<Patient[]> => {
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch("/api/patients/", {
    method: "GET",
    headers,
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw { status: response.status, detail: data.detail };
  return data;
};

export const getMyPatientsThunk = createAsyncThunk<
  Patient[],
  void,
  { rejectValue: string }
>("patientManagement/getMyPatientsThunk", async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState() as RootState;
    const token = state.user.token;
    console.log("token in getMyPatientsThunk:", token); // 👈
    if (!token) return thunkAPI.rejectWithValue("Not authenticated");
    return await fetchMyPatients(token);
  } catch (error: any) {
    return thunkAPI.rejectWithValue("Failed to fetch patients");
  }
});
