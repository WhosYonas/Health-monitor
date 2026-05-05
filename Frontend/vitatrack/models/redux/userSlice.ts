import { createSlice } from "@reduxjs/toolkit";
import { postLoginThunk } from "@/communication/loginCommunication";

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
  error_message: string | null;
}

const initialState: userState = {
  user: null,
  is_authenticated: false,
  loading: false,
  error_message: null,
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
