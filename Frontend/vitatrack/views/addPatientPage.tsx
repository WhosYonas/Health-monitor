import { AddPatient } from "@/components/custom/addPatient";

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

export function AddPatientPage({
  addLoading,
  addSuccess,
  addError,
  onAddPatient,
}: addPatientProps) {
  return (
    <AddPatient
      addLoading={addLoading}
      addSuccess={addSuccess}
      addError={addError}
      onAddPatient={onAddPatient}
    />
  );
}
