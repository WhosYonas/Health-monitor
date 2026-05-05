import { PatientLoginForm } from "@/components/custom/patientLoginForm";

type LoginPageProps = {
  onLogin: (credentials: { personNumber: string; password: string }) => void;
  loading?: boolean;
  login_error_message?: string | null;
};

export function PatientLoginPage({
  onLogin,
  loading,
  login_error_message,
}: LoginPageProps) {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-slate-950 via-teal-950 to-cyan-900">
      <div className="mx-auto w-full max-w-lg rounded-[1rem] border border-slate-200 bg-white p-8 sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
            Patient Login
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
            Log in to your account and continue monitoring your health metrics
            in one place.
          </p>
        </div>

        <PatientLoginForm onLogin={onLogin} loading={loading} />

        {login_error_message ? (
          <div className="mb-6 rounded-lg px-4 py-3 text-sm text-red-700">
            {login_error_message}
          </div>
        ) : null}

        <div className="mt-8 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <span className="font-semibold text-slate-900">
            Contact your caregiver
          </span>
        </div>
      </div>
    </div>
  );
}
