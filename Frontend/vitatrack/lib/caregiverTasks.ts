import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
  deleteDoc, 
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const caregiverTasksCollection = (caregiverId: number | string) =>
  collection(db, "caregivers", String(caregiverId), "tasks");

// Create a new task for a caregiver
export async function createTaskForCaregiver(
  caregiverId: number | string,
  data: {
    title: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    patient_id?: number | null;
    dueAt?: Date | null;
  }
) {
  const colRef = caregiverTasksCollection(caregiverId);

  const docRef = await addDoc(colRef, {
    title: data.title,
    description: data.description ?? "",
    status: "open",
    priority: data.priority ?? "medium",
    patient_id: data.patient_id ?? null,
    due_at: data.dueAt ?? null,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });

  return docRef.id;
}

// Get all tasks for a caregiver
export async function getTasksForCaregiver(caregiverId: number | string) {
  const colRef = caregiverTasksCollection(caregiverId);
  const q = query(colRef, orderBy("created_at", "desc"));

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Update status (e.g. mark as done)
export async function updateTaskStatus(
  caregiverId: number | string,
  taskId: string,
  status: "open" | "in_progress" | "done"
) {
  const taskRef = doc(db, "caregivers", String(caregiverId), "tasks", taskId);

  await updateDoc(taskRef, {
    status,
    updated_at: serverTimestamp(),
  });
}

export async function deleteTaskForCaregiver(
  caregiverId: number | string,
  taskId: string
) {
  const taskRef = doc(db, "caregivers", String(caregiverId), "tasks", taskId);
  await deleteDoc(taskRef);
}