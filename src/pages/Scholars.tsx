import { useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { useStore } from "../services/store";
import {
  saveScholar,
  removeScholar,
  participationRate,
  completionRate,
  score,
} from "../services/analytics";
import type { Scholar } from "../types";
import { PageHead, Modal, Field, Badge, Empty, Export } from "../components/UI";
import { modules } from "../data/modules";
export function Scholars() {
  const { db, update, role } = useStore();
  const [search, setSearch] = useState(""),
    [status, setStatus] = useState("All"),
    [cohort, setCohort] = useState("All"),
    [sort, setSort] = useState<keyof Scholar>("name"),
    [asc, setAsc] = useState(true),
    [form, setForm] = useState<Scholar | null>(null),
    [detail, setDetail] = useState<Scholar | null>(null),
    [del, setDel] = useState<Scholar | null>(null),
    [error, setError] = useState("");
  const can = role === "Program Administrator";
  const rows = db.scholars
    .filter(
      (s) =>
        (s.name + " " + s.id).toLowerCase().includes(search.toLowerCase()) &&
        (status === "All" || s.status === status) &&
        (cohort === "All" || s.cohort === cohort),
    )
    .sort((a, b) => (asc ? 1 : -1) * a[sort].localeCompare(b[sort]));
  const editing = (s: Scholar) => {
    setError("");
    setForm({ ...s });
  };
  return (
    <>
      <PageHead
        title="Scholars"
        description="Manage fictional scholar pathways and explore connected learning records."
      >
        <Export rows={rows} name="cn-ready-scholars.csv" />
        {can && (
          <button
            onClick={() =>
              editing({
                id: `CN-${crypto.randomUUID().slice(0, 8)}`,
                name: "",
                date: "2027-01-01",
                status: "Active",
                cohort: "Spring 2027",
                source: "Website",
              })
            }
          >
            <Plus size={17} /> Add scholar
          </button>
        )}
      </PageHead>
      <div className="panel">
        <div className="table-toolbar">
          <input
            aria-label="Search scholars"
            placeholder="Search name or scholar ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            aria-label="Filter scholar status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {["All", "Active", "Completed", "On Hold"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <select
            aria-label="Filter cohort"
            value={cohort}
            onChange={(e) => setCohort(e.target.value)}
          >
            {["All", ...new Set(db.scholars.map((s) => s.cohort))].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <span className="muted">{rows.length} scholars</span>
        </div>
        <div className="table-wrap">
          <table>
            <caption>
              Fictional scholar enrollment and learning progress
            </caption>
            <thead>
              <tr>
                {[
                  ["id", "Scholar ID"],
                  ["name", "Name"],
                  ["date", "Enrollment date"],
                  ["status", "Status"],
                  ["cohort", "Cohort"],
                ].map(([k, label]) => (
                  <th
                    key={k}
                    aria-sort={
                      sort === k ? (asc ? "ascending" : "descending") : "none"
                    }
                  >
                    <button
                      className="sort"
                      onClick={() => {
                        setSort(k as keyof Scholar);
                        setAsc(sort === k ? !asc : true);
                      }}
                    >
                      {label} {sort === k ? (asc ? "↑" : "↓") : ""}
                    </button>
                  </th>
                ))}
                <th>Participation</th>
                <th>Training complete</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id}>
                  <td className="mono">{s.id}</td>
                  <td>
                    <b>{s.name}</b>
                  </td>
                  <td>{s.date}</td>
                  <td>
                    <Badge>{s.status}</Badge>
                  </td>
                  <td>{s.cohort}</td>
                  <td>{participationRate(db, s.id)}%</td>
                  <td>{completionRate(db, s.id)}%</td>
                  <td>
                    <div className="actions">
                      <button
                        className="icon"
                        aria-label={`View ${s.name}`}
                        onClick={() => setDetail(s)}
                      >
                        <Eye size={17} />
                      </button>
                      {can && (
                        <>
                          <button
                            className="icon"
                            aria-label={`Edit ${s.name}`}
                            onClick={() => editing(s)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="icon danger"
                            aria-label={`Delete ${s.name}`}
                            onClick={() => setDel(s)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!rows.length && <Empty />}
      </div>
      {form && can && (
        <Modal
          title={
            db.scholars.some((s) => s.id === form.id)
              ? "Edit scholar"
              : "Add fictional scholar"
          }
          onClose={() => setForm(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              try {
                const next = saveScholar(db, form);
                update(() => next);
                setForm(null);
              } catch (e) {
                setError((e as Error).message);
              }
            }}
          >
            <div className="form-grid">
              <Field label="Full name (fictional)">
                <input
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Field>
              <Field label="Enrollment date">
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </Field>
              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {["Active", "Completed", "On Hold"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Cohort">
                <input
                  required
                  value={form.cohort}
                  onChange={(e) => setForm({ ...form, cohort: e.target.value })}
                />
              </Field>
              <Field label="Recruitment source">
                <select
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                >
                  {[
                    "Website",
                    "Information Session",
                    "Faculty Referral",
                    "Campus Outreach",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>
            {error && <p role="alert">{error}</p>}
            <div className="modal-actions">
              <button
                type="button"
                className="secondary"
                onClick={() => setForm(null)}
              >
                Cancel
              </button>
              <button>Save scholar</button>
            </div>
          </form>
        </Modal>
      )}
      {del && can && (
        <Modal title="Delete scholar?" onClose={() => setDel(null)}>
          <p>
            Delete {del.name} and their related attendance, evaluations, logs,
            and module assignments?
          </p>
          <div className="actions">
            <button className="secondary" onClick={() => setDel(null)}>
              Cancel
            </button>
            <button
              className="danger-button"
              onClick={() => {
                update((d) => removeScholar(d, del.id));
                setDel(null);
              }}
            >
              Delete scholar
            </button>
          </div>
        </Modal>
      )}
      {detail && (
        <Modal title={detail.name} onClose={() => setDetail(null)}>
          <p>
            {detail.id} · {detail.cohort} · Enrolled {detail.date}
          </p>
          <Badge>{detail.status}</Badge>
          <h3>Activity participation</h3>
          {db.participation
            .filter((p) => p.scholarId === detail.id)
            .map((p) => (
              <p key={p.id}>
                {db.activities.find((a) => a.id === p.activityId)?.name}
              </p>
            ))}
          <h3>Competency evaluations</h3>
          {db.evaluations
            .filter((e) => e.scholarId === detail.id)
            .map((e) => (
              <p key={e.id}>
                {e.date} · {e.category} · {score(e).toFixed(2)}/5 · {e.status}
              </p>
            ))}
          <h3>Clinical logs</h3>
          {db.logs
            .filter((l) => l.scholarId === detail.id)
            .map((l) => (
              <p key={l.id}>
                {l.date} · {l.hours} hours · {l.status}
              </p>
            ))}
          <h3>Training progress</h3>
          {db.assignments
            .filter((a) => a.scholarId === detail.id)
            .map((a) => (
              <p key={a.id}>
                {modules.find((m) => m.id === a.moduleId)?.name}: {a.progress}%
              </p>
            ))}
        </Modal>
      )}
    </>
  );
}
