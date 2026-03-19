export default function Loading() {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-primary-1100">

      <div className="flex flex-col items-center gap-10">

        {/* Premium Orb Loader */}
        <div className="relative flex items-center justify-center">

          {/* Gradient Glow */}
          <div className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-primary-200 via-primary-100 to-transparent blur-xl opacity-70 animate-pulse"></div>

          {/* Outer Ring */}
          <div className="absolute w-20 h-20 rounded-full border-4 border-primary-100"></div>

          {/* Spinner */}
          <div className="w-20 h-20 rounded-full border-4 border-gray-200 border-t-primary-500 animate-spin"></div>

        </div>

        {/* Branding */}
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold tracking-wide text-primary-800">
            Xenra
          </h1>

          <p className="text-sm text-gray-500 animate-pulse">
            Preparing your experience
          </p>
        </div>

        {/* Premium Progress Bar */}
        <div className="relative w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-400 animate-loading-bar rounded-full"></div>
        </div>

      </div>

    </div>
  );
}
