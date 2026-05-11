"use client";

import { AddPatientPage } from "@/views/addPatientPage";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store";
import { postAddPatientThunk } from "@/communication/addPatientCommunication";
import { generatePassword } from "@/lib/utils";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { NotAuthenticatedPagePresenter } from "./notAuthenticatedPage-presenter";

export function AddPatientPagePresenter() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { addLoading, addSuccess, addError } = useSelector(
    (state: RootState) => state.patientManagement,
  );
  const { is_authenticated, user, loading } = useSelector(
    (state: RootState) => state.user,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createdPatient, setCreatedPatient] = useState<{
    personnummer: string;
    password: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (addError) {
      toast.error(addError);
    }
  }, [addError]);

  async function handleAddPatient(patientInfo: {
    first_name: string | null;
    last_name: string | null;
    phone_number: string | null;
    personnummer: string | null;
    relative_fullname: string | null;
    relative_phone_number: string | null;
    critical_level: number | null;
    password: string | null;
  }) {
    const generatedPassword = generatePassword();

    try {
      await dispatch(
        postAddPatientThunk({
          first_name: patientInfo.first_name,
          last_name: patientInfo.last_name,
          phone_number: patientInfo.phone_number,
          personnummer: patientInfo.personnummer,
          relative_fullname: patientInfo.relative_fullname,
          relative_phone_number: patientInfo.relative_phone_number,
          critical_level: patientInfo.critical_level,
          password: generatedPassword,
        }),
      ).unwrap();

      setCreatedPatient({
        personnummer: patientInfo.personnummer ?? "",
        password: generatedPassword,
      });
      setDialogOpen(true);
      console.log("Patient added successfully");
    } catch (error) {
      console.log("Add patient failed", error);
      console.log("Patient info", patientInfo);
    }
  }

  const handleCopyPassword = async () => {
    if (!createdPatient?.password) return;
    try {
      await navigator.clipboard.writeText(createdPatient.password);
      setCopied(true);
      toast.success("Password copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy password");
    }
  };

  if (loading) {
    return null;
  }

  if (!is_authenticated || user?.role !== "caregiver") {
    return <NotAuthenticatedPagePresenter userRole={user?.role || null} />;
  }

  const onCancel = () => {
    router.push(`/overview`);
  };

  return (
    <>
      <AddPatientPage
        addLoading={addLoading}
        addSuccess={addSuccess}
        addError={addError}
        onAddPatient={handleAddPatient}
        onCancel={onCancel}
      />

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCreatedPatient(null);
            setCopied(false);
          }
          setDialogOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Patient added</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            The patient was successfully created. Please save the login details
            below.
          </DialogDescription>

          <div className="space-y-4 py-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Personnummer</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {createdPatient?.personnummer}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">Password</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {createdPatient?.password}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyPassword}
                  className="shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 size-4 text-emerald-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 size-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button asChild>
              <Link href="/overview">Go to overview</Link>
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Add another patient</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
