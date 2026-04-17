import { Button } from "@/components/ui/button";
import Link from "next/link";
export function HeaderPage({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="sticky top-0 z-50 flex h-18 w-full items-center rounded-none border-b border-white/10 bg-linear-to-r from-slate-950/90 via-teal-950/85 to-cyan-950/80 px-5 backdrop-blur-md">
        <div className="relative flex items-center bg-lime-400 shadow-lg shadow-cyan-500/50 rounded-sm p-1 overflow-hidden">
          {/* ECG/Pulse SVG background */}
          <svg
            className="absolute inset-0 w-full h-full opacity-50"
            viewBox="0 0 120 40"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline
              points="0,20 15,20 20,5 25,35 30,20 40,20 45,12 50,28 55,20 70,20 75,2 80,38 85,20 100,20 105,14 110,26 115,20 120,20"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <h1 className="relative z-10 font-bold tracking-wide text-black">
            VitaTrack
          </h1>
        </div>

        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-6">
          <a href="#about" className="text-xl font-semibold text-white/80 transition hover:text-white">
            About
          </a>
          <a href="#how-it-works" className="text-xl font-semibold text-white/80 transition hover:text-cyan-300">
            How it works
          </a>
        </div>
        <Link href="/login" className="ml-auto" >

          <Button variant="outline">
          Log in
          </Button>
        </Link>
        
      </nav>

      {/* Page content renders here */}
      <main>{children}</main>
    </>
  );
}
