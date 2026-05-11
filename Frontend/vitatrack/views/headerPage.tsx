"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeaderPage({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 flex h-18 w-full items-center rounded-none border-b border-white/10 bg-emerald-100 px-5 backdrop-blur-md">
        {/* Logo */}
        <div className="relative flex items-center bg-emerald-200 hover:bg-white shadow-lg shadow-black rounded-sm p-1 overflow-hidden">
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
          <Link href="/">
            <h1 className="relative z-10 font-bold tracking-wide text-black">
              VitaTrack
            </h1>
          </Link>
        </div>

        {/* Desktop pill nav hidden on mobile */}
        <div className="absolute bg-emerald-200 rounded-full left-1/2 -translate-x-1/2 items-center gap-6 px-10 py-2 hidden md:flex">
          <a
            href="#about"
            className="text-xl font-semibold text-black/80 transition hover:text-white"
          >
            About
          </a>
          <a
            href="#how-it-works"
            className="text-xl font-semibold text-black/80 transition hover:text-white"
          >
            How it works
          </a>
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          <Link href="/login" className="hidden md:block">
            <Button
              variant="outline"
              className="px-5 py-3 cursor-pointer transition hover:bg-lime-300"
            >
              Log in
            </Button>
          </Link>

          {/* Hamburger only on mobile */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 transition-transform"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-6 bg-black transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-black transition-opacity ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-black transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-emerald-100 border-b border-white/10 px-6 py-4 flex flex-col gap-4">
          <a
            href="#about"
            className="text-lg font-semibold text-black/80 hover:text-emerald-600"
            onClick={() => setMenuOpen(false)}
          >
            About
          </a>
          <a
            href="#how-it-works"
            className="text-lg font-semibold text-black/80 hover:text-emerald-600"
            onClick={() => setMenuOpen(false)}
          >
            How it works
          </a>
          <Link href="/login" onClick={() => setMenuOpen(false)}>
            <Button variant="outline" className="w-full hover:bg-lime-300">
              Log in
            </Button>
          </Link>
        </div>
      )}

      <main>{children}</main>
    </>
  );
}
