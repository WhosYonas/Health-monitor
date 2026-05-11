"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { postGetPatientHealthData } from "@/communication/patientHealthDataCommunication";

type HealthData = {
  pulse: number | null;
  body_temperature: number | null;
  blood_oxygen_level: number | null;
};
type Patient = {
  patient_id: number;
  person: {
    first_name: string;
    last_name: string;
    phone_number: string | null;
    personnummer: string;
  };
};

type Props = {
  patient: Patient;
};

function StatCard({
  label,
  value,
  unit,
  tone = "slate",
}: {
  label: string;
  value: string;
  unit: string;
  tone?: "rose" | "orange" | "sky" | "slate";
}) {
  const toneStyles = {
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    sky: "bg-sky-50 text-sky-600 border-sky-100",
    slate: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <div className="min-w-0 rounded-[5px] border border-slate-200 bg-white px-3 py-3 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-xl border ${toneStyles[tone]}`}
          aria-hidden="true"
        >
          {label === "Heart rate" && (
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M12 21s-6.716-4.35-9.193-8.183C.917 9.89 2.02 5.77 5.63 4.45c2.06-.753 4.153.03 5.37 1.648 1.217-1.618 3.31-2.401 5.37-1.648 3.61 1.32 4.713 5.44 2.823 8.367C18.716 16.65 12 21 12 21z" />
            </svg>
          )}
          {label === "Temperature" && (
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 14.76V5a2 2 0 10-4 0v9.76a4 4 0 104 0z"
              />
            </svg>
          )}
          {label === "SpO2" && (
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path
                d="M12 2.5C10.8 4.9 9.6 6.8 8.5 8.5C7 10.9 6 12.7 6 14.8C6 18.2 8.7 21 12 21C15.3 21 18 18.2 18 14.8C18 12.7 17 10.9 15.5 8.5C14.4 6.8 13.2 4.9 12 2.5Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text
                x="12"
                y="15.2"
                textAnchor="middle"
                fontSize="6.2"
                fontWeight="600"
                fill="currentColor"
                stroke="none"
                letterSpacing="-0.3"
              >
                O2
              </text>
            </svg>
          )}
        </div>

        <span className="truncate text-xs font-medium text-slate-500">
          {label}
        </span>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-base font-semibold text-slate-900 tabular-nums">
          {value}
        </span>
        <span className="text-xs font-medium text-slate-500">{unit}</span>
      </div>
    </div>
  );
}

export function PatientOverview({ patient }: Props) {
  const fullName = `${patient.person.first_name} ${patient.person.last_name}`;
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postGetPatientHealthData({ person_number: patient.person.personnummer })
      .then(setHealthData)
      .catch(() => setHealthData(null))
      .finally(() => setLoading(false));
  }, [patient.person.personnummer]);

  const fmt = (val: number | null | undefined) =>
    val !== null && val !== undefined ? String(val) : "—";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-500 shadow-inner">
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-slate-900">
              {fullName}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:w-[420px] xl:max-w-[420px]">
          <StatCard
            label="Heart rate"
            value={loading ? "…" : fmt(healthData?.pulse)}
            unit="bpm"
            tone="rose"
          />
          <StatCard
            label="Temperature"
            value={loading ? "…" : fmt(healthData?.body_temperature)}
            unit="°C"
            tone="orange"
          />
          <StatCard
            label="SpO2"
            value={loading ? "…" : fmt(healthData?.blood_oxygen_level)}
            unit="%"
            tone="sky"
          />
        </div>

        <Link
          href={`/patients/${patient.patient_id}`}
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          Show details
        </Link>
      </div>
    </div>
  );
}
