import { CarouselSlide } from "@/components/custom/carousel";
import Link from "next/link";
export function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-teal-950 to-cyan-900">
      <div className="flex flex-col items-center justify-center">
        {/* Hero Section */}
        <section
          className="relative my-8 flex h-[380px] w-full max-w-[90%] items-center justify-center overflow-hidden rounded-2xl bg-cover bg-center shadow-lg"
          style={{ backgroundImage: "url('/heart_rate.png')" }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/25" />

          {/* Content */}
          <div className="relative z-10 flex max-w-3xl flex-col items-center px-6 text-center text-white">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight  text-white text-shadow-lg text-balance md:text-5xl">
              Real-time health monitoring for safer elderly care.
            </h1>

            <div className="mt-6 flex gap-4">
              <button className="rounded-lg bg-fuchsia-300 px-5 py-3 font-semibold text-black transition hover:bg-lime-400">
                Get started
              </button>
              <button className="rounded-lg border border-white/40 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20">
                Learn more
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <div className="m-auto w-full max-w-[90%] rounded-lg  px-4 py-4 shadow-lg">
          <CarouselSlide />
        </div>

        {/* How VitaTrack works */}
        <div className="m-auto mt-8 h-[400px] w-full max-w-[90%] rounded-lg bg-black">

        </div>

        {/* Footer test*/}
        <footer className="mt-20 w-full border-t border-white/10 bg-linear-to-br from-slate-950/95 via-teal-950/90 to-cyan-950/90 text-white">
          <div className="mx-auto flex w-full flex-col max-w-[90%] px-6 py-16">
            <div className="flex flex-col items-center justify-center tex-center">
              <h4 className="mb-4 font-semibold text-cyan-300">
                Get started
              </h4>
              <h2 className="text-3xl font-bold max-w-3xl tracking-tight md:text-5xl">
                Keep track of your health for a better future.
              </h2>
              <p className="mt-4">
                VitaTrack helps caregivers and residents monitor vital signs in real time with a simple and connected platform.
              </p>
              <Link href="/login">
                <button className="mt-6 bg-fuchsia-300 px-5 py-3 text-black font-bold rounded-lg transition cursor-pointer hover:bg-lime-300">
                  Get started
                </button>
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
                  <li>Health Trend</li>
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
