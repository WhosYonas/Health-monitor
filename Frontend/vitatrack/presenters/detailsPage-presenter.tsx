"use client";

import { DetailsPage } from "@/views/detailsPage";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import type { AppDispatch, RootState } from "@/lib/store";
import { toast } from "sonner";
import { postGetPatientInfoThunk } from "@/communication/patientInfoCommunication";
import { postDeletePatientThunk } from "@/communication/patientDeleteCommunication";
import { useEffect } from "react";

export const DetailsPagePresenter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const router = useRouter();
  const { patient_info } = useSelector((state: RootState) => state.patient);

  // const { role } = useSelector((state: RootState) => state.user);

  const onLoad = (id: string) => {
    const personId = Number(id);
    if (!isNaN(personId)) {
      dispatch(postGetPatientInfoThunk({ person_id: personId }));
    }
  };

  useEffect(() => {
    if (params?.id) {
      onLoad(params.id as string);
    }
  }, [params?.id]);

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
    />
  );
};
