import { featureCard } from "@/components/custom/featureCard";
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
        <div className="flex bg-teal-950 w-full p-10 justify-center">
            <div className="flex flex-row space-x-5">
                {featureCard("Real-Time Vitals", "Always stay up-to-date on your patients' health", "patient.jpg", "time-icon.png", "#vitals")}
                {featureCard("Instant Alerts", "Get notified immediately and help your patients as soon as possible" ,"alert.jpg", "alert-icon.png", "#alerts")}
                {featureCard("Caregiver Dashboard", "Easily access information and get an overview of your facility", "dashboard.jpg", "dashboard-icon.png", "#dashboard")}
                {featureCard("Health Trends", "Track how your patients' health develops over time", "trends.jpg", "trends-icon.png", "#trends")}
            </div>
        </div>

        {/*Our goal*/}
        <div className="flex flex-col w-full my-4 px-20">
          <h1 className="w-full text-center text-5xl font-bold p-5">babbabababab</h1>
          <div className="grid grid-cols-3 w-full">
            <div>
              <h1 className="text-center text-3xl font-semibold">Comfort</h1>
              <h1 className="text-center text-2xl mx-20 my-5">
                Creating a product that is easy to wear day-round so that patients aren't burdened by it.
              </h1>
            </div>
            <div>
              <h1 className="text-center text-3xl font-semibold">Ease of use</h1>
              <h1 className="text-center text-2xl mx-20 my-5">
                Designing our application to be as simple and easy to use as possible so that caregivers will easily be able to access what they need.
              </h1>
            </div>
            <div>
              <h1 className="text-center text-3xl font-semibold">Affordability</h1>
              <h1 className="text-center text-2xl mx-20 my-5">
                Keeping the cost low while retaining high quality sensors so that elder care facilities can keep track of their patients without breaking their budget.
              </h1>
            </div>
          </div>
        </div>


        {/* About the product */}
        <div className="flex flex-col w-full space-y-5 p-3 bg-teal-950">
          <div id="vitals" className="flex flex-row w-full h-90">
            <div className="w-[90%] h-full bg-teal-800">
              <div className="flex flex-row w-full h-full">
                <div className="w-[60%] px-5">
                  <h1 className="text-center text-3xl text-white font-bold p-3 font-semibold">Real-Time Vitals</h1>
                  <h1 className="text-white text-2xl p-5">
                  While patients are wearing the VitaTrack device their temperature, pulse and blood oxygen level is being constantly measured. This data is sent to the
                  application where caregivers bababababababb
                  </h1>
                </div>
                <div className="flex w-[40%] h-full justify-center items-center">
                  <div className="bg-[url(/vitalspreview.png)] bg-cover w-[90%] h-[90%] rounded-lg overflow-hidden">
                    <div className="bg-teal-800/50 h-full w-full mix-blend-multiply"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[10%] h-full"></div>
          </div>

          <div id="alerts" className="flex flex-row w-full h-90">
            <div className="w-[10%] h-full"></div>
            <div className="w-[90%] h-full bg-teal-800">
              <div className="flex flex-row w-full h-full">
                <div className="flex w-[40%] h-full justify-center items-center">
                  <div className="bg-[url(/vitalspreview.png)] bg-cover w-[90%] h-[90%] rounded-lg overflow-hidden">
                    <div className="bg-teal-800/50 h-full w-full mix-blend-multiply"></div>
                  </div>
                </div>

                <div className="w-[60%] px-5">
                  <h1 className="text-center text-3xl text-white font-bold p-3 font-semibold">Instant Alerts</h1>
                  <h1 className="text-white text-xl">
                  texttext text text text text text text text text texttext text texttexttext text text text text texttext texttext texttexttexttext text text text  
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full space-y-5 p-3 bg-teal-950">
          <div id="dashboard" className="flex flex-row w-full h-90">
            <div className="w-[90%] h-full bg-teal-800">
              <div className="flex flex-row w-full h-full">
                <div className="w-[60%] px-5">
                  <h1 className="text-center text-3xl text-white font-bold p-3 font-semibold">Caregiver Dashboard</h1>
                  <h1 className="text-white text-2xl p-5">
                  texttext text text text text text text text text texttext text texttexttext text text text text texttext texttext texttexttexttext text text text  
                  </h1>
                </div>
                <div className="flex w-[40%] h-full justify-center items-center">
                  <div className="bg-[url(/vitalspreview.png)] bg-cover w-[90%] h-[90%] rounded-lg overflow-hidden">
                    <div className="bg-teal-800/50 h-full w-full mix-blend-multiply"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[10%] h-full"></div>
          </div>

          <div id="trends" className="flex flex-row w-full h-90">
            <div className="w-[10%] h-full"></div>
            <div className="w-[90%] h-full bg-teal-800">
              <div className="flex flex-row w-full h-full">
                <div className="flex w-[40%] h-full justify-center items-center">
                  <div className="bg-[url(/vitalspreview.png)] bg-cover w-[90%] h-[90%] rounded-lg overflow-hidden">
                    <div className="bg-teal-800/50 h-full w-full mix-blend-multiply"></div>
                  </div>
                </div>

                <div className="w-[60%] px-5">
                  <h1 className="text-center text-3xl text-white font-bold p-3 font-semibold">Health Trends</h1>
                  <h1 className="text-white text-xl">
                  texttext text text text text text text text text texttext text texttexttext text text text text texttext texttext texttexttexttext text text text  
                  </h1>
                </div>
              </div>
            </div>
          </div>

          

          </div>
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
