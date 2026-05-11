import { createAsyncThunk } from "@reduxjs/toolkit";

type loginPayload = {
  identifier: string;
  password: string;
};

interface ApiLoginResponse {
  access_token: string;
  role: string;
  user: {
    patient_id: number;
    person: {
      first_name: string;
      last_name: string;
      phone_number: string;
      personnummer: string;
    };
    critical_level: number;
    relatives: {
      full_name: string;
      phone_number: string;
    }[];
  };
}

export type LoginResponse = {
  patient_id: number;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  person_number: string | null;
  relative_fullname: string | null;
  relative_phone_number: string | null;
  critical_level: number | null;
};

const postLogin = async (payload: loginPayload) => {
  const formData = new URLSearchParams();
  formData.append("username", payload.identifier);
  formData.append("password", payload.password);
  formData.append("username", payload.identifier);
  console.log("sending person_number:", payload.identifier);

  const response = await fetch(`/api/users/login/patient`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
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
  return data as ApiLoginResponse;
};

export const postPatientLoginThunk = createAsyncThunk<
  LoginResponse,
  loginPayload,
  { rejectValue: string }
>("user/postPatientLoginThunk", async (payload, thunkAPI) => {
  try {
    const data: ApiLoginResponse = await postLogin(payload);
    const user = data.user;
    const firstRelative = user.relatives.length > 0 ? user.relatives[0] : null;
    return {
      patient_id: user.patient_id,
      first_name: user.person.first_name,
      last_name: user.person.last_name,
      phone_number: user.person.phone_number,
      person_number: user.person.personnummer,
      critical_level: user.critical_level,
      relative_fullname: firstRelative ? firstRelative.full_name : null,
      relative_phone_number: firstRelative ? firstRelative.phone_number : null,
    };
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
