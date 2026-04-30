import { PatientOverview } from "@/components/custom/patientOverview";
import Link from "next/link";


export function OverviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8eef2] via-[#dde4e9] to-[#d5dfe5] p-5">
      <div className="mx-auto max-w-[1600px] space-y-5">
        <header className="rounded-[8px] border border-white/60 bg-gradient-to-br from-[#f5f7fa] via-white to-[#edf1f5] px-6 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-[#00a86f]">
                VitaTrack Monitor
              </p>
              <h1 className="mt-1 text-[35px] font-bold tracking-[-0.03em] text-[#1a2632]">
                Patients Overview
              </h1>
              <p className="mt-1 text-[15px] text-[#4a5968]">
                Live patient monitoring, notifications and tasks.
              </p>
            </div>
            <Link href="/addpatient">
              <button className="rounded-2xl bg-gradient-to-br from-[#00C281] via-[#00b575] to-[#00a86f] px-5 py-3 font-semibold text-white shadow-[0_6px_20px_rgba(0,194,129,0.3)] transition-all duration-300 hover:shadow-[0_8px_25px_rgba(0,194,129,0.4)] hover:-translate-y-[2px]">
                Add Patinet
              </button>
            </Link>
          </div>
        </header>
        {/* General statistics section */}
        <section className="grid grid-cols-4 gap-4">
          <div className="rounded-[8px] border border-white/50 bg-gradient-to-br from-[#f8fafb] to-[#e8f0f5] p-4 shadow-[0_4px_16px_rgba(15,23,42,0.08)]">
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#5a7a8f]">
              Total Patients
            </p>
            <h2 className="mt-3 text-[30px] font-bold tracking-[-0.03em] text-[#1e3a4c]">
              24
            </h2>
            <p className="text-[#4a5968]">Currently monitored</p>
          </div>


          <div className="rounded-[8px] border border-white/50 bg-gradient-to-br from-[#faf8f8] to-[#f5e8e8] p-4 shadow-[0_4px_16px_rgba(220,38,38,0.08)]">
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#c75252]">
              Critical Alerts
            </p>
            <h2 className="mt-3 text-[30px] font-bold tracking-[-0.03em] text-[#a83636]">
              03
            </h2>
            <p className="mt-1 flex items-center gap-2 text-sm text-[#4a5968]">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600" />
              </span>
              <span>Requires immediate review</span>
            </p>
          </div>


          <div className="rounded-[8px] border border-white/50 bg-gradient-to-br from-[#faf9f7] to-[#f5f0e8] p-4 shadow-[0_4px_16px_rgba(217,119,6,0.08)]">
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#b8862f]">
              Pending Tasks
            </p>
            <h2 className="mt-3 text-[30px] font-bold tracking-[-0.03em] text-[#8f6824]">
              08
            </h2>
            <p className="mt-1 text-sm text-[#4a5968]">Follow-ups and notes</p>
          </div>


          <div className="rounded-[8px] border border-white/50 bg-gradient-to-br from-[#f7faf9] to-[#e8f5f0] p-4 shadow-[0_4px_16px_rgba(0,194,129,0.08)]">
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#4d9b7a]">
              System Status
            </p>
            <h2 className="mt-3 text-[30px] font-bold tracking-[-0.03em] text-[#00a86f]">
              Stable
            </h2>
            <p className="mt-1 text-sm text-[#4a5968]">
              Monitoring stream active
            </p>
          </div>
        </section>
        <div className="flex gap-5">
          {/* List of patients section */}
          <section className="w-[70%] rounded-[8px] border border-white/60 bg-gradient-to-br from-white/95 via-[#fafbfc] to-[#f3f6f8] backdrop-blur-sm p-5 shadow-[0_12px_32px_rgba(15,23,42,0.12)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-[#00a86f]">
                  Patient List
                </p>
                <h2 className="mt-1 text-[26px] font-bold tracking-[-0.03em] text-[#1a2632]">
                  Active Monitoring
                </h2>
              </div>


              <div className="rounded-2xl border border-[#d5dfe5] bg-gradient-to-r from-[#f5f7fa] to-[#edf1f5] px-4 py-2 text-sm font-medium text-[#3d4f5e] shadow-inner">
                Sorted by priority
              </div>
            </div>


            <div className="space-y-3">
              {PatientOverview()}
              {PatientOverview()}
              {PatientOverview()}
              {PatientOverview()}
              {PatientOverview()}
              {PatientOverview()}
              {PatientOverview()}
              {PatientOverview()}
              {PatientOverview()}
              {PatientOverview()}
            </div>
          </section>
          {/* Sidebar section  */}
          <div className="flex w-[30%] flex-col gap-5">
            {/* Notification section */}
            <section className="rounded-[28px] border border-white/60 bg-gradient-to-br from-white/90 to-[#f8fafb] backdrop-blur-sm p-5 shadow-[0_8px_24px_rgba(15,23,42,0.1)]">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[15px] font-semibold text-[#1a2632]">
                  Notifications
                </p>
                <span className="rounded-full bg-gradient-to-r from-[#00C281] to-[#00a86f] px-2.5 py-1 text-[12px] font-semibold text-white shadow-[0_4px_12px_rgba(0,194,129,0.25)]">
                  2 new
                </span>
              </div>


              <div className="space-y-3">
                <div className="rounded-2xl border border-[#e8d8d8] bg-gradient-to-br from-[#fcfafa] to-[#f5eded] p-4 shadow-sm transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_8px_20px_rgba(15,23,42,0.1)]">
                  <p className="text-sm font-semibold text-[#2d1e1e]">
                    Patient 14 needs attention
                  </p>
                  <p className="mt-1 text-sm text-[#5a4a4a]">
                    Heart rate threshold exceeded 2 minutes ago.
                  </p>
                </div>


                <div className="rounded-2xl border border-[#d8e5ed] bg-gradient-to-br from-[#fafcfd] to-[#f0f6fa] p-4 shadow-sm transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_8px_20px_rgba(15,23,42,0.1)]">
                  <p className="text-sm font-semibold text-[#1e2d3a]">
                    Lab update received
                  </p>
                  <p className="mt-1 text-sm text-[#4a5968]">
                    New blood panel data is available for review.
                  </p>
                </div>
              </div>
            </section>
            {/* Tasks section */}
            <section className="rounded-[28px] border border-white/60 bg-gradient-to-br from-white/90 to-[#f8fafb] backdrop-blur-sm p-5 shadow-[0_8px_24px_rgba(15,23,42,0.1)]">
              <div className="mb-4">
                <p className="text-[15px] font-semibold text-[#1a2632]">
                  Tasks
                </p>
              </div>


              <div className="space-y-3">
                <div className="rounded-2xl border border-[#e0e8ed] bg-gradient-to-br from-[#fafbfc] to-[#f2f5f8] p-4 text-sm text-[#2d3a45] shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(15,23,42,0.1)]">
                  Review three flagged patients before 14:00.
                </div>
                <div className="rounded-2xl border border-[#e0e8ed] bg-gradient-to-br from-[#fafbfc] to-[#f2f5f8] p-4 text-sm text-[#2d3a45] shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(15,23,42,0.1)]">
                  Confirm medication updates for Room 12.
                </div>
                <div className="rounded-2xl border border-[#e0e8ed] bg-gradient-to-br from-[#fafbfc] to-[#f2f5f8] p-4 text-sm text-[#2d3a45] shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(15,23,42,0.1)]">
                  Complete handoff notes for evening shift.
                </div>
              </div>
            </section>


            <section className="rounded-[28px] border border-white/30 bg-gradient-to-br from-[#2a3f47] via-[#1e3238] to-[#1a2b31] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
              <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-[#8fb4c3]">
                Monitoring Status
              </p>
              <h3 className="mt-2 text-[26px] font-bold tracking-[-0.03em] text-white">
                All systems online
              </h3>
              <p className="mt-2 max-w-[28ch] text-sm text-[#b8d4e0]">
                Streams are stable and patient telemetry is syncing normally.
              </p>


              <div className="mt-5 flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-[#00C281] shadow-[0_0_12px_rgba(0,194,129,0.6)] animate-pulse" />
                <span className="text-sm font-medium text-[#c5dbe6]">
                  Connected to live feed
                </span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}