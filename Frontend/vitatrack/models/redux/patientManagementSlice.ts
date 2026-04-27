import { createSlice } from "@reduxjs/toolkit";
import { postAddPatientThunk } from "@/communication/addPatientCommunication";

interface PatientManagementState {
  addLoading: boolean;
  addSuccess: boolean;
  addError: string | null;
}

const initialState: PatientManagementState = {
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
