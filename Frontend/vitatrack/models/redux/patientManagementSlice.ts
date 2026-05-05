import { createSlice } from "@reduxjs/toolkit";
import { postAddPatientThunk } from "@/communication/addPatientCommunication";
import { getMyPatientsThunk } from "@/communication/getPatientsCommunication";
import { toast } from "sonner";

type Patient = {
  patient_id: number;
  person: {
    first_name: string;
    last_name: string;
    phone_number: string | null;
    personnummer: string;
  };
};

interface PatientManagementState {
  addLoading: boolean;
  addSuccess: boolean;
  addError: string | null;
  patients: Patient[];
  patientsLoading: boolean;
  patientsError: string | null;
}

const initialState: PatientManagementState = {
  addLoading: false,
  addSuccess: false,
  addError: null,
  patients: [],
  patientsLoading: false,
  patientsError: null,
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
    builder.addCase(getMyPatientsThunk.pending, (state) => {
      state.patientsLoading = true;
      state.patientsError = null;
    });
    builder.addCase(getMyPatientsThunk.fulfilled, (state, action) => {
      state.patientsLoading = false;
      state.patients = action.payload;
    });
    builder.addCase(getMyPatientsThunk.rejected, (state, action) => {
      state.patientsLoading = false;
      state.patientsError = action.payload as string;
    });
  },
});

export const { resetAddState } = patientManagementSlice.actions;
export default patientManagementSlice.reducer;
