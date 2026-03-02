import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Dashboard Page Not Found</h1>
        <p className="text-gray-500 mt-2">
          The page you are trying to access does not exist inside dashboard.
        </p>

        <Link
          href="/dashboard"
          className="inline-block mt-6 px-5 py-3 rounded-lg bg-black text-white"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}