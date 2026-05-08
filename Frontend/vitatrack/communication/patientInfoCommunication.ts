import { createAsyncThunk } from "@reduxjs/toolkit";

type patientPayload = {
  person_id: number;
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

const postGetPatientInfo = async (payload: patientPayload) => {
  const response = await fetch(
    `/api/patients/get_patient_info/${payload.person_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      redirect: "manual",
    },
  );

  const data = await response.json();
  if (!response.ok) {
    const errorData = data as { detail?: string };

    throw {
      status: response.status,
      detail: errorData.detail || "Uknown error",
    };
  }

  return data as ApiPatientResponse;
};

export const postGetPatientInfoThunk = createAsyncThunk<
  patientResponse,
  patientPayload,
  { rejectValue: string }
>("patient/postGetPatientInfoThunk", async (payload, thunkAPI) => {
  try {
    const data = await postGetPatientInfo(payload);
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
