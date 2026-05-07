"use client";
import OverviewPage from "@/views/overviewPage";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { NotAuthenticatedPagePresenter } from "./notAuthenticatedPage-presenter";

import { postGetPatientHealthDataThunk } from "@/communication/patientHealthDataCommunication";

export function OverviewPagePresenter() {
  const { is_authenticated, user, loading } = useSelector(
    (state: RootState) => state.user,
  );
  if (loading) {
    return null;
  }

  if (!is_authenticated || user?.role !== "caregiver") {
    return <NotAuthenticatedPagePresenter userRole={user?.role || null} />;
  }
  return <OverviewPage />;
}
