import type { Database } from "../types";
import { categories, modules } from "./modules";
const date = (i: number) =>
  `2027-${String(1 + (i % 12)).padStart(2, "0")}-${String(1 + ((i * 7) % 27)).padStart(2, "0")}`;
export function seed(): Database {
  const first = [
    "Avery",
    "Jordan",
    "Morgan",
    "Taylor",
    "Riley",
    "Casey",
    "Quinn",
    "Cameron",
    "Parker",
    "Reese",
  ];
  const last = ["Bennett", "Rivera", "Chen", "Patel", "Brooks"];
  const scholars = Array.from({ length: 50 }, (_, i) => ({
    id: `CN-${String(i + 1).padStart(3, "0")}`,
    name: `${first[i % 10]} ${last[Math.floor(i / 10)]}`,
    date: date(i),
    status: ["Active", "Active", "Active", "Completed", "On Hold"][i % 5],
    cohort: i % 2 ? "Spring 2027" : "Fall 2027",
    source: [
      "Information Session",
      "Faculty Referral",
      "Campus Outreach",
      "Website",
    ][i % 4],
  }));
  const activities = Array.from({ length: 25 }, (_, i) => ({
    id: `ACT-${i + 1}`,
    name: `${["Community Care Workshop", "Simulation Lab", "Community Health Event", "Professional Development", "Team Learning"][i % 5]} ${Math.floor(i / 5) + 1}`,
    type: [
      "Clinical Workshop",
      "Simulation Session",
      "Community Health Event",
      "Professional Development",
      "Interprofessional Learning",
    ][i % 5],
    date: date(i),
    description:
      "Fictional learning activity focused on community-oriented nursing practice.",
    status: i % 4 ? "Completed" : "Scheduled",
  }));
  return {
    version: 1,
    scholars,
    activities,
    outreach: Array.from({ length: 20 }, (_, i) => ({
      id: `OUT-${i + 1}`,
      name: `${["Scholar Pathways Session", "Campus Conversation", "Community Connections", "Virtual Q&A", "Education Partner Discussion"][i % 5]} ${Math.floor(i / 5) + 1}`,
      type: [
        "Information Session",
        "Campus Outreach",
        "Community Engagement",
        "Virtual Information Session",
        "Partner Meeting",
      ][i % 5],
      date: date(i),
      audience: i % 2 ? "Nursing students" : "Community educators",
      location: i % 3 ? "Demo campus space" : "Virtual",
      reached: 12 + ((i * 13) % 70),
      status: ["Complete", "Follow-Up Needed", "In Progress"][i % 3],
    })),
    participation: Array.from({ length: 100 }, (_, i) => ({
      id: `ATT-${i + 1}`,
      scholarId: scholars[i % 50].id,
      activityId: activities[((i % 25) + Math.floor(i / 50)) % 25].id,
    })),
    evaluations: Array.from({ length: 80 }, (_, i) => ({
      id: `EVAL-${i + 1}`,
      scholarId: scholars[i % 50].id,
      date: date(i),
      type: i % 2 ? "Simulation" : "Observation",
      category: categories[i % 6],
      scores: [2 + (i % 4), 3 + (i % 3), 2 + ((i * 3) % 4)],
      evaluator: `Demo Faculty ${(i % 4) + 1}`,
      notes: "Fictional assessment for demonstration.",
      status: i % 5 ? "Complete" : "Pending",
    })),
    logs: Array.from({ length: 75 }, (_, i) => ({
      id: `LOG-${i + 1}`,
      scholarId: scholars[i % 50].id,
      date: date(i),
      type: ["Community Education", "Simulation", "Care Coordination"][i % 3],
      hours: 2 + (i % 6),
      description: "Fictional educational activity. No patient information.",
      submission: "Submitted",
      status: [
        "Verified",
        "Pending Review",
        "Needs Revision",
        "Verified",
        "Submitted",
      ][i % 5],
      reviewer: i % 5 ? "Demo Faculty" : "",
      notes: "",
    })),
    assignments: Array.from({ length: 160 }, (_, i) => ({
      id: `ASG-${i + 1}`,
      scholarId: scholars[i % 50].id,
      moduleId: modules[((i % 8) + Math.floor(i / 50)) % 8].id,
      progress: [0, 25, 50, 75, 100][i % 5],
      date: date(i),
    })),
  };
}
