import { useState } from "react";
import { Plus } from "lucide-react";
import { useStore } from "../services/store";
import { attendance } from "../services/analytics";
import { Modal, Field, PageHead, Empty, Export, Badge } from "../components/UI";
import { Chart } from "../components/Charts";
import type { Outreach, Activity } from "../types";
const outreachTypes = [
  "Information Session",
  "Campus Outreach",
  "Community Engagement",
  "Virtual Information Session",
  "Partner Meeting",
];
const activityTypes = [
  "Clinical Workshop",
  "Simulation Session",
  "Community Health Event",
  "Professional Development",
  "Interprofessional Learning",
];
export function OutreachActivities({
  kind,
}: {
  kind: "outreach" | "activities";
}) {
  const { db, update, role } = useStore();
  const can = role === "Program Administrator";
  const isOut = kind === "outreach";
  const [search, setSearch] = useState(""),
    [type, setType] = useState("All"),
    [start, setStart] = useState(""),
    [end, setEnd] = useState("");
  const [form, setForm] = useState<Outreach | Activity | null>(null),
    [del, setDel] = useState<string | null>(null),
    [detail, setDetail] = useState<string | null>(null);
  const types = isOut ? outreachTypes : activityTypes;
  const rows = db[kind].filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) &&
      (type === "All" || r.type === type) &&
      (!start || r.date >= start) &&
      (!end || r.date <= end),
  );
  function edit(r: Outreach | Activity) {
    setForm({ ...r });
  }
  function add() {
    const common = {
      id: `${isOut ? "OUT" : "ACT"}-${crypto.randomUUID().slice(0, 8)}`,
      name: "",
      date: "2027-01-01",
      type: types[0],
      status: isOut ? "Follow-Up Needed" : "Scheduled",
    };
    setForm(
      isOut
        ? { ...common, audience: "", location: "", reached: 0 }
        : { ...common, description: "" },
    );
  }
  const totals = isOut
    ? (rows as Outreach[]).reduce((n, r) => n + r.reached, 0)
    : db.participation.filter((p) => rows.some((a) => a.id === p.activityId))
        .length;
  return (
    <>
      <PageHead
        title={isOut ? "Recruitment & outreach" : "Activities & participation"}
        description={
          isOut
            ? "Track fictional engagement, recruitment contacts, and follow-up."
            : "Connect educational activities with structured scholar attendance."
        }
      >
        <Export rows={rows} name={`cn-ready-${kind}.csv`} />
        {can && (
          <button onClick={add}>
            <Plus size={17} /> Add {isOut ? "outreach" : "activity"}
          </button>
        )}
      </PageHead>
      <div className="two-col">
        <section className="panel stat-panel">
          <div className="eyebrow">MATCHING RECORDS</div>
          <strong>{rows.length}</strong>
          <p>{isOut ? "Outreach activities" : "Program activities"}</p>
          <strong>{totals}</strong>
          <p>
            {isOut
              ? "Fictional contacts reached (not unique individuals)"
              : "Attendance records"}
          </p>
        </section>
        <Chart
          title={
            isOut
              ? "Outreach engagement by month"
              : "Activity attendance by month"
          }
          kind="area"
          data={Array.from({ length: 12 }, (_, i) => ({
            name: new Date(2027, i, 1).toLocaleString("en", { month: "short" }),
            value: isOut
              ? (rows as Outreach[])
                  .filter((r) => Number(r.date.slice(5, 7)) === i + 1)
                  .reduce((n, r) => n + r.reached, 0)
              : db.participation.filter((p) =>
                  rows.some(
                    (a) =>
                      a.id === p.activityId &&
                      Number(a.date.slice(5, 7)) === i + 1,
                  ),
                ).length,
          }))}
        />
      </div>
      <div className="panel spaced">
        <div className="table-toolbar">
          <input
            aria-label="Search activities"
            placeholder="Search activities…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            aria-label="Activity type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {["All", ...types].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <label>
            From{" "}
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </label>
          <label>
            To{" "}
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </label>
        </div>
        <div className="table-wrap">
          <table>
            <caption>
              {isOut
                ? "Fictional recruitment and outreach records"
                : "Program activity and attendance records"}
            </caption>
            <thead>
              <tr>
                <th>ID / activity</th>
                <th>Type</th>
                <th>Date</th>
                {isOut ? (
                  <>
                    <th>Audience / format</th>
                    <th>Reached</th>
                  </>
                ) : (
                  <th>Attendance</th>
                )}
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <b>{r.name}</b>
                    <small>{r.id}</small>
                  </td>
                  <td>{r.type}</td>
                  <td>{r.date}</td>
                  {"reached" in r ? (
                    <>
                      <td>
                        {r.audience}
                        <small>{r.location}</small>
                      </td>
                      <td>{r.reached}</td>
                    </>
                  ) : (
                    <td>
                      {
                        db.participation.filter((p) => p.activityId === r.id)
                          .length
                      }
                    </td>
                  )}
                  <td>
                    <Badge>{r.status}</Badge>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className="text-button"
                        onClick={() => setDetail(r.id)}
                      >
                        View
                      </button>
                      {can && (
                        <>
                          <button
                            className="text-button"
                            onClick={() => edit(r)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-button danger"
                            onClick={() => setDel(r.id)}
                          >
                            Delete
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
          title={`Manage ${isOut ? "outreach" : "activity"}`}
          onClose={() => setForm(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              update((d) =>
                isOut
                  ? {
                      ...d,
                      outreach: d.outreach.some((x) => x.id === form.id)
                        ? d.outreach.map((x) =>
                            x.id === form.id ? (form as Outreach) : x,
                          )
                        : [...d.outreach, form as Outreach],
                    }
                  : {
                      ...d,
                      activities: d.activities.some((x) => x.id === form.id)
                        ? d.activities.map((x) =>
                            x.id === form.id ? (form as Activity) : x,
                          )
                        : [...d.activities, form as Activity],
                    },
              );
              setForm(null);
            }}
          >
            <div className="form-grid">
              <Field label="Activity name">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Field>
              <Field label="Date">
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </Field>
              <Field label="Activity type">
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {types.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </Field>
              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {(isOut
                    ? ["Complete", "Follow-Up Needed", "In Progress"]
                    : ["Scheduled", "Completed", "Cancelled"]
                  ).map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </Field>
              {"reached" in form ? (
                <>
                  <Field label="Audience">
                    <input
                      required
                      value={form.audience}
                      onChange={(e) =>
                        setForm({ ...form, audience: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Location / format">
                    <input
                      required
                      value={form.location}
                      onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Participants reached">
                    <input
                      required
                      type="number"
                      min="0"
                      max="100000"
                      value={form.reached}
                      onChange={(e) =>
                        setForm({ ...form, reached: Number(e.target.value) })
                      }
                    />
                  </Field>
                </>
              ) : (
                <Field label="Description">
                  <textarea
                    required
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </Field>
              )}
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="secondary"
                onClick={() => setForm(null)}
              >
                Cancel
              </button>
              <button>Save activity</button>
            </div>
          </form>
        </Modal>
      )}
      {del && can && (
        <Modal title="Delete activity?" onClose={() => setDel(null)}>
          <p>This deletes the fictional activity and any related attendance.</p>
          <div className="actions">
            <button className="secondary" onClick={() => setDel(null)}>
              Cancel
            </button>
            <button
              className="danger-button"
              onClick={() => {
                update((d) =>
                  isOut
                    ? { ...d, outreach: d.outreach.filter((x) => x.id !== del) }
                    : {
                        ...d,
                        activities: d.activities.filter((x) => x.id !== del),
                        participation: d.participation.filter(
                          (p) => p.activityId !== del,
                        ),
                      },
                );
                setDel(null);
              }}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
      {detail && (
        <Modal
          title={db[kind].find((x) => x.id === detail)?.name || "Activity"}
          onClose={() => setDetail(null)}
        >
          {isOut ? (
            <p>
              {JSON.stringify(
                db.outreach.find((x) => x.id === detail),
                null,
                2,
              )}
            </p>
          ) : (
            <>
              <p>{db.activities.find((x) => x.id === detail)?.description}</p>
              <p>
                Mark attendance below. Each scholar can have one attendance
                record per activity.
              </p>
              <div className="check-list">
                {db.scholars.map((s) => (
                  <label key={s.id}>
                    <input
                      type="checkbox"
                      disabled={!can}
                      checked={db.participation.some(
                        (p) => p.scholarId === s.id && p.activityId === detail,
                      )}
                      onChange={(e) =>
                        update((d) =>
                          attendance(d, s.id, detail, e.target.checked),
                        )
                      }
                    />
                    {s.name}
                    <span>{s.id}</span>
                  </label>
                ))}
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
