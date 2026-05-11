import Link from "next/link";
import { featureCard } from "@/components/custom/featureCard";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-28">
        {/* decorative circles */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-emerald-100/60" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-teal-100/50" />

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <span className="mb-5 inline-block rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-medium tracking-widest text-emerald-700 uppercase">
            Health Monitoring Platform
          </span>
          <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight text-slate-900 md:text-6xl">
            Real-time care,
            <br />
            <span className="text-emerald-600">without the guesswork.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-500">
            VitaTrack delivers continuous vital monitoring so caregivers can
            respond faster, patients stay safer, and nothing falls through the
            cracks.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="rounded-full bg-emerald-600 px-8 py-3 text-base font-medium text-white shadow-sm transition hover:bg-emerald-700"
            >
              Get started
            </Link>
            <a
              href="#vitals"
              className="rounded-full border border-slate-200 bg-white px-8 py-3 text-base font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              See features
            </a>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="border-y border-slate-100 bg-slate-50 py-6">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-10 px-6 text-sm font-medium text-slate-400">
          <span>ESP32-powered hardware</span>
          <span className="text-slate-200">|</span>
          <span>Encrypted MQTT transport</span>
          <span className="text-slate-200">|</span>
          <span>24 / 7 real-time stream</span>
        </div>
      </div>

      {/* Feature cards */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Everything you need in one place
          </h2>
          <p className="mt-3 text-slate-500">
            Four core pillars that keep your facility running smoothly.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Real-Time Vitals",
              desc: "Continuous temperature, pulse, and SpO₂ — always up to date.",
              href: "#vitals",
            },
            {
              title: "Instant Alerts",
              desc: "Push notifications the moment any value leaves safe bounds.",
              href: "#alerts",
            },
            {
              title: "Caregiver Dashboard",
              desc: "One-screen overview of your entire facility's status.",
              href: "#dashboard",
            },
            {
              title: "Health Trends",
              desc: "Longitudinal charts to spot patterns before they become problems.",
              href: "#trends",
            },
          ].map((f) => (
            <a
              key={f.title}
              href={f.href}
              className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
            >
              <h3 className="font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {f.desc}
              </p>
              <span className="mt-4 inline-block text-xs font-medium text-emerald-600 transition group-hover:underline">
                Learn more
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Our goal */}
      <section className="bg-emerald-600 py-24 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-14 text-center text-3xl font-bold tracking-tight">
            Designed around three promises
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                heading: "Comfort",
                body: "A device light enough to wear all day so patients never feel burdened, adherence shouldn't require effort.",
              },
              {
                heading: "Ease of use",
                body: "An interface simple enough that any caregiver can find what they need in seconds, even under pressure.",
              },
              {
                heading: "Affordability",
                body: "High-quality sensors at a price that won't strain a facility's budget, better care for more patients.",
              },
            ].map((p) => (
              <div
                key={p.heading}
                className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm"
              >
                <h3 className="mb-3 text-xl font-semibold">{p.heading}</h3>
                <p className="text-sm leading-relaxed text-white/75">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product detail rows */}
      <section className="mx-auto max-w-6xl space-y-24 px-6 py-28">
        {/* Vitals */}
        <div
          id="vitals"
          className="flex flex-col items-center gap-12 md:flex-row"
        >
          <div className="flex-1">
            <span className="mb-3 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              Feature 01
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Real-Time Vitals
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-500">
              While patients wear the VitaTrack wristband, their core
              temperature, heart rate, and blood-oxygen saturation are measured
              continuously. Readings flow to the dashboard in under a second,
              caregivers always see the current state, never a stale snapshot.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> Sub-second update
                latency
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> MAX30102 pulse-ox
                sensor
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> DS18B20 precision
                thermometer
              </li>
            </ul>
          </div>
          <div className="w-full flex-1 overflow-hidden rounded-2xl bg-slate-100 md:w-auto">
            <div
              className="h-72 w-full bg-cover bg-center"
              style={{ backgroundImage: "url(/vitalspreview.png)" }}
            />
          </div>
        </div>

        {/* Alerts */}
        <div
          id="alerts"
          className="flex flex-col-reverse items-center gap-12 md:flex-row"
        >
          <div className="w-full flex-1 overflow-hidden rounded-2xl bg-slate-100 md:w-auto">
            <div
              className="h-72 w-full bg-cover bg-center"
              style={{ backgroundImage: "url(/alert.jpg)" }}
            />
          </div>
          <div className="flex-1">
            <span className="mb-3 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              Feature 02
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Instant Alerts
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-500">
              The moment a vital strays outside safe thresholds, the right
              caregiver is notified by push alert. No polling, no delays, no
              missed emergencies.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> Configurable
                per-patient thresholds
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> Multi-device push
                delivery
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> Full alert history
                log
              </li>
            </ul>
          </div>
        </div>

        {/* Dashboard */}
        <div
          id="dashboard"
          className="flex flex-col items-center gap-12 md:flex-row"
        >
          <div className="flex-1">
            <span className="mb-3 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              Feature 03
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Caregiver Dashboard
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-500">
              A single screen gives nurses and managers a live overview of every
              monitored patient. Sort by risk level, filter by ward, and drill
              into any individual with one tap.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> Whole-facility
                patient grid
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> Risk-level colour
                coding
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> Role-based access
                control
              </li>
            </ul>
          </div>
          <div className="w-full flex-1 overflow-hidden rounded-2xl bg-slate-100 md:w-auto">
            <div
              className="h-72 w-full bg-cover bg-center"
              style={{ backgroundImage: "url(/dashboard.jpg)" }}
            />
          </div>
        </div>

        {/* Trends */}
        <div
          id="trends"
          className="flex flex-col-reverse items-center gap-12 md:flex-row"
        >
          <div className="w-full flex-1 overflow-hidden rounded-2xl bg-slate-100 md:w-auto">
            <div
              className="h-72 w-full bg-cover bg-center"
              style={{ backgroundImage: "url(/trends.jpg)" }}
            />
          </div>
          <div className="flex-1">
            <span className="mb-3 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              Feature 04
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Health Trends
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-500">
              Long-term charts surface gradual shifts that spot-checks miss.
              Track how a patient's baseline evolves over days, weeks, or months
              and share exportable summaries with physicians.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> Adjustable
                time-range view
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> Baseline & anomaly
                annotation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> PDF / CSV export
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="mx-6 mb-24 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 px-8 py-20 text-center text-white">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Keep track of your health for a better future.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-white/75">
          Join care facilities that have already moved to continuous,
          data-driven patient monitoring.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-block rounded-full bg-white px-9 py-3 text-base font-semibold text-emerald-700 transition hover:bg-emerald-50"
        >
          Get started for free
        </Link>
      </section>

      {/*  Footer */}
      <footer className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-12 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="text-xl font-semibold text-slate-900">
                Vita<span className="text-emerald-600">Track</span>
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Real-time health monitoring for safer elderly care.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 border-t border-slate-200 pt-10 md:grid-cols-4">
            {[
              {
                heading: "Product",
                links: [
                  "Real-time Vitals",
                  "Instant Alerts",
                  "Caregiver Dashboard",
                  "Health Trends",
                ],
              },
              {
                heading: "Company",
                links: ["About", "Team", "Vision", "Contact"],
              },
              {
                heading: "Support",
                links: ["Guides", "Help Center", "Documentation"],
              },
              {
                heading: "Legal",
                links: ["Privacy Policy", "Terms of Service", "Data Security"],
              },
            ].map((col) => (
              <div key={col.heading}>
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-900">
                  {col.heading}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-sm text-slate-500 transition hover:text-slate-900"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-400 md:flex-row">
            <p>© 2026 VitaTrack. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="transition hover:text-slate-700">
                LinkedIn
              </a>
              <a href="#" className="transition hover:text-slate-700">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
