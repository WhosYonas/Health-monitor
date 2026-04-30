import { createSlice } from "@reduxjs/toolkit";
import { postAddPatientThunk } from "@/communication/addPatientCommunication";

interface PatientHealthData {
  pulse: number | null;
  body_temperature: number | null;
  blood_oxygen_level: number | null;
}

interface PatientOverviewItem {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  person_number: string | null;
  relative_fullname: string | null;
  relative_phone_number: string | null;
  critical_level: number | null;
  health_data?: PatientHealthData | null;
}

interface PatientManagementState {
  patients: PatientOverviewItem[]

  listLoading: boolean,
  listError: string | null,

  addLoading: boolean;
  addSuccess: boolean;
  addError: string | null;
}



const initialState: PatientManagementState = {
  patients: [],
  listLoading: false,
  listError: null,

  addLoading: false,
  addSuccess: false,
  addError: null,
};

export const patientManagementSlice = createSlice({
  name: "patientManagement",
  initialState,
  reducers: {
    resetAddState: (state) => {
      state.addLoading = false;
      state.addSuccess = false;
      state.addError = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(postAddPatientThunk.pending, (state) => {
      state.addLoading = true;
      state.addError = null;
      state.addSuccess = false;
    });
    builder.addCase(postAddPatientThunk.fulfilled, (state) => {
      state.addLoading = false;
      state.addSuccess = true;
    });
    builder.addCase(postAddPatientThunk.rejected, (state, action) => {
      state.addLoading = false;
      state.addError = action.payload as string;
    });
  },
});

export const { resetAddState } = patientManagementSlice.actions;

export default patientManagementSlice.reducer;
