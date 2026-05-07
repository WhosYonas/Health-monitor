import Link from "next/dist/client/link";

interface NotAuthenticatedPageProps {
  userRole: string | null;
}

export function NotAuthenticatedPage({ userRole }: NotAuthenticatedPageProps) {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-slate-900 to-teal-900">
      <div className="rounded-lg bg-white/90 p-10 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          {userRole === "patient"
            ? "Only caregivers can access this page. Please contact your caregiver for more information."
            : "You must be logged in to view this page."}
        </p>
        {userRole === "patient" ? (
          <Link
            href="/details"
            className="inline-block rounded bg-teal-500 px-5 py-2 text-white font-semibold hover:bg-teal-600 transition"
          >
            Go to Details
          </Link>
        ) : (
          <Link
            href="/login"
            className="inline-block rounded bg-teal-500 px-5 py-2 text-white font-semibold hover:bg-teal-600 transition"
          >
            Go to Login
          </Link>
        )}
      </div>
    </div>
  );
}
