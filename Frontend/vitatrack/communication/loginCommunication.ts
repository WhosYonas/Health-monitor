import { createAsyncThunk } from "@reduxjs/toolkit";

type loginPayload = {
  identifier: string;
  password: string;
};

type LoginResponse = {
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  personnummer: string | null;
  role: "patient" | "caregiver" | null;
};
const postLogin = async (payload: loginPayload) => {
  const formData = new URLSearchParams();
  formData.append("username", payload.identifier);
  formData.append("password", payload.password);
  console.log("sending person_number:", payload.identifier);

  const response = await fetch(`/api/users/login/caregiver`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
    credentials: "include",
    //redirect: "manual",
  });

  console.log("status:", response.status);
  console.log("type:", response.type);

  const data = await response.json();
  console.log("data:", data);

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
    const userInfo: LoginResponse = {
      first_name: data.user.person.first_name,
      last_name: data.user.person.last_name,
      phone_number: data.user.person.phone_number,
      personnummer: data.user.person.person_number,
      role: data.user.role,
    };
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
