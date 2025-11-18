import type { Summary, Task } from "@/types/task";
import type { Submission } from "@/types/submission";

const BASE_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function fetchSummary(): Promise<Summary> {
  return fetchJson<Summary>("/summary");
}

export async function fetchTasks(): Promise<Task[]> {
  return fetchJson<Task[]>("/tasks");
}

export async function fetchSubmissions(): Promise<Submission[]> {
  return fetchJson<Submission[]>("/submissions");
}
