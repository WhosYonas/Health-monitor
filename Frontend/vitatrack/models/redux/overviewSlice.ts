import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { postGetOverviewThunk } from "@/communication/overviewCommunication";

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
}

export interface PatientOverviewItem {
  patient_info: PatientInformation;
  health_data: PatientHealthData | null;
}

interface OverviewNotification {
  id: string;
  title: string;
  message: string;
  type: "critical" | "info" | "warning";
  created_at: string | null;
}

interface OverviewTask {
  id: string;
  text: string;
  completed: boolean;
}

interface OverviewStats {
  totalPatients: number;
  criticalAlerts: number;
  pendingTasks: number;
  systemStatus: "stable" | "warning" | "offline";
}

interface OverviewState {
  patients: PatientOverviewItem[];
  notifications: OverviewNotification[];
  tasks: OverviewTask[];
  stats: OverviewStats;

  selectedPatientID: string | null;
  sortMode: "priority" | "name" | "latest";

  loading: boolean;
  error: string | null;
}
const initialOverviewState: OverviewState = {
  patients: [],
  notifications: [],
  tasks: [],
  stats: {
    totalPatients: 0,
    criticalAlerts: 0,
    pendingTasks: 0,
    systemStatus: "stable",
  },

  selectedPatientID: null,
  sortMode: "priority",

  loading: false,
  error: null,
};

export const overviewSlice = createSlice({
  name: "overview",
  initialState: initialOverviewState,
  reducers: {
    setSelectedPatientID: (state, action: PayloadAction<string | null>) => {
      state.selectedPatientID = action.payload;
    },

    setSortMode: (
      state,
      action: PayloadAction<"priority" | "name" | "latest">,
    ) => {
      state.sortMode = action.payload;
    },

    clearOverviewState: (state) => {
      state.patients = [];
      state.notifications = [];
      state.tasks = [];
      state.stats = {
        totalPatients: 0,
        criticalAlerts: 0,
        pendingTasks: 0,
        systemStatus: "stable",
      };
      state.selectedPatientID = null;
      state.sortMode = "priority";
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(postGetOverviewThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(postGetOverviewThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.patients = action.payload.patients;
      state.notifications = action.payload.notifications;
      state.tasks = action.payload.tasks;
      state.stats = action.payload.stats;
    });

    builder.addCase(postGetOverviewThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setSelectedPatientID, setSortMode, clearOverviewState } =
  overviewSlice.actions;

export default overviewSlice.reducer;
