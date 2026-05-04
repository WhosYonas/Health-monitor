"use client";

import { AddPatientPage } from "@/views/addPatientPage";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store";
import { postAddPatientThunk } from "@/communication/addPatientCommunication";
import { generatePassword } from "@/lib/utils";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AddPatientPagePresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { addLoading, addSuccess, addError } = useSelector(
    (state: RootState) => state.patientManagement,
  );

  useEffect(() => {
    if (addError) {
      toast.error(addError);
    }
  }, [addError]);

  async function handleAddPatient(patientInfo: {
    first_name: string | null;
    last_name: string | null;
    phone_number: string | null;
    personnummer: string | null;
    relative_fullname: string | null;
    relative_phone_number: string | null;
    critical_level: number | null;
    password: string | null;
  }) {
    try {
      await dispatch(
        postAddPatientThunk({
          first_name: patientInfo.first_name,
          last_name: patientInfo.last_name,
          phone_number: patientInfo.phone_number,
          personnummer: patientInfo.personnummer,
          relative_fullname: patientInfo.relative_fullname,
          relative_phone_number: patientInfo.relative_phone_number,
          critical_level: patientInfo.critical_level,
          password: generatePassword(),
        }),
      ).unwrap();
      router.push("/overview");
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
