// details page for a patient

import { DetailsPagePresenter } from "@/presenters/detailsPage-presenter";

export default async function PatientDetails() {
  return (
    <div style={{ padding: "20px" }}>
      <DetailsPagePresenter />
    </div>
  );
}
