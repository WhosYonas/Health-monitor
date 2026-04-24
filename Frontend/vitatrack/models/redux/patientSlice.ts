import { createSlice } from "@reduxjs/toolkit";
import { postGetPatientInfoThunk } from "@/communication/patientInfoCommunication";
import { postGetPatientHealthDataThunk } from "@/communication/patientHealthDataCommunication";

interface patientHealthData {
  pulse: number | null;
  body_temperature: number | null;
  blood_oxygen_level: number | null;
}

interface patientInformation {
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  person_number: string | null;
  relative_fullname: string | null;
  relative_phone_number: string | null;
  critical_level: number | null;
}

interface patientState {
  patient_info: patientInformation | null;
  health_data: patientHealthData | null;
  infoLoading: boolean;
  healthLoading: boolean;
  info_error_message: string | null;
  health_error_message: string | null;
}

const initialState: patientState = {
  patient_info: null,
  health_data: null,
  infoLoading: false,
  info_error_message: null,
  healthLoading: false,
  health_error_message: null,
};

export const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(postGetPatientInfoThunk.pending, (state) => {
      state.infoLoading = true;
      state.info_error_message = null;
    });
    builder.addCase(postGetPatientInfoThunk.fulfilled, (state, action) => {
      state.patient_info = action.payload;
      state.infoLoading = false;
    });
    builder.addCase(postGetPatientInfoThunk.rejected, (state, action) => {
      state.info_error_message = action.payload as string;
      state.infoLoading = false;
    });
    builder.addCase(postGetPatientHealthDataThunk.pending, (state) => {
      state.healthLoading = true;
      state.health_error_message = null;
    });
    builder.addCase(
      postGetPatientHealthDataThunk.fulfilled,
      (state, action) => {
        state.health_data = action.payload;
        state.healthLoading = false;
      },
    );
    builder.addCase(postGetPatientHealthDataThunk.rejected, (state, action) => {
      state.health_error_message = action.payload as string;
      state.healthLoading = false;
    });
  },
});

export default patientSlice.reducer;
