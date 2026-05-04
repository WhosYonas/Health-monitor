"use client";

import { AddPatientPage } from "@/views/addPatientPage";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store";
import { postAddPatientThunk } from "@/communication/addPatientCommunication";
import { generatePassword } from "@/lib/utils";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
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

export function AddPatientPagePresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const { addLoading, addSuccess, addError } = useSelector(
    (state: RootState) => state.patientManagement,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createdPatient, setCreatedPatient] = useState<{
    personnummer: string;
    password: string;
  } | null>(null);

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

  return (
    <>
      <AddPatientPage
        addLoading={addLoading}
        addSuccess={addSuccess}
        addError={addError}
        onAddPatient={handleAddPatient}
      />

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCreatedPatient(null);
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
              <p className="text-sm text-slate-500">Password</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {createdPatient?.password}
              </p>
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
