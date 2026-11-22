import { describe, it, expect } from "vitest";
import { seed } from "../data/seed";
import { modules } from "../data/modules";
import {
  attendance,
  average,
  completionRate,
  inPeriod,
  metrics,
  participationRate,
  removeScholar,
  saveScholar,
  scope,
  score,
  validateLog,
} from "./analytics";
import { csv } from "./csv";
import { restore } from "./store";
describe("deterministic data and relationships", () => {
  it("creates the requested dataset with valid unique relationships", () => {
    const d = seed();
    expect(seed()).toEqual(d);
    expect([
      d.scholars.length,
      d.outreach.length,
      d.activities.length,
      d.participation.length,
      d.evaluations.length,
      d.logs.length,
      modules.length,
    ]).toEqual([50, 20, 25, 100, 80, 75, 8]);
    const ids = new Set(d.scholars.map((s) => s.id));
    expect(
      [...d.evaluations, ...d.logs, ...d.participation, ...d.assignments].every(
        (x) => ids.has(x.scholarId),
      ),
    ).toBe(true);
    expect(
      new Set(d.participation.map((x) => x.scholarId + x.activityId)).size,
    ).toBe(100);
    expect(
      new Set(d.assignments.map((x) => x.scholarId + x.moduleId)).size,
    ).toBe(160);
  });
  it("creates, updates, and cascade-deletes a scholar", () => {
    let d = seed();
    const s = { ...d.scholars[0], id: "CN-new", name: "Fictional Scholar" };
    d = saveScholar(d, s);
    expect(d.scholars).toHaveLength(51);
    d = saveScholar(d, { ...s, name: "Updated Name" });
    expect(d.scholars.find((x) => x.id === s.id)?.name).toBe("Updated Name");
    expect(() => saveScholar(d, { ...s, name: "" })).toThrow();
    const id = d.scholars[0].id;
    d = removeScholar(d, id);
    expect(d.evaluations.some((e) => e.scholarId === id)).toBe(false);
    expect(d.assignments.some((e) => e.scholarId === id)).toBe(false);
  });
  it("records attendance idempotently and recalculates participation", () => {
    let d = seed();
    const s = d.scholars[0].id,
      a = d.activities[4].id;
    d = attendance(d, s, a, true);
    d = attendance(d, s, a, true);
    expect(
      d.participation.filter((p) => p.scholarId === s && p.activityId === a),
    ).toHaveLength(1);
    expect(participationRate(d, s)).toBe(12);
    d = attendance(d, s, a, false);
    expect(participationRate(d, s)).toBe(8);
    expect(() => attendance(d, "missing", a, true)).toThrow();
  });
});
describe("analytics and validation", () => {
  it("uses equally weighted criterion scores and completed records", () => {
    const d = seed();
    expect(score({ ...d.evaluations[0], scores: [1, 3, 5] })).toBe(3);
    expect(average([])).toBe(0);
    expect(metrics(d)["Average Competency Score"]).toBe(
      average(
        d.evaluations.filter((e) => e.status === "Complete").map(score),
      ).toFixed(2),
    );
    expect(completionRate(d, d.scholars[4].id)).toBe(100);
  });
  it("validates log status and notes", () => {
    const d = seed(),
      id = d.logs[0].id;
    expect(validateLog(d, id, "Verified", "Checked").logs[0].status).toBe(
      "Verified",
    );
    expect(() => validateLog(d, id, "Needs Revision", "")).toThrow();
    expect(
      validateLog(d, id, "Needs Revision", "Clarify activity").logs[0].notes,
    ).toBe("Clarify activity");
  });
  it("filters quarter boundaries and dependent records", () => {
    expect(inPeriod("2027-03-31", { year: "2027", quarter: "1" })).toBe(true);
    expect(inPeriod("2027-04-01", { year: "2027", quarter: "1" })).toBe(false);
    expect(inPeriod("2028-01-01", { year: "2027", quarter: "1" })).toBe(false);
    const d = scope(seed(), { year: "2027", quarter: "2", status: "Active" });
    expect(
      d.scholars.every(
        (s) =>
          s.status === "Active" &&
          Number(s.date.slice(5, 7)) >= 4 &&
          Number(s.date.slice(5, 7)) <= 6,
      ),
    ).toBe(true);
    expect(
      d.participation.every((p) =>
        d.activities.some((a) => a.id === p.activityId),
      ),
    ).toBe(true);
    expect(
      scope(seed(), { year: "2028", quarter: "All", status: "All" }).scholars,
    ).toHaveLength(0);
  });
});
describe("persistence and exports", () => {
  it("recovers corrupt, outdated, malformed, and orphaned storage", () => {
    expect(restore("{")).toEqual(seed());
    expect(restore('{"version":0}')).toEqual(seed());
    const d = seed();
    expect(restore(JSON.stringify(d))).toEqual(d);
    d.evaluations[0].scholarId = "orphan";
    expect(restore(JSON.stringify(d))).toEqual(seed());
  });
  it("quotes commas, double quotes, and newlines and neutralizes formulas", () => {
    expect(csv([{ a: "A, B", b: 'say "hi"', c: "line\nnext" }])).toBe(
      '"a","b","c"\r\n"A, B","say ""hi""","line\nnext"',
    );
    for (const v of ["=SUM(A1)", "+1", "-1", "@a", "  =x", "\tx"])
      expect(csv([{ value: v }])).toContain(`"'${v}"`);
    expect(csv([])).toContain("No records");
  });
});
