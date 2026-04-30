"use client";

import { AddPatientPage } from "@/views/addPatientPage";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store";
import { postAddPatientThunk } from "@/communication/addPatientCommunication";

export function AddPatientPagePresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const { addLoading, addSuccess, addError } = useSelector(
    (state: RootState) => state.patientManagement,
  );

  async function handleAddPatient(patientInfo: {
    first_name: string | null;
    last_name: string | null;
    phone_number: string | null;
    person_number: string | null;
    relative_fullname: string | null;
    relative_phone_number: string | null;
    critical_level: number | null;
  }) {
    try {
      await dispatch(
        postAddPatientThunk({
          first_name: patientInfo.first_name,
          last_name: patientInfo.last_name,
          phone_number: patientInfo.phone_number,
          person_number: patientInfo.person_number,
          relative_fullname: patientInfo.relative_fullname,
          relative_phone_number: patientInfo.relative_phone_number,
          critical_level: patientInfo.critical_level,
        }),
      ).unwrap();
      console.log("Patient added successfully");
    } catch (error) {
      console.log("Add patient failed", error);
      console.log("Patient info", patientInfo);
    }
  }

  return (
    <AddPatientPage
      addLoading={addLoading}
      addSuccess={addSuccess}
      addError={addError}
      onAddPatient={handleAddPatient}
    />
  );
}
