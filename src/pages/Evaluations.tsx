import { useState } from "react";
import { useStore } from "../services/store";
import { average, score, scope } from "../services/analytics";
import { categories } from "../data/modules";
import { Modal, Field, PageHead, Badge, Empty, Export } from "../components/UI";
import { Chart } from "../components/Charts";
import type { Evaluation } from "../types";
import { useOutletContext } from "react-router-dom";
import type { AdminContext } from "./AdminLayout";
const criteria = [
  "Recognizes relevant information",
  "Applies a structured approach",
  "Communicates and reflects",
];
export function Rubric({
  scores,
  onChange,
}: {
  scores: number[];
  onChange: (n: number[]) => void;
}) {
  return (
    <fieldset className="rubric">
      <legend>Illustrative rubric · 1–5 scale</legend>
      <p>
        1: emerging · 2: developing · 3: progressing · 4: consistent · 5:
        advanced. No official passing threshold.
      </p>
      {criteria.map((c, i) => (
        <div className="rubric-row" key={c}>
          <span>{c}</span>
          <div>
            {[1, 2, 3, 4, 5].map((v) => (
              <label key={v}>
                <input
                  type="radio"
                  name={`criterion-${i}`}
                  checked={scores[i] === v}
                  onChange={() =>
                    onChange(scores.map((n, j) => (j === i ? v : n)))
                  }
                />
                {v}
              </label>
            ))}
          </div>
        </div>
      ))}
      <strong>Overall score: {average(scores).toFixed(2)} / 5</strong>
      <p className="muted">
        Formula: arithmetic mean of the three equally weighted criteria.
      </p>
    </fieldset>
  );
}
export function Evaluations() {
  const { db, update, role } = useStore();
  const { filters } = useOutletContext<AdminContext>();
  const scoped = scope(db, filters);
  const can = role !== "Viewer";
  const [search, setSearch] = useState(""),
    [category, setCategory] = useState("All"),
    [scholar, setScholar] = useState("All");
  const [form, setForm] = useState<Evaluation | null>(null);
  const rows = scoped.evaluations.filter(
    (e) =>
      (category === "All" || e.category === category) &&
      (scholar === "All" || e.scholarId === scholar) &&
      ((db.scholars.find((s) => s.id === e.scholarId)?.name || "") + " " + e.id)
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const complete = rows.filter((e) => e.status === "Complete");
  return (
    <>
      <PageHead
        title="Competency evaluations"
        description="Record and explore sample competency-based assessments. Illustrative rubric only."
      >
        <Export
          rows={rows.map((e) => ({ ...e, overallScore: score(e) }))}
          name="cn-ready-evaluations.csv"
        />
        {can && (
          <button
            disabled={!db.scholars.length}
            onClick={() =>
              setForm({
                id: `EVAL-${crypto.randomUUID().slice(0, 8)}`,
                scholarId: db.scholars[0].id,
                date: "2027-01-01",
                type: "Simulation",
                category: categories[0],
                scores: [3, 3, 3],
                evaluator: "Demo Faculty",
                notes: "",
                status: "Complete",
              })
            }
          >
            Add evaluation
          </button>
        )}
      </PageHead>
      <div className="two-col">
        <Chart
          title="Average by competency"
          data={categories.map((name) => ({
            name: name
              .replace("Clinical ", "")
              .replace("Professional ", "")
              .replace("Care ", ""),
            value: Number(
              average(
                complete.filter((e) => e.category === name).map(score),
              ).toFixed(2),
            ),
          }))}
        />
        <Chart
          title="Score distribution"
          description={`${complete.length} complete · ${rows.length - complete.length} pending`}
          data={[1, 2, 3, 4, 5].map((n) => ({
            name: `Score ${n}`,
            value: complete.filter((e) => Math.round(score(e)) === n).length,
          }))}
        />
        <Chart
          title="Historical evaluation trend"
          description="Completed assessments · monthly mean score"
          kind="area"
          data={Array.from({ length: 12 }, (_, i) => ({
            name: new Date(2027, i, 1).toLocaleString("en", { month: "short" }),
            value: Number(
              average(
                complete
                  .filter((e) => Number(e.date.slice(5, 7)) === i + 1)
                  .map(score),
              ).toFixed(2),
            ),
          }))}
        />
        <Chart
          title="Individual scholar progress"
          description={
            scholar === "All"
              ? "Select a scholar below to focus their assessment history."
              : "Selected scholar’s completed evaluations, ordered by date."
          }
          kind="area"
          data={
            scholar === "All"
              ? []
              : [...complete]
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((e) => ({
                    name: e.date,
                    value: Number(score(e).toFixed(2)),
                  }))
          }
        />
      </div>
      <div className="panel spaced">
        <div className="table-toolbar">
          <input
            aria-label="Search evaluations"
            placeholder="Search scholar or evaluation ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            aria-label="Competency category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {["All", ...categories].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            aria-label="Individual scholar"
            value={scholar}
            onChange={(e) => setScholar(e.target.value)}
          >
            <option value="All">All scholars</option>
            {db.scholars.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <caption>Illustrative competency assessments</caption>
            <thead>
              <tr>
                <th>Evaluation / scholar</th>
                <th>Date</th>
                <th>Assessment</th>
                <th>Competency</th>
                <th>Score / 5</th>
                <th>Evaluator</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id}>
                  <td>
                    <b>{db.scholars.find((s) => s.id === e.scholarId)?.name}</b>
                    <small>{e.id}</small>
                  </td>
                  <td>{e.date}</td>
                  <td>{e.type}</td>
                  <td>{e.category}</td>
                  <td>{score(e).toFixed(2)}</td>
                  <td>{e.evaluator}</td>
                  <td>
                    <Badge>{e.status}</Badge>
                  </td>
                  <td>
                    <button
                      className="text-button"
                      onClick={() => setForm({ ...e, scores: [...e.scores] })}
                    >
                      {can ? "Review / edit" : "View"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!rows.length && <Empty />}
      </div>
      {form && (
        <Modal
          title={can ? "Sample competency assessment" : "Assessment details"}
          onClose={() => setForm(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!can) return;
              update((d) => ({
                ...d,
                evaluations: d.evaluations.some((x) => x.id === form.id)
                  ? d.evaluations.map((x) => (x.id === form.id ? form : x))
                  : [...d.evaluations, form],
              }));
              setForm(null);
            }}
          >
            <fieldset disabled={!can}>
              <div className="form-grid">
                <Field label="Scholar">
                  <select
                    required
                    value={form.scholarId}
                    onChange={(e) =>
                      setForm({ ...form, scholarId: e.target.value })
                    }
                  >
                    {db.scholars.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Assessment date">
                  <input
                    required
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </Field>
                <Field label="Assessment type">
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    {["Simulation", "Observation", "Reflection"].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Competency category">
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Evaluator">
                  <input
                    required
                    value={form.evaluator}
                    onChange={(e) =>
                      setForm({ ...form, evaluator: e.target.value })
                    }
                  />
                </Field>
                <Field label="Status">
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                  >
                    <option>Complete</option>
                    <option>Pending</option>
                  </select>
                </Field>
              </div>
              <Rubric
                scores={form.scores}
                onChange={(scores) => setForm({ ...form, scores })}
              />
              <Field label="Evaluation notes (no sensitive information)">
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </Field>
            </fieldset>
            {can && (
              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setForm(null)}
                >
                  Cancel
                </button>
                <button>Save assessment</button>
              </div>
            )}
          </form>
        </Modal>
      )}
    </>
  );
}
