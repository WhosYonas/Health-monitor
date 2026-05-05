"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type LoginFormProps = {
  onLogin: (credentials: { personNumber: string; password: string }) => void;
  loading?: boolean;
};

const PERSON_NUMBER_REGEX = /^\d{8}-\d{4}$/;

export function PatientLoginForm({ onLogin, loading }: LoginFormProps) {
  const [validationError, setValidationError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const personNumber = String(formData.get("personNumber") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!PERSON_NUMBER_REGEX.test(personNumber)) {
      setValidationError(
        "Person number must be in the format 19900202-1234 (8 digits, a dash, and 4 digits).",
      );
      return;
    }

    setValidationError(null);
    onLogin({ personNumber: personNumber.replace("-", ""), password });
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <FieldGroup>
        <Field className="w-full">
          <FieldLabel
            htmlFor="fieldgroup-personNumber"
            className="text-base font-medium text-slate-900"
          >
            Person number
          </FieldLabel>
          <Input
            id="fieldgroup-personNumber"
            name="personNumber"
            placeholder="19500101-1234"
            pattern="\d{8}-\d{4}"
            title="Use the format 19900202-1234"
            className="mt-2"
          />
          <FieldDescription className="mt-2 text-sm text-slate-500">
            Use the format 19900202-1234 (8 digits, dash, 4 digits).
          </FieldDescription>
        </Field>

        {validationError ? (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {validationError}
          </div>
        ) : null}

        <Field className="w-full">
          <FieldLabel
            htmlFor="fieldgroup-password"
            className="text-base font-medium text-slate-900"
          >
            Password
          </FieldLabel>
          <Input
            id="fieldgroup-password"
            name="password"
            type="password"
            placeholder="••••••••••"
            className="mt-2"
          />
          <FieldDescription className="mt-2 text-sm text-slate-500">
            Use the same password as you received from your caregiver.
          </FieldDescription>
        </Field>

        <Field orientation="horizontal" className="justify-end">
          <Button
            type="submit"
            size="lg"
            className="w-full py-3 text-base"
            disabled={loading}
          >
            {loading ? "Logging in…" : "Log in"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
