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

export const DetailsPage = ({ patient_info }: DetailsPageProps) => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Patient Details</h1>
      <p>This is the details page for a patient.</p>
      <p>{patient_info?.first_name}</p>
      <p>{patient_info?.last_name}</p>
      <p>{patient_info?.phone_number}</p>
      <p>{patient_info?.person_number}</p>
      <p>{patient_info?.relative_fullname}</p>
      <p>{patient_info?.relative_phone_number}</p>
      <p>{patient_info?.critical_level}</p>
    </div>
  );
};
