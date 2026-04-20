import { createSlice } from "@reduxjs/toolkit";
import { postLoginThunk } from "@/communication/loginCommunication";

interface userProfile {
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  person_number: string | null;
  relative_fullname: string | null;
  relative_phone_number: string | null;
  critical_level: number | null;
}

interface healthData {
  pulse: number | null;
  body_temperature: number | null;
  blood_oxygen_level: number | null;
}
interface userState {
  user: userProfile | null;
  is_authenticated: boolean;
  loading: boolean;
  error_message: string | null;
  health_data: healthData | null;
}

const initialState: userState = {
  user: null,
  is_authenticated: false,
  loading: false,
  error_message: null,
  health_data: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postLoginThunk.pending, (state) => {
        state.loading = true;
        state.error_message = null;
      })
      .addCase(postLoginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.is_authenticated = true;
        state.user = action.payload;
        state.error_message = null;
      })
      .addCase(postLoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error_message =
          action.payload ?? action.error.message ?? "Unknown error";
      });
  },
});

export default userSlice.reducer;
