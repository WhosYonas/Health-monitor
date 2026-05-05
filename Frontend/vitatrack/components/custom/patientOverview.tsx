import Link from "next/link";

type Patient = {
  patient_id: number;
  person: {
    first_name: string;
    last_name: string;
    phone_number: string | null;
    personnummer: string;
  };
};

type Props = {
  patient: Patient;
};

export function PatientOverview({ patient }: Props) {
  return (
    <div className="h-[80px] bg-teal-100 p-3 space-x-3 rounded-2xl flex items-center">
      <img
        src="/user_default.png"
        className="h-[60px] w-[60px] rounded-full outline-1 outline-black/50"
      />
      <div className="text-2xl w-[40%] bg-white h-[50px] p-2 rounded-2xl">
        {patient.person.first_name} {patient.person.last_name}
      </div>
      <div className="flex flex-row space-x-1 w-[30%]">
        <div className="bg-white h-[60px] w-1/3 flex flex-cols rounded-2xl p-4 justify-center items-end text-align-center">
          <h1 className="text-xl font-bold">83</h1>
          <h1 className="text-gray-500">bpm</h1>
        </div>
        <div className="bg-white h-[60px] w-1/3 flex flex-cols rounded-2xl p-4 justify-center items-end text-align-center">
          <h1 className="text-xl font-bold">36.5</h1>
          <h1 className="text-gray-500">°c</h1>
        </div>
        <div className="bg-white h-[60px] w-1/3 flex flex-cols rounded-2xl p-4 justify-center items-end text-align-center">
          <h1 className="text-xl font-bold">98%</h1>
          <h1 className="text-gray-500">SpO2</h1>
        </div>
      </div>
      <Link href={`/details/${patient.patient_id}`}>
        <button className="justify-self-end text-xl p-2 bg-amber-50 rounded-2xl cursor-pointer">
          Show details
        </button>
      </Link>
    </div>
  );
}
