import { createSlice } from "@reduxjs/toolkit";
import { postGetPatientInfoThunk } from "@/communication/patientInfoCommunication";
import { postGetPatientHealthDataThunk } from "@/communication/patientHealthDataCommunication";
import { postPatientLoginThunk } from "@/communication/patientLoginCommunication";
import { postDeletePatientThunk } from "@/communication/patientDeleteCommunication";
import {
  fetchPatientHealthHistoryThunk,
  MeasurementPoint,
} from "@/communication/patientHealthHistoryCommunication";

interface patientHealthData {
  pulse: number | null;
  body_temperature: number | null;
  blood_oxygen_level: number | null;
}

interface patientInformation {
  patient_id: number | null;
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
  health_history: MeasurementPoint[];
  historyLoading: boolean;
  history_error_message: string | null;
}

const initialState: patientState = {
  patient_info: null,
  health_data: null,
  infoLoading: false,
  info_error_message: null,
  healthLoading: false,
  health_error_message: null,
  health_history: [],
  historyLoading: false,
  history_error_message: null,
};

export const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    clearHealthData: (state) => {
      state.health_data = null;
      state.health_history = [];
      state.healthLoading = false;
      state.historyLoading = false;
    },
  },
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
    builder.addCase(postPatientLoginThunk.pending, (state) => {
      state.infoLoading = true;
      state.health_error_message = null;
    });
    builder.addCase(postPatientLoginThunk.fulfilled, (state, action) => {
      state.infoLoading = false;
      state.patient_info = action.payload;
      state.health_error_message = null;
    });
    builder.addCase(postPatientLoginThunk.rejected, (state, action) => {
      state.infoLoading = false;
      state.health_error_message =
        action.payload ?? action.error.message ?? "Unknown error";
    });
    builder.addCase(postDeletePatientThunk.pending, (state) => {
      state.infoLoading = true;
      state.info_error_message = null;
    });
    builder.addCase(postDeletePatientThunk.fulfilled, (state) => {
      state.patient_info = null;
      state.health_data = null;
      state.infoLoading = false;
    });
    builder.addCase(postDeletePatientThunk.rejected, (state, action) => {
      state.info_error_message = action.payload as string;
      state.infoLoading = false;
    });
    builder.addCase(fetchPatientHealthHistoryThunk.pending, (state) => {
      state.historyLoading = true;
      state.history_error_message = null;
    });
    builder.addCase(
      fetchPatientHealthHistoryThunk.fulfilled,
      (state, action) => {
        state.health_history = action.payload;
        state.historyLoading = false;
      },
    );
    builder.addCase(
      fetchPatientHealthHistoryThunk.rejected,
      (state, action) => {
        state.history_error_message = action.payload as string;
        state.historyLoading = false;
      },
    );
  },
});

export default patientSlice.reducer;
export const { clearHealthData } = patientSlice.actions;
