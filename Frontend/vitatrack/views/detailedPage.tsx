"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";

import { HealthDataGraph } from "@/components/ui/HealthDataGraph";

type HealthData = {
  pulse: number | null;
  body_temperature: number | null;
  blood_oxygen_level: number | null;
};

type DetailedPageProps = {
  healthData: HealthData | null;
  loading?: boolean;
  errorMessage?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role?: string | null;
  criticalLevel?: number | null;
};

type HealthCardProps = {
  label: string;
  value: number | null;
  unit: string;
  loading?: boolean;
  onClick?: () => void; //Show graph
};

function HealthCard({ label, value, unit, loading, onClick }: HealthCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center rounded-2xl border border-[#c4cdd6] bg-[#e4ebf1] p-6 text-[#1f2933] shadow-sm transition-all duration-300 hover:-translate-y-[1px] hover:border-[#b1bcc7] hover:bg-[#d8e1e8] hover:shadow-md"
    >
      <span className="mb-2 text-sm font-semibold tracking-[0.12em] uppercase text-[#5b6772]">
        {label}
      </span>
      {loading ? (
        <span className="text-2xl font-semibold text-[#9ba6b1] animate-pulse">
          ...
        </span>
      ) : (
        <span className="text-2xl font-semibold tabular-nums text-[#1f2933]">
          {value !== null ? value : "--"}
        </span>
      )}
      <span className="mt-1 text-xs font-medium text-[#66737f]">{unit}</span>
    </button>
  );
}

type healthGraphType = "Pulse" | "Body Temperature" | "Oxygen Level";

type CriticalLevelIndicatorProps = {
  criticalLevel?: number | null;
};

function CriticalLevelIndicator({ criticalLevel }: CriticalLevelIndicatorProps) {
  const labels: Record<number, string> = {
    1: "Stable",
    2: "Watch",
    3: "Critical",
  };

  const colors: Record<number, string> = {
    1: "bg-emerald-500/90 border-emerald-600 text-emerald-50",
    2: "bg-amber-400/90 border-amber-500 text-slate-900",
    3: "bg-rose-500/90 border-rose-600 text-rose-50",
  };

  return (
    <div className="mt-4 flex items-center gap-4">
      <span className="text-sm font-medium text-slate-500">
        Critical level
      </span>

      <div className="flex items-center gap-2">
        {[1, 2, 3].map((level) => (
          <span
            key={level}
            className={`h-4 w-4 rounded-full border ${
              criticalLevel === level
                ? level === 1
                  ? "bg-emerald-500 border-emerald-600 shadow-[0_0_0_3px_rgba(16,185,129,0.25)]"
                  : level === 2
                  ? "bg-amber-400 border-amber-500 shadow-[0_0_0_3px_rgba(251,191,36,0.25)]"
                  : "bg-rose-500 border-rose-600 shadow-[0_0_0_3px_rgba(244,63,94,0.25)]"
                : "bg-slate-200 border-slate-300"
            }`}
          />
        ))}
      </div>

      {criticalLevel && (
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
            colors[criticalLevel]
          }`}
        >
          {labels[criticalLevel]}
        </span>
      )}
    </div>
  );
}

export function DetailedPage({
  healthData,
  loading,
  errorMessage,
  firstName,
  lastName,
  role,
  criticalLevel,
}: DetailedPageProps) {
  const [graphOpen, openGraph] = useState<healthGraphType | null>(null);

  function handleGraphOpening(healthCardName: healthGraphType) {
    if (graphOpen === healthCardName) {
      openGraph(null);
    } else {
      openGraph(healthCardName);
    }
  }

  // below only for test
  criticalLevel = 1;
  role = "patient";
  firstName = "Ingrid";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#111827] via-[#0f172a] to-[#0b1220] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl rounded-[1.5rem] border border-white/15 bg-gradient-to-br from-[#e4ebf1] via-[#dde4eb] to-[#cfd7e1] p-8 shadow-[0_18px_45px_rgba(15,23,42,0.6)] sm:p-10">
        {/* ── Header ── */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-[#6b7681]">
              Patient detail
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-[-0.03em] text-[#111827] sm:text-4xl">
              {role === "patient"
                ? `Hi ${firstName}`
                : "Patient health overview"}
            </h1>
            <p className="mt-1 text-sm text-[#63717d]">
              Live vitals, criticality level, and recent trends.
            </p>
            <CriticalLevelIndicator criticalLevel={criticalLevel} />
          </div>
          <Link href="/addPatientPage">
            <Button
              variant="outline"
              className="border-[#9aa5b1] bg-[#e4ebf1] text-[#1f2933] hover:border-[#2f6f73] hover:bg-[#2f6f73] hover:text-white"
            >
              <Pencil className="mr-2 size-4" />
              Edit profile
            </Button>
          </Link>
        </div>

        {errorMessage ? (
          <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
            {errorMessage}
          </div>
        ) : null}

        {/* HealthData Boxes */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <HealthCard
            label="Pulse"
            value={healthData?.pulse ?? null}
            unit="bpm"
            loading={loading}
            onClick={() => handleGraphOpening("Pulse")}
          />
          <HealthCard
            label="Temperature"
            value={healthData?.body_temperature ?? null}
            unit="°C"
            loading={loading}
            onClick={() => handleGraphOpening("Body Temperature")}
          />
          <HealthCard
            label="Blood Oxygen"
            value={healthData?.blood_oxygen_level ?? null}
            unit="%"
            loading={loading}
            onClick={() => handleGraphOpening("Oxygen Level")}
          />
        </div>

        {/* Conditional rendering for different graphs */}
        {graphOpen && (
          <div className="mb-10 mt-10">
            <h2 className="mb-4 text-lg font-semibold text-[#1f2933]">
              {graphOpen}
            </h2>
            <div className="flex h-auto items-center justify-center overflow-hidden rounded-2xl border border-[#c4cdd6] bg-[#edf2f7] text-sm text-slate-400">
              <div className="h-full w-full">
                <HealthDataGraph title={graphOpen} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}