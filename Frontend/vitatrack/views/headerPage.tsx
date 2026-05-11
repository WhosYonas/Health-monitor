"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type HeaderPageProps = {
  name: string | null | undefined;
  loading: boolean;
  children: React.ReactNode;
  onLogout?: () => void;
};

export function HeaderPage({
  name,
  loading,
  children,
  onLogout,
}: HeaderPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <nav className="sticky top-0 z-50 flex h-18 w-full items-center rounded-none border-b border-black/10 bg-emerald-100 px-5 backdrop-blur-md">
        {/* Logo */}
        <div className="relative flex items-center bg-emerald-200 hover:bg-white shadow-lg shadow-black rounded-sm p-1 overflow-hidden transition-colors">
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
            <h1 className="relative z-10 font-bold tracking-wide text-black">
              VitaTrack
            </h1>
          </Link>
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          {loading ? (
            <span className="text-black/40 animate-pulse text-sm">
              Loading…
            </span>
          ) : name ? (
            <>
              <span className="text-emerald-800 font-medium hidden md:block">
                Hello, {name}!
              </span>
              <Button
                variant="destructive"
                onClick={onLogout}
                className="px-5 py-3 cursor-pointer transition hover:bg-red-300 hidden md:inline-flex"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/login" className="hidden md:block">
              <Button
                variant="outline"
                className="px-5 py-3 cursor-pointer transition hover:bg-lime-300"
              >
                Log in
              </Button>
            </Link>
          )}
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
