import { createSlice } from "@reduxjs/toolkit";

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
});

export default userSlice.reducer;
