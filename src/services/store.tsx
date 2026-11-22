import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Database, Role } from "../types";
import { seed } from "../data/seed";
const key = "cn-ready-demo-v1";
export function restore(raw: string | null): Database {
  try {
    const db = JSON.parse(raw || "null") as Database;
    if (!db || db.version !== 1) return seed();
    const base = seed();
    for (const k of [
      "scholars",
      "outreach",
      "activities",
      "participation",
      "evaluations",
      "logs",
      "assignments",
    ] as const) {
      if (!Array.isArray(db[k])) return base;
      const example = base[k][0];
      if (
        db[k].some(
          (r) =>
            !r ||
            Object.entries(example).some(
              ([field, v]) =>
                typeof (r as unknown as Record<string, unknown>)[field] !==
                typeof v,
            ),
        )
      )
        return base;
      if (new Set(db[k].map((r) => r.id)).size !== db[k].length) return base;
    }
    const ids = new Set(db.scholars.map((s) => s.id)),
      activities = new Set(db.activities.map((s) => s.id));
    if (
      [
        ...db.evaluations,
        ...db.logs,
        ...db.assignments,
        ...db.participation,
      ].some((r) => !ids.has(r.scholarId)) ||
      db.participation.some((p) => !activities.has(p.activityId)) ||
      db.evaluations.some(
        (e) =>
          !Array.isArray(e.scores) ||
          e.scores.length !== 3 ||
          e.scores.some((n) => typeof n !== "number" || n < 1 || n > 5),
      )
    )
      return base;
    return db;
  } catch {
    return seed();
  }
}
interface Store {
  db: Database;
  update: (f: (d: Database) => Database) => void;
  reset: () => void;
  role: Role;
  setRole: (r: Role) => void;
  toast: string;
  notify: (s: string) => void;
  storageError: string;
}
const Context = createContext<Store | null>(null);
export function Provider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState(() => {
    try {
      return restore(localStorage.getItem(key));
    } catch {
      return seed();
    }
  });
  const [role, setRole] = useState<Role>("Program Administrator");
  const [toast, setToast] = useState("");
  const [storageError, setStorageError] = useState("");
  function notify(s: string) {
    setToast(s);
    setTimeout(() => setToast(""), 3500);
  }
  function update(f: (d: Database) => Database) {
    setDb((old) => {
      const next = f(old);
      try {
        localStorage.setItem(key, JSON.stringify(next));
        setStorageError("");
      } catch {
        setStorageError(
          "Browser storage is unavailable or full. Changes are kept for this session only.",
        );
      }
      return next;
    });
    notify("Changes saved");
  }
  return (
    <Context.Provider
      value={{
        db,
        update,
        reset: () => update(() => seed()),
        role,
        setRole,
        toast,
        notify,
        storageError,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useStore() {
  const c = useContext(Context);
  if (!c) throw Error("Missing data provider");
  return c;
}
