"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface editPatientProps {
  patient_info: patientInformation | null;
  infoLoading: boolean;
  info_error_message: string | null;
  onUpdatePatient: (patientInfo: {
    first_name: string | null;
    last_name: string | null;
    phone_number: string | null;
    personnummer: string | null;
    relative_fullname: string | null;
    relative_phone_number: string | null;
    critical_level: number | null;
  }) => void;
  onCancel: () => void;
}

export function EditPatientPage({
  patient_info,
  infoLoading,
  info_error_message,
  onUpdatePatient,
  onCancel,
}: editPatientProps) {
  const [criticalLevel, setCriticalLevel] = React.useState<string>("1");

  React.useEffect(() => {
    if (patient_info?.critical_level != null) {
      setCriticalLevel(String(patient_info.critical_level));
    }
  }, [patient_info?.critical_level]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const updatedInfo = {
      first_name: formData.get("firstName") as string | null,
      last_name: formData.get("lastName") as string | null,
      phone_number: formData.get("phoneNumber") as string | null,
      personnummer: formData.get("personNumber") as string | null,
      relative_fullname: formData.get("relativeName") as string | null,
      relative_phone_number: formData.get("relativePhoneNumber") as
        | string
        | null,
      critical_level: criticalLevel ? parseInt(criticalLevel) : null,
    };

    onUpdatePatient(updatedInfo);
  };

  if (infoLoading && !patient_info) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-teal-950 to-cyan-900">
        <p className="text-white">Loading patient...</p>
      </div>
    );
  }

  if (info_error_message && !patient_info) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-teal-950 to-cyan-900">
        <p className="text-red-200">Error: {info_error_message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-slate-950 via-teal-950 to-cyan-900">
      <div className="mx-auto w-full max-w-3xl rounded-[1rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200 sm:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900">
            Edit Patient
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Update patient details below.
          </p>
        </div>

        <form
          className="space-y-8"
          onSubmit={handleSubmit}
          key={patient_info?.patient_id ?? "loading"}
        >
          <FieldSet>
            <FieldLegend>Patient information</FieldLegend>
            <FieldDescription>
              Update the patient&apos;s basic contact and identity information.
            </FieldDescription>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="patient-first-name">First name</FieldLabel>
                <Input
                  id="patient-first-name"
                  name="firstName"
                  placeholder="John"
                  defaultValue={patient_info?.first_name ?? ""}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="patient-last-name">Last name</FieldLabel>
                <Input
                  id="patient-last-name"
                  name="lastName"
                  placeholder="Doe"
                  defaultValue={patient_info?.last_name ?? ""}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="patient-phone">Phone number</FieldLabel>
                <Input
                  id="patient-phone"
                  name="phoneNumber"
                  placeholder="+46 70 123 45 67"
                  defaultValue={patient_info?.phone_number ?? ""}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="patient-person-number">
                  Person number
                </FieldLabel>
                <Input
                  id="patient-person-number"
                  name="personNumber"
                  placeholder="19900202-1234"
                  defaultValue={patient_info?.person_number ?? ""}
                />
                <FieldDescription>
                  Format example: 19900202-1234.
                </FieldDescription>
              </Field>
            </div>
          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <FieldLegend>Closest relative</FieldLegend>
            <FieldDescription>
              Update the contact information for the patient&apos;s nearest
              relative.
            </FieldDescription>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="relative-name">
                  Closest relative name
                </FieldLabel>
                <Input
                  id="relative-name"
                  name="relativeName"
                  placeholder="Alice Smith"
                  defaultValue={patient_info?.relative_fullname ?? ""}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="relative-phone">
                  Closest relative phone number
                </FieldLabel>
                <Input
                  id="relative-phone"
                  name="relativePhoneNumber"
                  placeholder="+46 70 765 43 21"
                  defaultValue={patient_info?.relative_phone_number ?? ""}
                />
              </Field>
            </div>
          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <FieldLegend>Care settings</FieldLegend>
            <FieldDescription>
              Update the patient&apos;s current critical level.
            </FieldDescription>

            <Field>
              <FieldLabel htmlFor="critical-level">Critical level</FieldLabel>
              <Select value={criticalLevel} onValueChange={setCriticalLevel}>
                <SelectTrigger id="critical-level">
                  <SelectValue placeholder="Choose level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldSet>

          <Field orientation="horizontal" className="justify-end gap-3">
            <Button type="submit" disabled={infoLoading}>
              Save changes
            </Button>
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
          </Field>
        </form>
      </div>
    </div>
  );
}
