import type { Module } from "../types";
export const categories = [
  "Clinical Reasoning",
  "Patient Safety",
  "Communication",
  "Care Coordination",
  "Professional Practice",
  "Teamwork",
];
export const modules: Module[] = [
  [
    "Community Health Foundations",
    "Care Coordination",
    "Explore community needs, prevention, and access to care.",
  ],
  [
    "Clinical Communication",
    "Communication",
    "Practice structured handoffs and person-centered communication.",
  ],
  [
    "Patient Safety",
    "Patient Safety",
    "Recognize hazards and reflect on safe care processes.",
  ],
  [
    "Care Coordination",
    "Care Coordination",
    "Map care transitions and community resources.",
  ],
  [
    "Clinical Reasoning",
    "Clinical Reasoning",
    "Connect observations with priorities and evidence.",
  ],
  [
    "Transition to Professional Practice",
    "Professional Practice",
    "Reflect on professional identity and transition into practice.",
  ],
  [
    "Interprofessional Collaboration",
    "Teamwork",
    "Explore team roles and shared decision-making.",
  ],
  [
    "Community Simulation Lab",
    "Clinical Reasoning",
    "Apply learning in a fictional community care scenario.",
  ],
].map(([name, category, description], i) => ({
  id: `MOD-${i + 1}`,
  name,
  category,
  description,
  lessons: 3 + (i % 3),
  objectives: [
    `Describe core concepts in ${category.toLowerCase()}.`,
    "Apply a structured approach to a fictional scenario.",
    "Reflect on learning and identify a next step.",
  ],
}));
