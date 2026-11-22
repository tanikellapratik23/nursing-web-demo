import type { Database, Filters, Evaluation, Scholar } from "../types";
export const average = (a: number[]) =>
  a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
export const score = (e: Evaluation) => average(e.scores);
export function inPeriod(date: string, f: Pick<Filters, "year" | "quarter">) {
  return (
    (f.year === "All" || date.slice(0, 4) === f.year) &&
    (f.quarter === "All" ||
      Math.ceil(Number(date.slice(5, 7)) / 3) === Number(f.quarter))
  );
}
export function scope(db: Database, f: Filters): Database {
  const scholars = db.scholars.filter(
    (s) => f.status === "All" || s.status === f.status,
  );
  const ids = new Set(scholars.map((s) => s.id));
  const activities = db.activities.filter((x) => inPeriod(x.date, f));
  const aids = new Set(activities.map((x) => x.id));
  return {
    ...db,
    scholars: scholars.filter((s) => inPeriod(s.date, f)),
    outreach: db.outreach.filter((x) => inPeriod(x.date, f)),
    activities,
    participation: db.participation.filter(
      (x) => ids.has(x.scholarId) && aids.has(x.activityId),
    ),
    evaluations: db.evaluations.filter(
      (x) => ids.has(x.scholarId) && inPeriod(x.date, f),
    ),
    logs: db.logs.filter((x) => ids.has(x.scholarId) && inPeriod(x.date, f)),
    assignments: db.assignments.filter(
      (x) => ids.has(x.scholarId) && inPeriod(x.date, f),
    ),
  };
}
export function metrics(db: Database) {
  const complete = db.evaluations.filter((e) => e.status === "Complete");
  return {
    "Total Scholars": db.scholars.length,
    "Active Scholars": db.scholars.filter((s) => s.status === "Active").length,
    "Recruitment Inquiries": db.outreach.reduce((n, x) => n + x.reached, 0),
    "Outreach Activities": db.outreach.length,
    "Training Completion Rate": `${Math.round((100 * db.assignments.filter((a) => a.progress === 100).length) / (db.assignments.length || 1))}%`,
    "Clinical Logs Verified": db.logs.filter((x) => x.status === "Verified")
      .length,
    "Average Competency Score": average(complete.map(score)).toFixed(2),
    "Pending Evaluations": db.evaluations.filter((x) => x.status === "Pending")
      .length,
  };
}
export const participationRate = (db: Database, id: string) =>
  Math.round(
    (100 * db.participation.filter((p) => p.scholarId === id).length) /
      (db.activities.length || 1),
  );
export const completionRate = (db: Database, id: string) => {
  const a = db.assignments.filter((x) => x.scholarId === id);
  return Math.round(
    (100 * a.filter((x) => x.progress === 100).length) / (a.length || 1),
  );
};
export function saveScholar(db: Database, s: Scholar): Database {
  if (!s.name.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(s.date))
    throw Error("Name and enrollment date are required.");
  return {
    ...db,
    scholars: db.scholars.some((x) => x.id === s.id)
      ? db.scholars.map((x) => (x.id === s.id ? s : x))
      : [...db.scholars, s],
  };
}
export function removeScholar(db: Database, id: string): Database {
  return {
    ...db,
    scholars: db.scholars.filter((s) => s.id !== id),
    participation: db.participation.filter((s) => s.scholarId !== id),
    evaluations: db.evaluations.filter((s) => s.scholarId !== id),
    logs: db.logs.filter((s) => s.scholarId !== id),
    assignments: db.assignments.filter((s) => s.scholarId !== id),
  };
}
export function attendance(
  db: Database,
  scholarId: string,
  activityId: string,
  checked: boolean,
): Database {
  if (
    !db.scholars.some((s) => s.id === scholarId) ||
    !db.activities.some((a) => a.id === activityId)
  )
    throw Error("Invalid attendance reference");
  const rest = db.participation.filter(
    (p) => !(p.scholarId === scholarId && p.activityId === activityId),
  );
  return {
    ...db,
    participation: checked
      ? [
          ...rest,
          { id: `ATT-${scholarId}-${activityId}`, scholarId, activityId },
        ]
      : rest,
  };
}
export function validateLog(
  db: Database,
  id: string,
  status: string,
  notes: string,
): Database {
  if (!["Verified", "Needs Revision"].includes(status))
    throw Error("Invalid review status");
  if (status === "Needs Revision" && !notes.trim())
    throw Error("Please explain the requested revision.");
  return {
    ...db,
    logs: db.logs.map((l) =>
      l.id === id ? { ...l, status, notes, reviewer: "Demo Faculty" } : l,
    ),
  };
}
export function quality(db: Database) {
  const warnings: string[] = [];
  if (
    db.evaluations.some((x) => !db.scholars.some((s) => s.id === x.scholarId))
  )
    warnings.push("Evaluation references a missing scholar.");
  if (db.logs.some((x) => x.status === "Needs Revision"))
    warnings.push(
      `${db.logs.filter((x) => x.status === "Needs Revision").length} clinical logs need revision.`,
    );
  if (db.evaluations.some((x) => x.status === "Pending"))
    warnings.push(
      `${db.evaluations.filter((x) => x.status === "Pending").length} evaluations are pending.`,
    );
  return warnings;
}
