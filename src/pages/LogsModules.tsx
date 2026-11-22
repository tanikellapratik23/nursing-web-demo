import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useStore } from "../services/store";
import { scope, validateLog } from "../services/analytics";
import { modules } from "../data/modules";
import { PageHead, Modal, Field, Badge, Empty, Export } from "../components/UI";
import { Chart } from "../components/Charts";
import type { ClinicalLog } from "../types";
import type { AdminContext } from "./AdminLayout";
export function Logs() {
  const { db, update, role } = useStore();
  const { filters } = useOutletContext<AdminContext>();
  const [status, setStatus] = useState("All"),
    [search, setSearch] = useState(""),
    [review, setReview] = useState<ClinicalLog | null>(null),
    [action, setAction] = useState("Verified"),
    [confirm, setConfirm] = useState(false),
    [error, setError] = useState("");
  const can = role !== "Viewer";
  const rows = scope(db, filters).logs.filter(
    (l) =>
      (status === "All" || l.status === status) &&
      ((db.scholars.find((s) => s.id === l.scholarId)?.name || "") + l.id)
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <>
      <PageHead
        title="Clinical logs"
        description="Review fictional educational activities. Patient records must never be entered here."
      >
        <Export rows={rows} name="cn-ready-clinical-logs.csv" />
      </PageHead>
      <div className="mini-kpis">
        {[
          ["Total logs", rows.length],
          ["Verified", rows.filter((l) => l.status === "Verified").length],
          [
            "Pending",
            rows.filter((l) =>
              ["Submitted", "Pending Review"].includes(l.status),
            ).length,
          ],
          [
            "Revisions",
            rows.filter((l) => l.status === "Needs Revision").length,
          ],
          ["Logged hours", rows.reduce((n, l) => n + l.hours, 0)],
        ].map(([label, n]) => (
          <div className="panel" key={label}>
            <span>{label}</span>
            <strong>{n}</strong>
          </div>
        ))}
      </div>
      <Chart
        title="Monthly clinical activity"
        kind="area"
        description="Total logged educational hours"
        data={Array.from({ length: 12 }, (_, i) => ({
          name: new Date(2027, i, 1).toLocaleString("en", { month: "short" }),
          value: rows
            .filter((l) => Number(l.date.slice(5, 7)) === i + 1)
            .reduce((n, l) => n + l.hours, 0),
        }))}
      />
      <div className="panel spaced">
        <div className="table-toolbar">
          <input
            aria-label="Search logs"
            placeholder="Search scholar or log ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            aria-label="Validation status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {[
              "All",
              "Submitted",
              "Pending Review",
              "Verified",
              "Needs Revision",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <caption>
              Clinical education logs, fictional and free of patient information
            </caption>
            <thead>
              <tr>
                <th>Log / scholar</th>
                <th>Activity date</th>
                <th>Type</th>
                <th>Hours</th>
                <th>Submission</th>
                <th>Validation</th>
                <th>Reviewer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id}>
                  <td>
                    <b>{db.scholars.find((s) => s.id === l.scholarId)?.name}</b>
                    <small>{l.id}</small>
                  </td>
                  <td>{l.date}</td>
                  <td>{l.type}</td>
                  <td>{l.hours}</td>
                  <td>{l.submission}</td>
                  <td>
                    <Badge>{l.status}</Badge>
                  </td>
                  <td>{l.reviewer || "Unassigned"}</td>
                  <td>
                    <button
                      className="text-button"
                      onClick={() => {
                        setReview({ ...l });
                        setAction("Verified");
                        setConfirm(false);
                        setError("");
                      }}
                    >
                      {can ? "Review" : "View"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!rows.length && <Empty />}
      </div>
      {review && (
        <Modal
          title={
            confirm ? "Confirm clinical log validation" : "Clinical log review"
          }
          onClose={() => setReview(null)}
        >
          <p>
            <b>{review.id}</b> · {review.date} · {review.hours} hours
          </p>
          <p>{review.description}</p>
          <Badge>{review.status}</Badge>
          {confirm ? (
            <>
              <p>
                Set this log to <b>{action}</b> with reviewer notes:{" "}
                {review.notes || "No additional notes"}?
              </p>
              <div className="actions">
                <button className="secondary" onClick={() => setConfirm(false)}>
                  Back
                </button>
                <button
                  onClick={() => {
                    if (can) {
                      update((d) =>
                        validateLog(d, review.id, action, review.notes),
                      );
                      setReview(null);
                    }
                  }}
                >
                  Confirm validation
                </button>
              </div>
            </>
          ) : can ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (action === "Needs Revision" && !review.notes.trim()) {
                  setError("Reviewer notes are required for revisions.");
                  return;
                }
                setConfirm(true);
              }}
            >
              <Field label="Review decision">
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                >
                  <option>Verified</option>
                  <option>Needs Revision</option>
                </select>
              </Field>
              <Field label="Reviewer notes">
                <textarea
                  value={review.notes}
                  onChange={(e) =>
                    setReview({ ...review, notes: e.target.value })
                  }
                />
              </Field>
              {error && <p role="alert">{error}</p>}
              <div className="modal-actions">
                <button>Continue to confirmation</button>
              </div>
            </form>
          ) : (
            <p>Reviewer notes: {review.notes || "None"}</p>
          )}
        </Modal>
      )}
    </>
  );
}
export function ModulesAdmin() {
  const { db, update, role } = useStore();
  const can = role === "Program Administrator";
  const [selected, setSelected] = useState<string | null>(null),
    [scholar, setScholar] = useState("");
  const module = modules.find((m) => m.id === selected);
  const assignments = db.assignments.filter((a) => a.moduleId === selected);
  return (
    <>
      <PageHead
        title="Learning modules"
        description="Organize sample competency-mapped modules, assignments, and fictional progress."
      />
      <div className="notice">
        LMS-support demonstration only. These modules share their definitions
        with the public training page and are not connected to Canvas.
      </div>
      <div className="panel">
        <div className="table-wrap">
          <table>
            <caption>Sample module assignments and completion</caption>
            <thead>
              <tr>
                <th>Module title</th>
                <th>Competency</th>
                <th>Lessons</th>
                <th>Assigned scholars</th>
                <th>Completion rate</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((m) => {
                const a = db.assignments.filter((x) => x.moduleId === m.id);
                return (
                  <tr key={m.id}>
                    <td>
                      <b>{m.name}</b>
                    </td>
                    <td>{m.category}</td>
                    <td>{m.lessons}</td>
                    <td>{a.length}</td>
                    <td>
                      {Math.round(
                        (100 * a.filter((x) => x.progress === 100).length) /
                          (a.length || 1),
                      )}
                      %
                    </td>
                    <td>
                      <Badge>Sample</Badge>
                    </td>
                    <td>
                      <button
                        className="text-button"
                        onClick={() => {
                          setSelected(m.id);
                          setScholar("");
                        }}
                      >
                        View / manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {module && (
        <Modal title={module.name} onClose={() => setSelected(null)}>
          <p>{module.description}</p>
          <Link to={`/training/${module.id}`}>
            View objectives and sample lessons
          </Link>
          {can && (
            <form
              className="assign-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!scholar) return;
                update((d) => ({
                  ...d,
                  assignments: [
                    ...d.assignments,
                    {
                      id: `ASG-${crypto.randomUUID().slice(0, 8)}`,
                      moduleId: module.id,
                      scholarId: scholar,
                      progress: 0,
                      date: "2027-01-01",
                    },
                  ],
                }));
                setScholar("");
              }}
            >
              <Field label="Assign to scholar">
                <select
                  required
                  value={scholar}
                  onChange={(e) => setScholar(e.target.value)}
                >
                  <option value="">Choose unassigned scholar</option>
                  {db.scholars
                    .filter(
                      (s) => !assignments.some((a) => a.scholarId === s.id),
                    )
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </Field>
              <button>Assign module</button>
            </form>
          )}
          <h3>Assigned scholar progress</h3>
          {!assignments.length && <Empty />}
          <div className="check-list">
            {assignments.map((a) => (
              <label key={a.id}>
                {db.scholars.find((s) => s.id === a.scholarId)?.name}
                <select
                  aria-label={`Progress for ${db.scholars.find((s) => s.id === a.scholarId)?.name}`}
                  disabled={!can}
                  value={a.progress}
                  onChange={(e) =>
                    update((d) => ({
                      ...d,
                      assignments: d.assignments.map((x) =>
                        x.id === a.id
                          ? { ...x, progress: Number(e.target.value) }
                          : x,
                      ),
                    }))
                  }
                >
                  {[0, 25, 50, 75, 100].map((n) => (
                    <option key={n} value={n}>
                      {n}% {n === 100 ? "Complete" : ""}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}
