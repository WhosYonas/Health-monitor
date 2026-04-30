import { PatientOverview } from "@/components/custom/patientOverview";
import Link from "next/link";

export function OverviewPage() {
  return (
    <div className="bg-amber-50 flex flex-row p-4">
      <div className="min-h-screen h-lwh w-[70%]">
        <div className="bg-teal-700 p-5 m-2 rounded-2xl space-y-2 h-full overflow-hidden">
          <div className="grid grid-cols-3 w-full items-center">
            <h1 className="text-white text-2xl font-bold text-center h-[50px] justify-self-center col-2">
              {" "}
              Patients:{" "}
            </h1>
            <Link href="/addpatient" className="justify-self-end col-3">
              <button className="bg-amber-50 p-3 rounded-2xl font-semibold cursor-pointer">
                Add Patient
              </button>
            </Link>
          </div>

          {PatientOverview()}
          {PatientOverview()}
          {PatientOverview()}
          {PatientOverview()}
          {PatientOverview()}
          {PatientOverview()}
          {PatientOverview()}
          {PatientOverview()}
          {PatientOverview()}
          {PatientOverview()}
        </div>
      </div>

      <div className="flex-col flex w-[30%] h-full">
        <div className="bg-teal-600 p-5 m-2 rounded-2xl w-full">
          Notifications
        </div>
        <div className="bg-teal-600 p-5 m-2 rounded-2xl w-full">Tasks</div>
      </div>
    </div>
  );
}
