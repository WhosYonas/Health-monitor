import { createAsyncThunk } from "@reduxjs/toolkit";

type LogoutResponse = {
  response_message: string;
};
const postLogout = async () => {
  const response = await fetch(`/api/users/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "",
    credentials: "include",
    redirect: "manual",
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

export const postLogoutThunk = createAsyncThunk<
  LogoutResponse,
  void,
  { rejectValue: string }
>("user/postLogoutThunk", async (payload, thunkAPI) => {
  try {
    const data = await postLogout();
    const response_message: LogoutResponse = {
      response_message: data.response_message,
    };
    return response_message;
  } catch (error: any) {
    if (error.status === 404) {
      return thunkAPI.rejectWithValue("Endpoint not found");
    }
    if (error.status === 500) {
      return thunkAPI.rejectWithValue(
        "Something went wrong when connecting to the server, try again later",
      );
    }
    return thunkAPI.rejectWithValue("Unknown error");
  }
});
