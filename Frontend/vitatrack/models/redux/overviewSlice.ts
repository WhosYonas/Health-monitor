import {createSlice} from '@reduxjs/toolkit';


interface PatientHealthData {
  pulse: number | null;
  body_temperature: number | null;
  blood_oxygen_level: number | null;
}

interface PatientInformation {
  id: string; // dubbelcheck with the database attributes 
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  person_number: string | null;
  relative_fullname: string | null;
  relative_phone_number: string | null;
  critical_level: number | null;
}

/

interface OverviewState {
  patients: PatinetOverviewItem[];
  loading: boolean;
  error: string | null;
  selectedPatientID: null;

}

const initialOverviewState: OverviewState={
  patients: [],
  loading: false,
  error: null,
  selectedPatientID: null,



}
export const patinetsOverviewSlice = createSlice({
    name: "overview",
    initialOverviewState,
    reducers: {},
    extraReducers: (builder)=> {

    }


});