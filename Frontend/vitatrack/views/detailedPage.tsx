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
};

type HealthCardProps = {
  label: string;
  value: number | null;
  unit: string;
  loading?: boolean;
  onClick?: () => void; //dubbelcheck this one-------------------------------------------------------Show graph
};

function HealthCard({ label, value, unit, loading, onClick }: HealthCardProps) {
  return (
    <button
      className="flex flex-col justify-center items-center rounded-xl border 
            border-black-300 bg-rose-100 p-6 cursor-pointer"
      onClick={onClick}
    >
      <span className="text-m font-bold mb-2">{label}</span>
      {loading ? (
        <span className="text-2xl font-semibold text-black-300 animate-pulse">
          ...
        </span>
      ) : (
        <span>{value !== null ? value : "--"}</span>
      )}
      <span>{unit}</span>
    </button>
  );
}

type healthGraphType = "Pulse" | "Body Temperature" | "Oxygen Level";

export function DetailedPage({
  healthData,
  loading,
  errorMessage,
}: DetailedPageProps) {
  const [graphOpen, openGraph] = useState<healthGraphType | null>(null);
  function handleGraphOpening(healthCardName: healthGraphType) {
    if (graphOpen == healthCardName) {
      openGraph(null);
    } else {
      openGraph(healthCardName);
    }
  }
  return (
    <div className=" min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-950 via-teal-950 to-cyan-900">
      <div className="mx-auto w-full max-w-4xl rounded-[1rem] border border-slate-200 bg-white p-8 sm:p-10">
        {/* ── Header ── */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Health Overview
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
              Monitor your real-time health metrics in one place.
            </p>
          </div>
          <Link href="/addPatientPage">
            <Button variant="outline">
              <Pencil className="size-4 mr-2" />
              Edit Profile
            </Button>
          </Link>
        </div>
        {errorMessage ? (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {/*  HealthData Boxes */}
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
        <div className="mt-10 mb-10">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
            {graphOpen}
            </h2>
            <div className="rounded-xl border border-slate-200 bg-slate-50 h-auto flex items-center justify-center text-slate-400 text-sm overflow-hidden">
            <div className="w-full h-full">
                <HealthDataGraph title={graphOpen}/>
            </div>
            </div>
        </div>
        )}

        {/* the general health-state Graph */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Trends</h2>
          <div className="rounded-xl border border-slate-200 bg-slate-50 h-48 flex items-center justify-center text-slate-400 text-sm">
            Graph coming soon
          </div>
        </div>

        {/* Description or analyse of the health values  */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">
            About Your Metrics
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            These values are collected from your connected device and updated in
            real time. Contact your healthcare provider if any readings are
            outside your normal range.
          </p>
        </div>

        {/* History  */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">History</h2>
          <div className="rounded-xl border border-slate-200 bg-slate-50 h-32 flex items-center justify-center text-slate-400 text-sm">
            History coming soon
          </div>
        </div>
      </div>
    </div>
  );
}
