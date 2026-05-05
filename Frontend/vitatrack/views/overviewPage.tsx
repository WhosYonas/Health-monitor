"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyPatientsThunk } from "@/communication/getPatientsCommunication";
import { PatientOverview } from "@/components/custom/patientOverview";
import type { AppDispatch } from "@/lib/store";
import Link from "next/link";

export default function OverviewPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { patients, patientsLoading, patientsError } = useSelector(
    (state: any) => state.patientManagement,
  );

  useEffect(() => {
    dispatch(getMyPatientsThunk());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F5F2] to-[#F4FAF8] p-5">
      <div className="mx-auto max-w-[1600px] space-y-5">

        {/* Header */}
        <header className="rounded-[8px] border border-white/40 bg-gradient-to-br from-white to-[#f5f7f8] px-4 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:px-6 sm:py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[12px] sm:text-[13px] font-medium uppercase tracking-[0.18em] text-[#6b7280]">
                VitaTrack Monitor
              </p>
              <h1 className="mt-1 text-[26px] sm:text-[32px] md:text-[35px] font-bold tracking-[-0.03em] text-[#111827]">
                Patients Overview
              </h1>
              <p className="mt-1 text-[14px] sm:text-[15px] text-[#6b7280]">
                Live patient monitoring, notifications and tasks.
              </p>
            </div>
            <div className="flex justify-start sm:justify-end">
              <Link href="/addpatient">
                <button className="rounded-2xl bg-[#00C281] px-4 py-2.5 text-sm sm:text-base font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#00a86f] hover:shadow-md hover:-translate-y-[1px]">
                  Add Patient
                </button>
              </Link>
            </div>
          </div>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[8px] border border-white/40 bg-white p-4 shadow-sm">
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#6b7280]">
              Total Patients
            </p>
            <h2 className="mt-3 text-[26px] sm:text-[30px] font-bold tracking-[-0.03em] text-[#111827]">
              {patients.length}
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">Currently monitored</p>
          </div>

          <div className="rounded-[8px] border border-white/40 bg-white p-4 shadow-sm">
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#6b7280]">
              Critical Alerts
            </p>
            <h2 className="mt-3 text-[26px] sm:text-[30px] font-bold tracking-[-0.03em] text-[#dc2626]">
              03
            </h2>
            <p className="mt-1 flex items-center gap-2 text-sm text-[#6b7280]">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600" />
              </span>
              <span>Requires immediate review</span>
            </p>
          </div>

          <div className="rounded-[8px] border border-white/40 bg-white p-4 shadow-sm">
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#6b7280]">
              Pending Tasks
            </p>
            <h2 className="mt-3 text-[26px] sm:text-[30px] font-bold tracking-[-0.03em] text-[#111827]">
              08
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">Follow-ups and notes</p>
          </div>

          <div className="rounded-[8px] border border-white/40 bg-white p-4 shadow-sm">
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#6b7280]">
              System Status
            </p>
            <h2 className="mt-3 text-[26px] sm:text-[30px] font-bold tracking-[-0.03em] text-[#00C281]">
              Stable
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">Monitoring stream active</p>
          </div>
        </section>

        {/* Main + Sidebar */}
        <div className="flex flex-col gap-5 lg:flex-row">

          {/* Patient list */}
          <section className="w-full lg:w-[70%] rounded-[8px] border border-white/35 bg-white p-4 sm:p-5 shadow-[0_12px_32px_rgba(15,23,42,0.07)]">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-[#6b7280]">
                  Patient List
                </p>
                <h2 className="mt-1 text-[22px] sm:text-[24px] md:text-[26px] font-bold tracking-[-0.03em] text-[#111827]">
                  Active Monitoring
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search patients..."
                    className="w-full min-w-[220px] rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] py-2 pl-10 pr-4 text-sm text-[#111827] outline-none transition-all duration-300 placeholder:text-[#9ca3af] focus:border-[#00C281] focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,194,129,0.10)]"
                  />
                </div>

                <div className="relative">
                  <select
                    defaultValue="priority"
                    className="w-full rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] py-2 pl-4 pr-10 text-sm font-medium text-[#6b7280] outline-none transition-all duration-300 hover:border-[#d1d5db] hover:bg-white hover:shadow-sm focus:border-[#00C281] focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,194,129,0.10)]"
                  >
                    <option value="priority">Sort by priority</option>
                    <option value="name">Sort by name</option>
                    <option value="latest">Sort by latest</option>
                  </select>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.51a.75.75 0 0 1-1.08 0l-4.25-4.51a.75.75 0 0 1 .02-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Loading / Error states */}
            {patientsLoading && (
              <p className="text-sm text-[#6b7280]">Loading patients...</p>
            )}
            {patientsError && (
              <p className="text-sm text-red-500">{patientsError}</p>
            )}

            <div className="space-y-3">
              {patients.map((patient: any) => (
                <PatientOverview key={patient.patient_id} patient={patient} />
              ))}
            </div>
          </section>

          {/* Sidebar */}
          <div className="flex w-full flex-col gap-5 lg:w-[30%]">

            {/* Notifications */}
            <section className="rounded-[28px] border border-white/35 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-2">
                <p className="text-[15px] font-semibold text-[#111827]">Notifications</p>
                <span className="rounded-full bg-[#00C281] px-2.5 py-1 text-[12px] font-semibold text-white">
                  2 new
                </span>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-4 transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                  <p className="text-sm font-semibold text-[#111827]">Patient 14 needs attention</p>
                  <p className="mt-1 text-sm text-[#6b7280]">Heart rate threshold exceeded 2 minutes ago.</p>
                </div>
                <div className="rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-4 transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                  <p className="text-sm font-semibold text-[#111827]">Lab update received</p>
                  <p className="mt-1 text-sm text-[#6b7280]">New blood panel data is available for review.</p>
                </div>
              </div>
            </section>

            {/* Tasks */}
            <section className="rounded-[28px] border border-white/35 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-2">
                <p className="text-[15px] font-semibold text-[#111827]">Tasks</p>
                <button className="whitespace-nowrap rounded-2xl bg-[#111827] px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-[1px] hover:bg-[#1f2937] hover:shadow-sm">
                  Add task
                </button>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-4 text-sm text-[#374151] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                  Review three flagged patients before 14:00.
                </div>
                <div className="rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-4 text-sm text-[#374151] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                  Confirm medication updates for Room 12.
                </div>
                <div className="rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-4 text-sm text-[#374151] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                  Complete handoff notes for evening shift.
                </div>
              </div>
            </section>

            {/* Status banner */}
            <section className="rounded-[28px] border border-white/35 bg-gradient-to-br from-[#00C281] to-[#00a86f] p-5 shadow-[0_12px_32px_rgba(0,194,129,0.25)]">
              <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-white/70">
                Monitoring Status
              </p>
              <h3 className="mt-2 text-[26px] font-bold tracking-[-0.03em] text-white">
                All systems online
              </h3>
              <p className="mt-2 max-w-[28ch] text-sm text-white/90">
                Streams are stable and patient telemetry is syncing normally.
              </p>
              <div className="mt-5 flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-white" />
                <span className="text-sm font-medium text-white">Connected to live feed</span>
              </div>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
}