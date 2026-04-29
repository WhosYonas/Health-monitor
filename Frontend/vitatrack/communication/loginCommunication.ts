import { createAsyncThunk } from "@reduxjs/toolkit";

interface LoginPayload {
  personnummer: string;
  password: string;
  role: "caregiver" | "patient";
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  role: "caregiver" | "patient";
  first_name: string;
  last_name: string;
  phone_number: string | null;
  person_number: string;
}

const postLogin = async (payload: LoginPayload) => {
  const formData = new URLSearchParams();
  formData.append("username", payload.personnummer);
  formData.append("password", payload.password);

  console.log("[LOGIN] Sending request:", {
    url: `/api/users/login/${payload.role}`,
    username: payload.personnummer,
    password: payload.password,
    body: formData.toString(),
  });

  const response = await fetch(`/api/users/login/${payload.role}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
    credentials: "include",
    redirect: "manual",
  });

  const data = await response.json();

  console.log("[LOGIN] Response:", {
    status: response.status,
    ok: response.ok,
    data,
  });

  if (!response.ok) {
    throw { status: response.status, detail: data.detail };
  }
  return data;
};

export const postLoginThunk = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: string }
>("user/postLoginThunk", async (payload, thunkAPI) => {
  console.log("[THUNK] Payload received:", payload);
  try {
    const data = await postLogin(payload);
    console.log("[THUNK] Login successful:", data);
    return data as LoginResponse;
  } catch (error: any) {
    console.log("[THUNK] Login failed:", error);
    if (error.status === 401) {
      return thunkAPI.rejectWithValue("Incorrect personnummer or password.");
    }
    if (error.status === 500) {
      return thunkAPI.rejectWithValue(
        "Something went wrong when connecting to the server, try again later.",
      );
    }
    return thunkAPI.rejectWithValue("Unknown error.");
  }
});
