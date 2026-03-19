"use client";

import Header from "./dashboard/_components/layout/userheader";
import Footer from "./dashboard/_components/layout/userfooter";

export default function PrivateLayout({ children }) {

  return (
    <>
      {/* DESKTOP BLOCK SCREEN */}
      <main className="hidden lg:flex items-center justify-center min-h-screen bg-[#000c3d] text-white relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute w-175 h-175 bg-primary-600/20 blur-[180px] rounded-full -top-40 -left-40" />
        <div className="absolute w-150 h-150 bg-primary-400/20 blur-[180px] rounded-full bottom-0 right-0" />

        {/* Card */}
        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12 max-w-2xl text-center shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
          
          <div className="flex justify-center mb-8">
            <div className="relative w-40 h-72 rounded-[2.5rem] border border-white/20 bg-linear-to-b from-primary-800 to-primary-950 shadow-2xl">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black/70 rounded-full" />
              <div className="absolute inset-3 rounded-4xl bg-linear-to-b from-primary-600/30 via-transparent to-transparent" />
              <span className="absolute bottom-6 left-1/2 -translate-x-1/2 w-3 h-3 bg-green-400 rounded-full animate-ping" />
              <span className="absolute bottom-6 left-1/2 -translate-x-1/2 w-3 h-3 bg-green-400 rounded-full" />
            </div>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">
            Mobile Experience Only
          </h1>

          <p className="mt-4 text-white/70 leading-relaxed max-w-md mx-auto">
            This platform is optimized for mobile interaction to ensure speed,
            security and seamless navigation. Please continue on your smartphone.
          </p>

          <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="space-y-2 text-sm text-white/60">
            <p>Open this link on your mobile device</p>
          </div>

        </div>
      </main>

      {/* MOBILE APP */}
      <main className="block lg:hidden min-h-screen bg-linear-to-b from-primary-1200 via-primary-950 to-primary-1200">
        
        <header className="fixed top-0 w-full z-50">
          <Header />
        </header>

        <div className="min-h-screen overflow-y-auto mt-14">
          {children}
        </div>

        <footer className="fixed bottom-0 w-full z-50">
          <Footer />
        </footer>

      </main>
    </>
  );
}
