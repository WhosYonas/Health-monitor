"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyPatientsThunk } from "@/communication/getPatientsCommunication";
import { PatientOverview } from "@/components/custom/patientOverview";
import type { AppDispatch } from "@/lib/store";
import Link from "next/link";

import {getTasksForCaregiver,createTaskForCaregiver, deleteTaskForCaregiver} from "@/lib/caregiverTasks";

export default function OverviewPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { patients, patientsLoading, patientsError } = useSelector(
    (state: any) => state.patientManagement,
  );

  const { user, is_authenticated } = useSelector(
    (state: any) => state.user,
  );

  //test
  console.log("user slice", { user, is_authenticated });

  const caregiverId = is_authenticated && user?.role === "caregiver"
    ? user.caregiver_id ?? null
    : null;


  const [tasks, setTasks] = useState<any[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true); 
  const [tasksError, setTasksError] = useState<string | null>(null);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [showTaskForm, setShowTaskForm] = useState(false)

  useEffect(() => {
  const loadTasks = async () => {
    if (!caregiverId) {
      // no logged-in caregiver: clear tasks and stop
      setTasks([]);
      setTasksError(null);
      setTasksLoading(false);
      setShowTaskForm(false);
      return;
    }

    try {
      setTasksLoading(true);
      setTasksError(null);
      const data = await getTasksForCaregiver(caregiverId);
      setTasks(data);
    } catch (err) {
      console.error("Failed to load tasks", err);
      setTasksError("Could not load tasks");
    } finally {
      setTasksLoading(false);
    }
  };

  loadTasks();
}, [caregiverId]);

  useEffect(() => {
    dispatch(getMyPatientsThunk());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F5F2] to-[#F4FAF8] p-5">
      <div className="mx-auto max-w-[1600px] space-y-5">

        {/* Header */}
        <header className="rounded-[8px] border border-white/40 bg-gradient-to-br from-white to-[#f5f7f8] px-4 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:px-6 sm:py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[12px] sm:text-[13px] font-medium uppercase tracking-[0.18em] text-[#6b7280]">
                VitaTrack Monitor
              </p>
              <h1 className="mt-1 text-[26px] sm:text-[32px] md:text-[35px] font-bold tracking-[-0.03em] text-[#111827]">
                Patients Overview
              </h1>
              <p className="mt-1 text-[14px] sm:text-[15px] text-[#6b7280]">
                Live patient monitoring, notifications and tasks.
              </p>
            </div>
            <div className="flex justify-start sm:justify-end">
              <Link href="/addpatient">
                <button className="rounded-2xl bg-[#00C281] px-4 py-2.5 text-sm sm:text-base font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#00a86f] hover:shadow-md hover:-translate-y-[1px]">
                  Add Patient
                </button>
              </Link>
            </div>
          </div>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[8px] border border-white/40 bg-white p-4 shadow-sm">
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#6b7280]">
              Total Patients
            </p>
            <h2 className="mt-3 text-[26px] sm:text-[30px] font-bold tracking-[-0.03em] text-[#111827]">
              {patients.length}
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">Currently monitored</p>
          </div>

          <div className="rounded-[8px] border border-white/40 bg-white p-4 shadow-sm">
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#6b7280]">
              Critical Alerts
            </p>
            <h2 className="mt-3 text-[26px] sm:text-[30px] font-bold tracking-[-0.03em] text-[#dc2626]">
              03
            </h2>
            <p className="mt-1 flex items-center gap-2 text-sm text-[#6b7280]">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600" />
              </span>
              <span>Requires immediate review</span>
            </p>
          </div>

          <div className="rounded-[8px] border border-white/40 bg-white p-4 shadow-sm">
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#6b7280]">
              Pending Tasks
            </p>
            <h2 className="mt-3 text-[26px] sm:text-[30px] font-bold tracking-[-0.03em] text-[#111827]">
              {tasks.filter((task) => task.status !== "done").length}
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">Follow-ups and notes</p>
          </div>

          <div className="rounded-[8px] border border-white/40 bg-white p-4 shadow-sm">
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#6b7280]">
              System Status
            </p>
            <h2 className="mt-3 text-[26px] sm:text-[30px] font-bold tracking-[-0.03em] text-[#00C281]">
              Stable
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">Monitoring stream active</p>
          </div>
        </section>

        {/* Main + Sidebar */}
        <div className="flex flex-col gap-5 lg:flex-row">

          {/* Patient list */}
          <section className="w-full lg:w-[70%] rounded-[8px] border border-white/35 bg-white p-4 sm:p-5 shadow-[0_12px_32px_rgba(15,23,42,0.07)]">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-[#6b7280]">
                  Patient List
                </p>
                <h2 className="mt-1 text-[22px] sm:text-[24px] md:text-[26px] font-bold tracking-[-0.03em] text-[#111827]">
                  Active Monitoring
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search patients..."
                    className="w-full min-w-[220px] rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] py-2 pl-10 pr-4 text-sm text-[#111827] outline-none transition-all duration-300 placeholder:text-[#9ca3af] focus:border-[#00C281] focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,194,129,0.10)]"
                  />
                </div>

                <div className="relative">
                  <select
                    defaultValue="priority"
                    className="w-full rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] py-2 pl-4 pr-10 text-sm font-medium text-[#6b7280] outline-none transition-all duration-300 hover:border-[#d1d5db] hover:bg-white hover:shadow-sm focus:border-[#00C281] focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,194,129,0.10)]"
                  >
                    <option value="priority">Sort by priority</option>
                    <option value="name">Sort by name</option>
                    <option value="latest">Sort by latest</option>
                  </select>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.51a.75.75 0 0 1-1.08 0l-4.25-4.51a.75.75 0 0 1 .02-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Loading / Error states */}
            {patientsLoading && (
              <p className="text-sm text-[#6b7280]">Loading patients...</p>
            )}
            {patientsError && (
              <p className="text-sm text-red-500">{patientsError}</p>
            )}

            <div className="space-y-3">
              {patients.map((patient: any) => (
                <PatientOverview key={patient.patient_id} patient={patient} />
              ))}
            </div>
          </section>

          {/* Sidebar */}
          <div className="flex w-full flex-col gap-5 lg:w-[30%]">

            {/* Notifications */}
            
            <section className="rounded-[28px] border border-white/35 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-2">
                <p className="text-[15px] font-semibold text-[#111827]">Notifications</p>
                <span className="rounded-full bg-[#00C281] px-2.5 py-1 text-[12px] font-semibold text-white">
                  2 new
                </span>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-4 transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                  <p className="text-sm font-semibold text-[#111827]">Patient 14 needs attention</p>
                  <p className="mt-1 text-sm text-[#6b7280]">Heart rate threshold exceeded 2 minutes ago.</p>
                </div>
                <div className="rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-4 transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                  <p className="text-sm font-semibold text-[#111827]">Lab update received</p>
                  <p className="mt-1 text-sm text-[#6b7280]">New blood panel data is available for review.</p>
                </div>
              </div>
            </section>


            {/* Tasks */}
            {caregiverId && (
            <section className="rounded-[28px] border border-white/35 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[15px] font-semibold text-[#111827]">Tasks</p>
                <button
                  className="flex items-center gap-1.5 rounded-xl bg-[#111827] px-3 py-1.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-[1px] hover:bg-[#1f2937] hover:shadow-sm"
                  onClick={() => setShowTaskForm((prev) => !prev)}
                >
                  {showTaskForm ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      Cancel
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add task
                    </>
                  )}
                </button>
              </div>

              {/* new task form */}
              {showTaskForm && (
                <div className="mb-5 flex flex-col gap-2 rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280]">New task</p>
                  <input
                    type="text"
                    placeholder="Task title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full rounded-xl border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#111827] outline-none transition-all duration-300 placeholder:text-[#9ca3af] focus:border-[#00C281] focus:shadow-[0_0_0_3px_rgba(0,194,129,0.10)]"
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    className="w-full rounded-xl border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#111827] outline-none transition-all duration-300 placeholder:text-[#9ca3af] focus:border-[#00C281] focus:shadow-[0_0_0_3px_rgba(0,194,129,0.10)]"
                  />
                  <button
                    className="self-end whitespace-nowrap rounded-xl bg-[#111827] px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-[1px] hover:bg-[#1f2937] hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!newTaskTitle.trim()}
                    onClick={async () => {
                      if (!caregiverId) return;
                      try {
                        setTasksError(null);
                        await createTaskForCaregiver(caregiverId, {
                          title: newTaskTitle.trim(),
                          description: newTaskDescription.trim() || undefined,
                        });
                        setNewTaskTitle("");
                        setNewTaskDescription("");
                        setShowTaskForm(false);
                        const updated = await getTasksForCaregiver(caregiverId);
                        setTasks(updated);
                      } catch (err) {
                        console.error("Failed to create task", err);
                        setTasksError("Could not create task");
                      }
                    }}
                  >
                    Save task
                  </button>
                </div>
              )}

              {tasksLoading && <p className="text-sm text-[#6b7280]">Loading tasks...</p>}
              {tasksError && <p className="text-sm text-red-500">{tasksError}</p>}

              {!tasksLoading && !tasksError && tasks.length === 0 && (
                <p className="text-sm text-[#6b7280]">No tasks yet. Create a task to get started.</p>
              )}

              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-4 text-sm text-[#374151] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-[#111827]">{task.title}</p>
                        {task.description && (
                          <p className="mt-1 text-xs sm:text-sm text-[#6b7280]">{task.description}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="rounded-full bg-[#e5e7eb] px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-[#6b7280]">
                          {task.status ?? "open"}
                        </span>
                        <button
                          aria-label="Remove task"
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#9ca3af] transition-all duration-200 hover:bg-red-50 hover:text-red-500"
                          onClick={async () => {
                            if (!caregiverId) return;
                            try {
                              await deleteTaskForCaregiver(caregiverId, task.id);
                              setTasks((prev) => prev.filter((t) => t.id !== task.id));
                            } catch (err) {
                              console.error("Failed to delete task", err);
                              setTasksError("Could not delete task");
                            }
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            )}

            {/* Status banner */}
            <section className="rounded-[28px] border border-white/35 bg-gradient-to-br from-[#00C281] to-[#00a86f] p-5 shadow-[0_12px_32px_rgba(0,194,129,0.25)]">
              <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-white/70">
                Monitoring Status
              </p>
              <h3 className="mt-2 text-[26px] font-bold tracking-[-0.03em] text-white">
                All systems online
              </h3>
              <p className="mt-2 max-w-[28ch] text-sm text-white/90">
                Streams are stable and patient telemetry is syncing normally.
              </p>
              <div className="mt-5 flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-white" />
                <span className="text-sm font-medium text-white">Connected to live feed</span>
              </div>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
}