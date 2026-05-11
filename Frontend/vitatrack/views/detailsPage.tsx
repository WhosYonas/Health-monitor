"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Pencil,
  Trash2,
  User,
  Phone,
  Fingerprint,
  Users,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { HealthDataGraph } from "@/components/ui/HealthDataGraph";
import { MeasurementPoint } from "@/communication/patientHealthHistoryCommunication";

type HealthData = {
  pulse: number | null;
  body_temperature: number | null;
  blood_oxygen_level: number | null;
};

type HealthGraphType = "Pulse" | "Body Temperature" | "Oxygen Level";

interface PatientInformation {
  patient_id: number | null;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  person_number: string | null;
  relative_fullname: string | null;
  relative_phone_number: string | null;
  critical_level: number | null;
}

interface DetailsPageProps {
  patient_info: PatientInformation | null;
  onOverviewClick: () => void;
  onDeletePatient: () => void;
  role: string | null;
  healthData?: HealthData | null;
  healthLoading?: boolean;
  healthHistory?: MeasurementPoint[];
  historyLoading?: boolean;
}

function InfoCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number | null;
  icon: any;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-hover hover:bg-slate-50">
      <div className="rounded-lg bg-white p-2 shadow-sm border border-slate-100">
        <Icon className="size-5 text-teal-600" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-900">
          {value ?? "Not provided"}
        </p>
      </div>
    </div>
  );
}

function CriticalStatus({ level }: { level: number | null }) {
  const levels = [
    { id: 1, color: "bg-emerald-500" },
    { id: 2, color: "bg-yellow-400" },
    { id: 3, color: "bg-red-500" },
  ];
  return (
    <div className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-1.5">
      <span className="text-xs font-bold uppercase text-slate-600">Status</span>
      <div className="flex gap-1.5">
        {levels.map((l) => (
          <div
            key={l.id}
            className={`h-3 w-3 rounded-full border border-white shadow-sm ${level === l.id ? l.color : "bg-slate-300"}`}
          />
        ))}
      </div>
    </div>
  );
}

function HealthCard({
  label,
  value,
  unit,
  loading,
  active,
  onClick,
}: {
  label: string;
  value: number | null;
  unit: string;
  loading?: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center rounded-xl border p-6 cursor-pointer transition-all duration-200 w-full
        ${
          active
            ? "border-teal-400 bg-teal-50 shadow-sm"
            : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
        }`}
    >
      <span className="text-sm font-semibold text-slate-600 mb-2">{label}</span>
      {loading ? (
        <span className="text-2xl font-bold text-slate-300 animate-pulse">
          ...
        </span>
      ) : (
        <span className="text-2xl font-bold text-slate-900">
          {value !== null ? value : "—"}
        </span>
      )}
      <span className="text-xs text-slate-400 mt-1">{unit}</span>
    </button>
  );
}

export const DetailsPage = ({
  patient_info,
  onOverviewClick,
  onDeletePatient,
  role,
  healthData,
  healthLoading,
  healthHistory,
  historyLoading,
}: DetailsPageProps) => {
  const [graphOpen, setGraphOpen] = useState<HealthGraphType | null>(null);

  const handleGraphToggle = (type: HealthGraphType) => {
    setGraphOpen((prev) => (prev === type ? null : type));
  };

  if (!patient_info) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-linear-to-br from-slate-950 via-teal-950 to-cyan-900 text-slate-300">
        No patient information was found.
      </div>
    );
  }

  return (
    <div className="w-full min-h-[100dvh] bg-linear-to-br from-slate-950 via-teal-950 to-cyan-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-5">
        {role === "caregiver" && (
          <Button
            variant="outline"
            onClick={onOverviewClick}
            className="border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to overview
          </Button>
        )}

        {/* Patient info card */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl">
          <div className="border-b border-slate-100 bg-white px-8 py-8 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                <User size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {patient_info.first_name} {patient_info.last_name}
                </h1>
                <p className="text-sm text-slate-500">
                  Patient ID: #{patient_info.patient_id}
                </p>
              </div>
            </div>

            {role === "caregiver" && (
              <div className="mt-4 flex flex-col items-end gap-3 sm:mt-0">
                <CriticalStatus level={patient_info.critical_level} />
                <div className="flex gap-2">
                  <Link href={`/patients/${patient_info.patient_id}/edit`}>
                    <Button
                      variant="outline"
                      className="border-slate-200 hover:bg-slate-50"
                    >
                      <Pencil className="mr-2 size-4" />
                      Edit Profile
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete patient?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete{" "}
                          <span className="font-semibold">
                            {patient_info.first_name} {patient_info.last_name}
                          </span>{" "}
                          and all of their data. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={onDeletePatient}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-white">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <div className="mb-4 flex items-center gap-2 text-slate-800">
                  <Fingerprint size={18} className="text-teal-600" />
                  <h2 className="font-semibold">Information</h2>
                </div>
                <div className="space-y-3">
                  <InfoCard
                    label="Person number"
                    value={patient_info.person_number}
                    icon={Fingerprint}
                  />
                  <InfoCard
                    label="Phone number"
                    value={patient_info.phone_number}
                    icon={Phone}
                  />
                </div>
              </div>
              <div>
                <div className="mb-4 flex items-center gap-2 text-slate-800">
                  <Users size={18} className="text-teal-600" />
                  <h2 className="font-semibold">Closest relative</h2>
                </div>
                <div className="space-y-3">
                  <InfoCard
                    label="Name"
                    value={patient_info.relative_fullname}
                    icon={User}
                  />
                  <InfoCard
                    label="Phone number"
                    value={patient_info.relative_phone_number}
                    icon={Phone}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health data card */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl p-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-5">
            Health Data
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <HealthCard
              label="Pulse"
              value={healthData?.pulse ?? null}
              unit="bpm"
              loading={healthLoading}
              active={graphOpen === "Pulse"}
              onClick={() => handleGraphToggle("Pulse")}
            />
            <HealthCard
              label="Temperature"
              value={healthData?.body_temperature ?? null}
              unit="°C"
              loading={healthLoading}
              active={graphOpen === "Body Temperature"}
              onClick={() => handleGraphToggle("Body Temperature")}
            />
            <HealthCard
              label="Blood Oxygen"
              value={healthData?.blood_oxygen_level ?? null}
              unit="%"
              loading={healthLoading}
              active={graphOpen === "Oxygen Level"}
              onClick={() => handleGraphToggle("Oxygen Level")}
            />
          </div>

          {graphOpen && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                {graphOpen}
              </h3>
              <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                <HealthDataGraph
                  title={graphOpen}
                  history={healthHistory ?? []}
                  historyLoading={historyLoading ?? false}
                />{" "}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
