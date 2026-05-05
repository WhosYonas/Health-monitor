import { createSlice } from "@reduxjs/toolkit";
import { postLoginThunk } from "@/communication/loginCommunication";
import { getUserInfoThunk } from "@/communication/userInfoCommunicaton";
import { postPatientLoginThunk } from "@/communication/patientLoginCommunication";

interface userProfile {
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  personnummer: string | null;
  role: "patient" | "caregiver" | null;
}

interface userState {
  user: userProfile | null;
  is_authenticated: boolean;
  loading: boolean;
  login_error_message: string | null;
  profile_error_message: string | null;
}

const initialState: userState = {
  user: null,
  is_authenticated: false,
  loading: false,
  login_error_message: null,
  profile_error_message: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postLoginThunk.pending, (state) => {
        state.loading = true;
        state.login_error_message = null;
      })
      .addCase(postLoginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.is_authenticated = true;
        state.user = action.payload;
        state.login_error_message = null;
      })
      .addCase(postLoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.login_error_message =
          action.payload ?? action.error.message ?? "Unknown error";
      })
      .addCase(getUserInfoThunk.pending, (state) => {
        state.loading = true;
        state.profile_error_message = null;
        console.log("Loading user info...");
      })
      .addCase(getUserInfoThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.is_authenticated = true;
        state.user = action.payload;
        state.profile_error_message = null;
        console.log("User info loaded successfully");
      })
      .addCase(getUserInfoThunk.rejected, (state, action) => {
        state.loading = false;
        state.is_authenticated = false;
        state.user = null;
        state.profile_error_message =
          action.payload?.message ?? action.error.message ?? "Unknown error";
        console.log("Failed to load user info:", state.profile_error_message);
      })
      .addCase(postPatientLoginThunk.pending, (state) => {
        state.loading = true;
        state.login_error_message = null;
      })
      .addCase(postPatientLoginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.is_authenticated = true;
        state.user = action.payload;
        state.login_error_message = null;
      })
      .addCase(postPatientLoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.login_error_message =
          action.payload ?? action.error.message ?? "Unknown error";
      });
  },
});

export default userSlice.reducer;
