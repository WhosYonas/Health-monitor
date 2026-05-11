"use client";

import { EditPatientPage } from "@/views/editPatientPage";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import type { AppDispatch, RootState } from "@/lib/store";
import { postGetPatientInfoThunk } from "@/communication/patientInfoCommunication";
import { postUpdatePatientThunk } from "@/communication/patientUpdateCommunication";
import { useEffect } from "react";
import { toast } from "sonner";

export const EditPatientPresenter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const router = useRouter();
  const { patient_info, infoLoading, info_error_message } = useSelector(
    (state: RootState) => state.patient,
  );

  const patientId = params?.id ? Number(params.id) : null;

  useEffect(() => {
    if (patientId !== null && !isNaN(patientId)) {
      if (!patient_info || patient_info.patient_id !== patientId) {
        dispatch(postGetPatientInfoThunk({ person_id: patientId }));
      }
    }
  }, [patientId]);

  const onUpdatePatient = (updatedInfo: {
    first_name: string | null;
    last_name: string | null;
    phone_number: string | null;
    personnummer: string | null;
    relative_fullname: string | null;
    relative_phone_number: string | null;
    critical_level: number | null;
  }) => {
    if (patientId === null || isNaN(patientId)) return;

    dispatch(
      postUpdatePatientThunk({
        patient_id: patientId,
        ...updatedInfo,
      }),
    )
      .unwrap()
      .then(() => {
        toast.success("Patient updated");
        router.push(`/patients/${patientId}`);
      })
      .catch((err) => {
        toast.error(err ?? "Failed to update patient");
      });
  };

  const onCancel = () => {
    router.push(`/patients/${patientId}`);
  };

  return (
    <EditPatientPage
      patient_info={patient_info}
      infoLoading={infoLoading}
      info_error_message={info_error_message}
      onUpdatePatient={onUpdatePatient}
      onCancel={onCancel}
    />
  );
};
