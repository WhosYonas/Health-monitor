import { CarouselSlide } from "@/components/custom/carousel";
import Link from "next/link";
export function LandingPage() {
  return (
    <div className="min-h-screen bg-amber-50">

      <div className="flex flex-col items-center justify-center">
        {/* Hero Section */}
        <section
          className="relative my-8 flex h-[380px] w-full max-w-[90%] items-center justify-center overflow-hidden rounded-2xl bg-cover bg-center shadow-lg bg-teal-500">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/25" />

          {/* Content */}
          <div className="relative z-10 flex max-w-3xl flex-col items-center px-6 text-center text-white">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight  text-white text-shadow-lg text-balance md:text-5xl">
              Real-time health monitoring for safer elderly care.
            </h1>

            <div className="mt-6 flex gap-4">
              <button className="rounded-lg bg-fuchsia-300 px-8 py-5 font-semibold text-black transition hover:bg-fuchsia-200 text-xl cursor-pointer">
                Get started
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <div className="m-auto w-full max-w-[90%] rounded-lg  px-4 py-4 shadow-lg bg-teal-500">
          <CarouselSlide />
        </div>

        {/* Footer test*/}
        <footer className="mt-20 w-full border-t border-white/10 bg-linear-to-br from-slate-950/95 via-teal-950/90 to-cyan-950/90 text-white">
          <div className="mx-auto flex w-full flex-col max-w-[90%] px-6 py-16">
            <div className="flex flex-col items-center justify-center tex-center">
              <h2 className="text-3xl font-bold max-w-3xl tracking-tight md:text-5xl">
                Keep track of your health for a better future.
              </h2>
              <Link href="/login">
              </Link>
            </div>

            <div className="my-12 h-[1px] w-full bg-white/10 "/>

            <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
              <div>
                <h3 className="mb-4 text-sm font-semibold text-white">Product Features</h3>
                <ul className="space-y-3 text-sm text-white/60">
                  <li>Real-time Vitals</li>
                  <li>Instant Alerts</li>
                  <li>Caregiver Dashboard</li>
                  <li>Health Trends</li>
                </ul>
              </div>
                
              <div>
                <h3 className="mb-4 text-sm font-semibold text-white">Company</h3>
                <ul className="space-y-3 text-sm text-white/60">
                  <li>About</li>
                  <li>Team</li>
                  <li>Vision</li>
                  <li>Contact</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-semibold text-white">Support</h3>
                <ul className="space-y-3 text-sm text-white/60">
                  <li>Guides</li>
                  <li>Help Center</li>
                  <li>Documentaion</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-semibold text-white">Legal</h3>
                <ul className="space-y-3 text-sm text-white/60">
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                  <li>Data Security</li>
                </ul>
              </div>
            </div>

            <div className="mt-12 border-t  gap-4 pt-6 border-white/10 flex flex-col items-center justify-between text-sm text-white/50 md:flex-row">
              <p>© 2026 VitaTrack. All rights reserved.</p>
              <div className="flex gap-4">
                <span>LinkedIn</span>
                <span>GitHub</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
