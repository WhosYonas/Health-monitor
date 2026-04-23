import { createSlice } from "@reduxjs/toolkit";

interface patientHealthData {
  pulse: number | null;
  body_temperature: number | null;
  blood_oxygen_level: number | null;
}

interface patientInformation {
  first_name: string;
  last_name: string;
  phone_number: string;
  person_number: string;
  relative_fullname: string;
  relative_phone_number: string;
  critical_level: number;
}

interface patientState {
  patient_info: patientInformation | null;
  health_data: patientHealthData | null;
  loading: boolean;
  error_message: string | null;
}

const initialState: patientState = {
  patient_info: null,
  health_data: null,
  loading: false,
  error_message: null,
};

export const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default patientSlice.reducer;
