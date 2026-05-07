"use client";

import { DetailedPage } from "../views/detailedPage";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { useEffect } from "react";
import { NotAuthenticatedPagePresenter } from "./notAuthenticatedPage-presenter";

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
  const { is_authenticated, user, loading } = useSelector(
    (state: RootState) => state.user,
  );
  const criticalLevel = patient.patient_info?.critical_level;

  useEffect(() => {
    if (personNumber) {
      dispatch(postGetPatientHealthDataThunk({ person_number: personNumber }));
    }
  }, [dispatch, personNumber]);

  if (loading) {
    return null;
  }

  if (!is_authenticated) {
    return <NotAuthenticatedPagePresenter userRole={user?.role || null} />;
  }

  return (
    <DetailedPage
      firstName={firstName}
      lastName={lastName}
      healthData={patient.health_data}
      loading={patient.healthLoading}
      errorMessage={patient.health_error_message}
      role={user?.role}
      criticalLevel={criticalLevel}
    />
  );
}
