import { promises as fs } from "fs";
import path from "path";

export interface ModerationRecord {
  id: string;
  kind: string;
  risk: "low" | "medium" | "high";
  reasons: string[];
  createdAt: string;
  payload: Record<string, unknown>;
}

const queuePath = path.join(process.cwd(), "data", "moderation-queue.json");

export async function appendModerationRecord(record: Omit<ModerationRecord, "id" | "createdAt">) {
  let list: ModerationRecord[] = [];
  try {
    list = JSON.parse(await fs.readFile(queuePath, "utf8")) as ModerationRecord[];
  } catch {}

  const entry: ModerationRecord = {
    ...record,
    id: `${record.kind}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };

  list.unshift(entry);
  await fs.writeFile(queuePath, JSON.stringify(list.slice(0, 5000), null, 2), "utf8");
}

export async function readModerationQueue(): Promise<ModerationRecord[]> {
  try {
    return JSON.parse(await fs.readFile(queuePath, "utf8")) as ModerationRecord[];
  } catch {
    return [];
  }
}
