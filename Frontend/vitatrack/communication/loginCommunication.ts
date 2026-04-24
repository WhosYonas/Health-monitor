import { createAsyncThunk } from "@reduxjs/toolkit";

type loginPayload = {
  identifier: string;
  password: string;
};

type LoginResponse = {
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  person_number: string | null;
  role: "patient" | "caregiver" | null;
};

const postLogin = async (payload: loginPayload) => {
  const response = await fetch(`/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
    redirect: "manual",
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

export const postLoginThunk = createAsyncThunk<
  LoginResponse,
  loginPayload,
  { rejectValue: string }
>("user/postLoginThunk", async (payload, thunkAPI) => {
  try {
    const data = await postLogin(payload);
    const userInfo = data.user?.metadata as LoginResponse;

    return userInfo;
  } catch (error: any) {
    if (error.status === 401) {
      return thunkAPI.rejectWithValue("Incorrect identifier or password");
    }
    if (error.status === 500) {
      return thunkAPI.rejectWithValue(
        "Something went wrong when connecting to the server, try again later",
      );
    }
    return thunkAPI.rejectWithValue("Unknown error");
  }
});
