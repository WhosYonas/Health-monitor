"use client";
import { DetailsPage } from "@/views/detailsPage";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import type { AppDispatch, RootState } from "@/lib/store";
import { toast } from "sonner";
import { postGetPatientInfoThunk } from "@/communication/patientInfoCommunication";
import { postGetPatientHealthDataThunk } from "@/communication/patientHealthDataCommunication";
import { postDeletePatientThunk } from "@/communication/patientDeleteCommunication";
import { fetchPatientHealthHistoryThunk } from "@/communication/patientHealthHistoryCommunication";
import { useEffect } from "react";
import { clearHealthData } from "@/models/redux/patientSlice";

export const DetailsPagePresenter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const router = useRouter();

  const {
    patient_info,
    health_data,
    healthLoading,
    health_history,
    historyLoading,
  } = useSelector((state: RootState) => state.patient);

  const { user } = useSelector((state: RootState) => state.user);

  // Load patient info on mount
  useEffect(() => {
    if (params?.id) {
      const personId = Number(params.id);
      if (!isNaN(personId)) {
        dispatch(clearHealthData());
        dispatch(postGetPatientInfoThunk({ person_id: personId }));
      }
    }
  }, [params?.id]);

  // Load health data and history once patient info is available
  useEffect(() => {
    if (patient_info?.person_number) {
      dispatch(
        postGetPatientHealthDataThunk({
          person_number: patient_info.person_number,
        }),
      );
      dispatch(
        fetchPatientHealthHistoryThunk({
          person_number: patient_info.person_number,
        }),
      );
    }
  }, [patient_info?.person_number]);

  // Poll health data every 10 seconds
  useEffect(() => {
    if (!patient_info?.person_number) return;

    const interval = setInterval(() => {
      dispatch(
        postGetPatientHealthDataThunk({
          person_number: patient_info.person_number!,
        }),
      );
    }, 10_000);

    return () => clearInterval(interval);
  }, [patient_info?.person_number]);

  const onOverviewClick = () => {
    router.push("/overview");
  };

  const onDeletePatient = () => {
    if (!patient_info?.patient_id) return;
    dispatch(postDeletePatientThunk({ patient_id: patient_info.patient_id }))
      .unwrap()
      .then(() => {
        toast.success("Patient deleted");
        router.push("/overview");
      })
      .catch((err) => {
        toast.error(err ?? "Failed to delete patient");
      });
  };

  return (
    <DetailsPage
      patient_info={patient_info}
      onOverviewClick={onOverviewClick}
      onDeletePatient={onDeletePatient}
      role={user?.role ?? null}
      healthData={health_data}
      healthLoading={healthLoading}
      healthHistory={health_history}
      historyLoading={historyLoading}
    />
  );
};
