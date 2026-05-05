import { createAsyncThunk } from "@reduxjs/toolkit";

type Patient = {
  patient_id: number;
  person: {
    first_name: string;
    last_name: string;
    phone_number: string | null;
    personnummer: string;
  };
};

const fetchMyPatients = async (): Promise<Patient[]> => {
  const response = await fetch("/api/patients/", {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json();
  console.log(data);
  if (!response.ok) throw { status: response.status, detail: data.detail };
  return data;
};

export const getMyPatientsThunk = createAsyncThunk<
  Patient[],
  void,
  { rejectValue: string }
>("patientManagement/getMyPatientsThunk", async (_, thunkAPI) => {
  try {
    return await fetchMyPatients();
  } catch (error: any) {
    return thunkAPI.rejectWithValue("Failed to fetch patients");
  }
});
