import { createAsyncThunk } from "@reduxjs/toolkit";

interface UserInfoResponse {
  caregiver_id: number;
  username: string;
  person: {
    person_id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    personnummer: string;
  };
}

interface GetInfoError {
  message: string;
  errors?: { [key: string]: string };
}

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  personnummer: string | null;
  role: "patient" | "caregiver" | null;
}

const getUserInfo = async (): Promise<UserInfoResponse> => {
  const response = await fetch("/api/users/me/caregiver", {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) {
    throw {
      status: response.status,
      detail: data.detail,
    };
  }
  return data;
};

export const getUserInfoThunk = createAsyncThunk<
  UserProfile,
  void,
  { rejectValue: GetInfoError }
>("user/getUserInfo", async (_, thunkAPI) => {
  try {
    const data = await getUserInfo();
    return {
      first_name: data.person.first_name,
      last_name: data.person.last_name,
      phone_number: data.person.phone_number,
      personnummer: data.person.personnummer,
      role: "caregiver",
    };
  } catch (error: any) {
    if (error.status === 404) {
      return thunkAPI.rejectWithValue({ message: error.detail });
    }
    return thunkAPI.rejectWithValue({
      message: "Something went wrong, try again later",
    });
  }
});
