import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useStore } from "../services/store";
import { metrics, scope, quality } from "../services/analytics";
import { PageHead, Export, Empty } from "../components/UI";
import { Chart } from "../components/Charts";
import type { AdminContext } from "./AdminLayout";
import { disclaimer } from "./Public";
const reportCategories = [
  "Scholar Recruitment",
  "Scholar Enrollment",
  "Outreach Activities",
  "Program Participation",
  "Competency Evaluations",
  "Clinical Log Validation",
  "Training Completion",
];
export function Reports() {
  const { db } = useStore();
  const { filters } = useOutletContext<AdminContext>();
  const [category, setCategory] = useState(reportCategories[0]);
  const d = scope(db, filters);
  const summary = metrics(d);
  const rows: object[] =
    category === "Scholar Recruitment" || category === "Scholar Enrollment"
      ? d.scholars
      : category === "Outreach Activities"
        ? d.outreach
        : category === "Program Participation"
          ? d.participation.map((p) => ({
              ...p,
              date: d.activities.find((a) => a.id === p.activityId)?.date,
              activity: d.activities.find((a) => a.id === p.activityId)?.name,
            }))
          : category === "Competency Evaluations"
            ? d.evaluations
            : category === "Clinical Log Validation"
              ? d.logs
              : d.assignments;
  const filename = (name: string) =>
    `cn-ready-${name}-${filters.year}-${filters.quarter === "All" ? "all-quarters" : "q" + filters.quarter}.csv`;
  const warnings = quality(d);
  const summaries = Object.entries(summary).map(([metric, value]) => ({
    period: `${filters.year} / ${filters.quarter === "All" ? "All quarters" : "Q" + filters.quarter}`,
    metric,
    value,
  }));
  return (
    <>
      <PageHead
        title="Quarterly reporting"
        description="Review matching program records and generate illustrative reporting exports."
      >
        <Export rows={summaries} name={filename("quarterly-summary")} />
      </PageHead>
      <div className="notice">
        This is an illustrative reporting interface. Actual HRSA reporting
        fields, definitions, validation rules, and submission formats must be
        confirmed with the project team.
      </div>
      <div className="panel report-heading">
        <div>
          <div className="eyebrow">REPORTING PERIOD</div>
          <h2>
            {filters.year} ·{" "}
            {filters.quarter === "All"
              ? "All quarters"
              : `Quarter ${filters.quarter}`}
          </h2>
          <p>
            Use the year, quarter, and scholar-status selectors above to update
            this report.
          </p>
        </div>
        <label>
          Report category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {reportCategories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="two-col spaced">
        <section className="panel">
          <h3>Summary metrics</h3>
          <dl className="summary-list">
            {Object.entries(summary).map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <Chart
          title="Reporting record counts"
          data={[
            { name: "Scholars", value: d.scholars.length },
            { name: "Outreach", value: d.outreach.length },
            { name: "Attendance", value: d.participation.length },
            { name: "Evaluations", value: d.evaluations.length },
            { name: "Logs", value: d.logs.length },
          ]}
        />
      </div>
      <section className="panel spaced">
        <h3>Data quality review</h3>
        {warnings.length ? (
          <ul>
            {warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        ) : (
          <p>No outstanding review flags in the matching records.</p>
        )}
        <p className="muted">
          Period rules: enrollment uses scholar enrollment date; attendance uses
          activity date; assignments use assignment date. Status filters apply
          to scholar-linked records. Outreach is independent of scholar status.
          “Recruitment inquiries” counts outreach contacts reached and may
          include repeat contacts.
        </p>
      </section>
      <section className="panel spaced">
        <div className="table-toolbar">
          <h3>{category}</h3>
          <span>{rows.length} matching records</span>
          <Export
            rows={rows}
            name={filename(category.toLowerCase().replaceAll(" ", "-"))}
          />
        </div>
        {rows.length ? (
          <div className="table-wrap">
            <table>
              <caption>Filtered {category.toLowerCase()} records</caption>
              <thead>
                <tr>
                  {Object.keys(rows[0]).map((k) => (
                    <th key={k}>{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    {Object.entries(r).map(([k, v]) => (
                      <td key={k}>
                        {Array.isArray(v) ? v.join(", ") : String(v ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty />
        )}
      </section>
      <section className="panel spaced">
        <h3>Export matching datasets</h3>
        <div className="export-grid">
          {[
            ["scholars", d.scholars],
            ["outreach", d.outreach],
            ["participation", d.participation],
            ["evaluations", d.evaluations],
            ["clinical-logs", d.logs],
            ["training", d.assignments],
          ].map(([name, data]) => (
            <div key={String(name)}>
              <span>{String(name)}</span>
              <Export rows={data as object[]} name={filename(String(name))} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
export function Settings() {
  const { db, role } = useStore();
  return (
    <>
      <PageHead
        title="Demo information"
        description="Understand the data model, role simulation, and boundaries of this prototype."
      />
      <div className="two-col">
        <section className="panel">
          <h2>Purpose & boundaries</h2>
          <p>{disclaimer}</p>
          <p>
            This is a browser-only prototype with LocalStorage persistence. It
            has no backend, institutional login, patient records, or LMS
            integration.
          </p>
          <p>
            Current simulated role: <b>{role}</b>.
          </p>
          <p>
            Administrators manage all records. Faculty can view profiles and
            manage evaluations and clinical log reviews. Viewers can explore
            read-only data and reports. These UI permissions are not
            authentication or security.
          </p>
        </section>
        <section className="panel">
          <h2>Deterministic demo dataset</h2>
          <dl className="summary-list">
            {Object.entries(db)
              .filter(([k]) => k !== "version")
              .map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{Array.isArray(v) ? v.length : ""}</dd>
                </div>
              ))}
          </dl>
          <p>
            Schema version 1. Use Reset Demo Data to restore seed records.
            Unsupported or corrupted stored data falls back to the original
            seed.
          </p>
        </section>
        <section className="panel">
          <h2>Scoring and reporting</h2>
          <p>
            Each evaluation uses three equally weighted criteria scored from
            1–5. Overall score is their arithmetic mean. Aggregate competency
            means include completed evaluations only.
          </p>
          <p>
            Training completion is completed assignments divided by all
            assignments. Scholar participation is attendance records divided by
            all program activities.
          </p>
          <p>
            Exports quote all fields, escape quotes, and neutralize spreadsheet
            formulas. Reports are illustrative and cannot be submitted as
            official HRSA reports.
          </p>
        </section>
        <section className="panel">
          <h2>A path to production</h2>
          <p>
            A real implementation would require institutional authentication,
            server-side authorization, secure APIs, PostgreSQL, audit logging,
            encrypted storage, approved hosting, and university privacy and
            security review.
          </p>
          <p>
            Use the repository service boundary to replace the local demo store
            with an approved data service.
          </p>
        </section>
      </div>
    </>
  );
}
