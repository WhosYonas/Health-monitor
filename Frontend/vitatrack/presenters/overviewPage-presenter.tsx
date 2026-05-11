"use client";

import OverviewPage from "@/views/overviewPage";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store";
import { getMyPatientsThunk } from "@/communication/getPatientsCommunication";
import { NotAuthenticatedPagePresenter } from "./notAuthenticatedPage-presenter";
import { getAlertsThunk } from "@/communication/getAlertsCommunication";

type SortOption = "priority" | "name" | "latest";

export function OverviewPagePresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const { is_authenticated, user, loading } = useSelector(
    (state: RootState) => state.user,
  );
  const { patients, patientsLoading, patientsError } = useSelector(
    (state: RootState) => state.patientManagement,
  );
  const { items: alerts, alert_loading } = useSelector(
    (state: RootState) => state.alerts,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("priority");

  useEffect(() => {
    if (is_authenticated && user?.role === "caregiver") {
      dispatch(getMyPatientsThunk());
    }
  }, [dispatch, is_authenticated, user?.role]);

  useEffect(() => {
    dispatch(getAlertsThunk());
    const interval = setInterval(() => {
      dispatch(getAlertsThunk());
    }, 60000);

    return () => clearInterval(interval); // Städa upp vid unmount
  }, [dispatch]);

  const filteredAndSortedPatients = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = !query
      ? patients
      : patients.filter((patient: any) => {
          const fullName =
            `${patient.person.first_name} ${patient.person.last_name}`.toLowerCase();
          const reverseFullName =
            `${patient.person.last_name} ${patient.person.first_name}`.toLowerCase();
          const firstName = patient.person.first_name?.toLowerCase() ?? "";
          const lastName = patient.person.last_name?.toLowerCase() ?? "";
          const personnummer = patient.person.personnummer?.toLowerCase() ?? "";
          const phoneNumber = patient.person.phone_number?.toLowerCase() ?? "";
          const patientId = String(patient.patient_id);

          return (
            fullName.includes(query) ||
            reverseFullName.includes(query) ||
            firstName.includes(query) ||
            lastName.includes(query) ||
            personnummer.includes(query) ||
            phoneNumber.includes(query) ||
            patientId.includes(query)
          );
        });

    const sorted = [...filtered];

    if (sortBy === "priority") {
      sorted.sort(
        (a: any, b: any) => (b.critical_level ?? 0) - (a.critical_level ?? 0),
      );
    } else if (sortBy === "name") {
      sorted.sort((a: any, b: any) =>
        (a.person.last_name ?? "").localeCompare(
          b.person.last_name ?? "",
          "sv",
        ),
      );
    } else if (sortBy === "latest") {
      sorted.sort((a: any, b: any) => b.patient_id - a.patient_id);
    }

    return sorted;
  }, [patients, searchQuery, sortBy]);

  if (loading) {
    return null;
  }

  if (!is_authenticated || user?.role !== "caregiver") {
    return <NotAuthenticatedPagePresenter userRole={user?.role || null} />;
  }

  return (
    <OverviewPage
      alert_loading={alert_loading}
      alerts={alerts}
      patients={patients}
      filteredPatients={filteredAndSortedPatients}
      patientsLoading={patientsLoading}
      patientsError={patientsError}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      sortBy={sortBy}
      onSortChange={setSortBy}
    />
  );
}
