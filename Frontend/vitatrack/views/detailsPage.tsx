"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  User,
  Phone,
  ShieldAlert,
  Fingerprint,
  Users,
} from "lucide-react";
import Link from "next/link";

interface patientInformation {
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
  patient_info: patientInformation | null;
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
    { id: 1, color: "bg-emerald-500", label: "Stabil" },
    { id: 2, color: "bg-yellow-400", label: "Observation" },
    { id: 3, color: "bg-red-500", label: "Kritisk" },
  ];

  return (
    <div className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-1.5">
      <span className="text-xs font-bold uppercase text-slate-600">Status</span>
      <div className="flex gap-1.5">
        {levels.map((l) => (
          <div
            key={l.id}
            className={`h-3 w-3 rounded-full border border-white shadow-sm ${
              level === l.id ? l.color : "bg-slate-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export const DetailsPage = ({ patient_info }: DetailsPageProps) => {
  if (!patient_info) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 text-slate-500">
        No patient information was found.
      </div>
    );
  }

  return (
    <div className="w-full min-h-[100dvh] bg-gradient-to-br px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl">
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

          <div className="mt-4 flex flex-col items-end gap-3 sm:mt-0">
            <CriticalStatus level={patient_info.critical_level} />
            <Link href={`/patients/${patient_info.patient_id}/edit`}>
              <Button
                variant="outline"
                className="border-slate-200 hover:bg-slate-50"
              >
                <Pencil className="mr-2 size-4" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* ── CONTENT ── */}
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
    </div>
  );
};
