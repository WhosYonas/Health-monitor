import { LoginForm } from "@/components/custom/loginForm";

type LoginPageProps = {
  onLogin: (credentials: { personNumber: string; password: string }) => void;
  loading?: boolean;
  errorMessage?: string | null;
};

export function LoginPage({ onLogin, loading, errorMessage }: LoginPageProps) {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-slate-950 via-teal-950 to-cyan-900">
      <div className="mx-auto w-full max-w-lg rounded-[1rem] border border-slate-200 bg-white p-8 sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
            Login
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
            Log in to your account and continue monitoring your health metrics
            in one place.
          </p>
        </div>

        <LoginForm onLogin={onLogin} loading={loading} />

        {errorMessage ? (
          <div className="mb-6 rounded-lg px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-8 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <span className="font-semibold text-slate-900">Contact us</span>
        </div>
      </div>
    </div>
  );
}
