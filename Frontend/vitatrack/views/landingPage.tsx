import { CarouselSlide } from "@/components/custom/carousel";

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
        <div className="m-auto mt-8 h-[400px] w-full max-w-[90%] rounded-lg bg-black" />
      </div>
    </div>
  );
}
