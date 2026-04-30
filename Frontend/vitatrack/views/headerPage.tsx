import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeaderPage({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="sticky top-0 z-50 flex h-18 w-full items-center rounded-none border-b border-white/30 bg-gradient-to-r from-[#1f2933] via-[#1b2530] to-[#1a262f] px-5 backdrop-blur-md shadow-[0_10px_30px_rgba(15,23,42,0.45)]">
        <div className="relative flex items-center overflow-hidden rounded-xl border border-white/25 bg-gradient-to-br from-[#e4ebf1] via-[#d5dde4] to-[#c8d1da] px-3 py-2 shadow-[0_6px_18px_rgba(15,23,42,0.35)]">
          {/* ECG/Pulse SVG background */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-45"
            viewBox="0 0 120 40"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline
              points="0,20 15,20 20,5 25,35 30,20 40,20 45,12 50,28 55,20 70,20 75,2 80,38 85,20 100,20 105,14 110,26 115,20 120,20"
              fill="none"
              stroke="#2f6f73"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <Link href="/">
            <h1 className="relative z-10 text-[18px] font-semibold tracking-[0.18em] uppercase text-[#1f2933]">
              VitaTrack
            </h1>
          </Link>
        </div>

        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-6">
          <a
            href="#about"
            className="text-[15px] font-medium text-slate-100/80 transition-colors hover:text-white"
          >
            About
          </a>
          <a
            href="#how-it-works"
            className="text-[15px] font-medium text-slate-100/80 transition-colors hover:text-[#2dd4bf]"
          >
            How it works
          </a>
        </div>

        <Link href="/login" className="ml-auto">
          <Button
            variant="outline"
            className="border-[#4b5a64] bg-transparent px-5 py-3 text-[14px] font-medium text-slate-100 hover:bg-[#2f6f73] hover:border-[#2f6f73] hover:text-white cursor-pointer transition-colors"
          >
            Log in
          </Button>
        </Link>
      </nav>

      {/* Page content renders here */}
      <main>{children}</main>
    </>
  );
}
