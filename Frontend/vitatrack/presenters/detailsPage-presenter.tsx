"use client";

import { DetailsPage } from "@/views/detailsPage";
import { HeaderPage } from "@/views/headerPage";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { LoginPage } from "@/views/loginPage";
import { postLogoutThunk } from "@/communication/logoutCommunication";
import type { AppDispatch, RootState } from "@/lib/store";
import UserSync from "@/utils/userSync";
import { logout } from "@/models/redux/userSlice";
import { toast } from "sonner";
import { postGetPatientInfoThunk } from "@/communication/patientInfoCommunication";
import { useEffect } from "react";

export const DetailsPagePresenter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const { patient_info } = useSelector((state: RootState) => state.patient);

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

  return <DetailsPage patient_info={patient_info} />;
};
