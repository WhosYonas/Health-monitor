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

interface addPatientProps {
  addLoading: boolean;
  addSuccess: boolean;
  addError: string | null;
  onAddPatient: (patientInfo: {
    first_name: string | null;
    last_name: string | null;
    phone_number: string | null;
    person_number: string | null;
    relative_fullname: string | null;
    relative_phone_number: string | null;
    critical_level: number | null;
  }) => void;
}

export function AddPatient({
  addLoading,
  addSuccess,
  addError,
  onAddPatient,
}: addPatientProps) {
  const [criticalLevel, setCriticalLevel] = React.useState("1");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const patientInfo = {
      first_name: formData.get("firstName") as string | null,
      last_name: formData.get("lastName") as string | null,
      phone_number: formData.get("phoneNumber") as string | null,
      person_number: formData.get("personNumber") as string | null,
      relative_fullname: formData.get("relativeName") as string | null,
      relative_phone_number: formData.get("relativePhoneNumber") as
        | string
        | null,
      critical_level: criticalLevel ? parseInt(criticalLevel) : null,
    };

    onAddPatient(patientInfo);
  };
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-slate-950 via-teal-950 to-cyan-900">
      <div className="mx-auto w-full max-w-3xl rounded-[1rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200 sm:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900">Add Patient</h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter patient details below.
          </p>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <FieldSet>
            <FieldLegend>Patient information</FieldLegend>
            <FieldDescription>
              Provide the patient&apos;s basic contact and identity information.
            </FieldDescription>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="patient-first-name">First name</FieldLabel>
                <Input
                  id="patient-first-name"
                  name="firstName"
                  placeholder="John"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="patient-last-name">Last name</FieldLabel>
                <Input
                  id="patient-last-name"
                  name="lastName"
                  placeholder="Doe"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="patient-phone">Phone number</FieldLabel>
                <Input
                  id="patient-phone"
                  name="phoneNumber"
                  placeholder="+46 70 123 45 67"
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
              Add the contact information for the patient&apos;s nearest
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
                />
              </Field>
            </div>
          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <FieldLegend>Care settings</FieldLegend>
            <FieldDescription>
              Choose the patient&apos;s current critical level.
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
            <Button type="submit">Add patient</Button>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Field>
        </form>
      </div>
    </div>
  );
}
