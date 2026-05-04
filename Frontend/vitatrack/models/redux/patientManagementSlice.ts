import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { postAddPatientThunk } from "@/communication/addPatientCommunication";
//import the thunks Remove this line when when you added the imports for the placeholder reducers at the bottom 

interface PatientHealthData {
  pulse: number | null;
  body_temperature: number | null;
  blood_oxygen_level: number | null;
}

interface PatientInformation {
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

export interface ManagedPatientItem {
  patient_info: PatientInformation;
  health_data: PatientHealthData;
}

interface PatientManagementState {
  patients: ManagedPatientItem[];

  getPatinetsLoading: boolean;
  getPatientsError: string | null;

  addLoading: boolean;
  addSuccess: boolean;
  addError: string | null;

  updateLoading: boolean;
  updateSuccess: boolean;
  updateError: string | null;

  deleteLoading: boolean;
  deleteSuccess: boolean;
  deleteError: string | null;
}

const initialState: PatientManagementState = {
  patients: [],
  getPatinetsLoading: false,
  getPatientsError: null,

  addLoading: false,
  addSuccess: false,
  addError: null,

  updateLoading: false,
  updateSuccess: false,
  updateError: null,

  deleteLoading: false,
  deleteSuccess: false,
  deleteError: null,
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

    resetUpdateState: (state) => {
      state.updateSuccess = false;
      state.updateLoading = false;
      state.updateError = null;
    },

    resetDeleteState: (state) => {
      state.deleteSuccess = false;
      state.deleteLoading = false;
      state.deleteError = null;
    },

    clearPatientManagementState: (state) => {
      state.patients = [];

      state.getPatinetsLoading = false;
      state.getPatientsError = null;

      state.addSuccess = false;
      state.addLoading = false;
      state.addError = null;

      state.updateSuccess = false;
      state.updateLoading = false;
      state.updateError = null;

      state.deleteSuccess = false;
      state.deleteLoading = false;
      state.deleteError = null;
    },
    addPatientToList: (state, action: PayloadAction<ManagedPatientItem>) => {
      state.patients.unshift(action.payload);
    },

    updatePatientInList: (
      state,
      action: PayloadAction<{
        id: string;
        changes: Partial<ManagedPatientItem>;
      }>,
    ) => {
      const { id, changes } = action.payload;
      const patientIndex = state.patients.findIndex((patient) => {
        patient.patient_info.id == id;
      });
      if (patientIndex != -1) {
        state.patients[patientIndex] = {
          ...state.patients[patientIndex],
          ...changes,
        };
      }
    },

    removePatientFromList: (state, action: PayloadAction<string>) => {
      state.patients = state.patients.filter((patient) => {
        patient.patient_info.id !== action.payload;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(postAddPatientThunk.pending, (state) => {
      state.addLoading = true;
      state.addError = null;
      state.addSuccess = false;
    });
    builder.addCase(postAddPatientThunk.fulfilled, (state, action) => {
      state.addLoading = false;
      state.addSuccess = true;

      //Dubbelkolla om thunk returnerar patient och om ja so ska patienten placeras i början av patinet listan enligt nedan
      if (action.payload) {
        state.patients.unshift(action.payload as ManagedPatientItem);
      }
    });
    builder.addCase(postAddPatientThunk.rejected, (state, action) => {
      state.addLoading = false;
      state.addError = action.payload as string;
    });

    {
      /* Placeholder for the thunks that will be written in the communication later, Dubbelcheck naming and imports later */
    }
    builder.addCase(postGetAllPatientsThunk.pending, (state) => {
      state.getPatinetsLoading = true;
      state.getPatientsError = null;
    });
    builder.addCase(postGetAllPatientsThunk.fullfilled, (state, action) => {
      state.patients = action.payload;
      state.getPatinetsLoading = false;
    });
    builder.addCase(postGetAllPatientsThunk.rejected, (state, action) => {
      state.getPatinetsLoading = false;
      state.getPatientsError = action.payload as string;
    });

    {
      /* Updating patient */
    }
    builder.addCase(postUpdatePatientThunk.pending, (state) => {
      state.updateLoading = true;
      state.updateError = null;
      state.updateSuccess = false;
    });
    builder.addCase(postUpdatePatientThunk.fullfilled, (state, action) => {
      state.updateLoading = false;
      state.updateError = null;
      const updatedPatient = action.payload as ManagedPatientItem;
      const index = state.patients.findIndex((patient) => {
        patient.patient_info.id === updatedPatient.patient_info.id;
      });
      if (index !== -1) {
        state.patients[index] = updatedPatient;
      }
    });
    builder.addCase(postUpdatePatientThunk.rejected, (state, action) => {
      state.updateLoading = true;
      state.updateError = action.payload as string;
    });

    {
      /*Deleting patient */
    }
    builder.addCase(postDeletePatientThunk.pending, (state) => {
      state.deleteLoading = true;
      state.deleteSuccess = false;
      state.deleteError = null;
    });
    builder.addCase(postDeletePatientThunk.fullfilled, (state, action) => {
      state.deleteSuccess = true;
      state.deleteLoading = false;
      state.patients = state.patients.filter((patient) => {
        patient.patient_info.id !== action.payload;
      });
    });
    builder.addCase(postDeletePatientThunk.rejected, (state, action) => {
      state.deleteLoading = false;
      state.deleteError = action.payload as string;
    });
  },
});

export const {
  resetAddState,
  resetUpdateState,
  resetDeleteState,
  clearPatientManagementState,
  addPatientToList,
  updatePatientInList,
  removePatientFromList,
} = patientManagementSlice.actions;

export default patientManagementSlice.reducer;
