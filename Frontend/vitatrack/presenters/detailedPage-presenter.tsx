"use client";

import { DetailedPage } from "../views/detailedPage";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { useEffect } from "react";

import { postGetPatientHealthDataThunk } from "@/communication/patientHealthDataCommunication";

export function DetailedPagePresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const patient = useSelector((state: RootState) => state.patient);
  const personNumber = useSelector(
    (state: RootState) => patient.patient_info?.person_number,
  );
  const firstName = useSelector(
    (state: RootState) => patient.patient_info?.first_name,
  );
  const lastName = useSelector(
    (state: RootState) => patient.patient_info?.last_name,
  );
  const role = useSelector((state: RootState) => state.user.user?.role);
  const criticalLevel = patient.patient_info?.critical_level;

  useEffect(() => {
    if (personNumber) {
      dispatch(postGetPatientHealthDataThunk({ person_number: personNumber }));
    }
  }, [dispatch, personNumber]);
  return (
    <DetailedPage
      firstName={firstName}
      lastName={lastName}
      healthData={patient.health_data}
      loading={patient.healthLoading}
      errorMessage={patient.health_error_message}
      role={role}
      criticalLevel={criticalLevel}
    />
  );
}
