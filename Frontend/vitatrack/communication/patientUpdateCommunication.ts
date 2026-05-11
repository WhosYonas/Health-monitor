import { createAsyncThunk } from "@reduxjs/toolkit";

type patientUpdatePayload = {
  patient_id: number;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  personnummer: string | null;
  critical_level: number | null;
  relative_fullname: string | null;
  relative_phone_number: string | null;
};

interface ApiPatientResponse {
  patient_id: number;
  person: {
    person_id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    personnummer: string;
  };
  role: string;
  critical_level: number;
  relatives: {
    full_name: string;
    phone_number: string;
    relative_id: number;
    patient_id: number;
  }[];
}

type patientResponse = {
  patient_id: number;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  person_number: string | null;
  relative_fullname: string | null;
  relative_phone_number: string | null;
  critical_level: number | null;
};

const postUpdatePatient = async (payload: patientUpdatePayload) => {
  const body = {
    first_name: payload.first_name,
    last_name: payload.last_name,
    phone_number: payload.phone_number,
    personnummer: payload.personnummer,
    critical_level: payload.critical_level,
    relative_fullname: payload.relative_fullname,
    relative_phone_number: payload.relative_phone_number,
  };

  const response = await fetch(`/api/users/patient/${payload.patient_id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    redirect: "manual",
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    const errorData = data as { detail?: string };

    throw {
      status: response.status,
      detail: errorData.detail || "Unknown error",
    };
  }

  return data as ApiPatientResponse;
};

export const postUpdatePatientThunk = createAsyncThunk<
  patientResponse,
  patientUpdatePayload,
  { rejectValue: string }
>("patient/postUpdatePatientThunk", async (payload, thunkAPI) => {
  try {
    const data = await postUpdatePatient(payload);
    const primaryRelative =
      data.relatives.length > 0 ? data.relatives[0] : null;

    const mappedPatient: patientResponse = {
      patient_id: data.patient_id,
      first_name: data.person.first_name,
      last_name: data.person.last_name,
      phone_number: data.person.phone_number,
      person_number: data.person.personnummer,
      critical_level: data.critical_level,
      relative_fullname: primaryRelative ? primaryRelative.full_name : null,
      relative_phone_number: primaryRelative
        ? primaryRelative.phone_number
        : null,
    };

    return mappedPatient;
  } catch (error: any) {
    if (error.status === 403) {
      return thunkAPI.rejectWithValue("Only caregivers can update patients");
    }
    if (error.status === 404) {
      return thunkAPI.rejectWithValue("Patient not found");
    }
    if (error.status === 500) {
      return thunkAPI.rejectWithValue(
        "Something went wrong when connecting to the server, try again later",
      );
    }
    return thunkAPI.rejectWithValue("Unknown error");
  }
});
