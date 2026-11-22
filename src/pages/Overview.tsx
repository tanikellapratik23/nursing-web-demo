import { Link, useOutletContext } from "react-router-dom";
import {
  Users,
  ClipboardCheck,
  CalendarCheck,
  BookOpen,
  FileCheck,
  Megaphone,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useStore } from "../services/store";
import { average, metrics, scope, score } from "../services/analytics";
import { categories } from "../data/modules";
import { Chart } from "../components/Charts";
import { PageHead, Badge } from "../components/UI";
import type { AdminContext } from "./AdminLayout";
export const countBy = (rows: { [key: string]: unknown }[], key: string) =>
  [...new Set(rows.map((r) => String(r[key])))].map((name) => ({
    name,
    value: rows.filter((r) => r[key] === name).length,
  }));
export function Overview() {
  const { db } = useStore();
  const { filters } = useOutletContext<AdminContext>();
  const d = scope(db, filters);
  const kpis = metrics(d);
  const icons = [
    Users,
    TrendingUp,
    Megaphone,
    CalendarCheck,
    BookOpen,
    FileCheck,
    ClipboardCheck,
    Clock,
  ];
  const monthly = Array.from({ length: 12 }, (_, i) => ({
    name: new Date(2027, i, 1).toLocaleString("en", { month: "short" }),
    value: d.scholars.filter((s) => Number(s.date.slice(5, 7)) === i + 1)
      .length,
  }));
  return (
    <>
      <PageHead
        eyebrow="PROGRAM AT A GLANCE"
        title="Program overview"
        description="A connected view of scholar pathways, learning, and practice readiness."
      >
        <Link className="button secondary" to="/admin/reports">
          View quarterly report
        </Link>
      </PageHead>
      <div className="notice subtle">
        You’re exploring an illustrative{" "}
        {filters.year === "All" ? "all-year" : filters.year} dataset. Metrics
        reflect the selected period; scholars are counted by enrollment date.
        Recruitment inquiries represent fictional outreach contacts reached.
      </div>
      <div className="kpi-grid">
        {Object.entries(kpis).map(([label, value], i) => {
          const Icon = icons[i];
          return (
            <article className="kpi" key={label}>
              <div>
                <span>{label}</span>
                <Icon size={19} />
              </div>
              <strong>
                {value}
                {label === "Average Competency Score" && <small> / 5</small>}
              </strong>
              <span className="kpi-note">
                {label === "Total Scholars"
                  ? "Enrolled within selected period"
                  : "From matching demo records"}
              </span>
            </article>
          );
        })}
      </div>
      <div className="two-col charts">
        <Chart
          title="Scholar enrollment"
          description="New enrollments by month · fictional records"
          data={monthly}
          kind="area"
        />
        <Chart
          title="Recruitment by source"
          description="Source of matching scholar enrollments"
          data={countBy(
            d.scholars.map((s) => ({ ...s })),
            "source",
          )}
        />
        <Chart
          title="Participation by activity"
          description="Structured attendance records by activity type"
          data={[...new Set(d.activities.map((a) => a.type))].map((name) => ({
            name: name
              .replace("Interprofessional Learning", "Team Learning")
              .replace("Professional Development", "Development"),
            value: d.participation.filter(
              (p) =>
                d.activities.find((a) => a.id === p.activityId)?.type === name,
            ).length,
          }))}
        />
        <Chart
          title="Competency performance"
          description="Mean of completed sample evaluations · 1–5 scale"
          data={categories.map((name) => ({
            name: name
              .replace("Clinical ", "")
              .replace("Professional ", "")
              .replace("Care ", ""),
            value: Number(
              average(
                d.evaluations
                  .filter((e) => e.category === name && e.status === "Complete")
                  .map(score),
              ).toFixed(2),
            ),
          }))}
        />
        <Chart
          title="Clinical log validation"
          kind="pie"
          data={countBy(
            d.logs.map((l) => ({ ...l })),
            "status",
          )}
        />
        <section className="panel">
          <h3>Review queue</h3>
          <p className="muted">
            Records needing attention in this reporting period.
          </p>
          <div className="queue">
            <Link to="/admin/evaluations">
              <ClipboardCheck />
              Pending evaluations
              <Badge>
                {d.evaluations.filter((e) => e.status === "Pending").length}
              </Badge>
            </Link>
            <Link to="/admin/clinical-logs">
              <FileCheck />
              Clinical logs awaiting review
              <Badge>
                {
                  d.logs.filter((l) =>
                    ["Pending Review", "Submitted"].includes(l.status),
                  ).length
                }
              </Badge>
            </Link>
            <Link to="/admin/reports">
              <BookOpen />
              Quarterly reporting<span>Explore report</span>
            </Link>
          </div>
          <div className="notice">
            Sample rubrics and report definitions require project-team review
            before any production use.
          </div>
        </section>
      </div>
    </>
  );
}
