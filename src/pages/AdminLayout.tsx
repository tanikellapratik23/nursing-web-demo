import { useState } from "react";
import { NavLink, Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  CalendarCheck,
  ClipboardCheck,
  FileCheck,
  BookOpen,
  ChartNoAxesCombined,
  Settings,
  Menu,
  RotateCcw,
  GraduationCap,
} from "lucide-react";
import type { Filters, Role } from "../types";
import { useStore } from "../services/store";
import { Modal } from "../components/UI";
export interface AdminContext {
  filters: Filters;
  setFilters: (f: Filters) => void;
}
export const adminNav = [
  ["", "Overview", LayoutDashboard],
  ["scholars", "Scholars", Users],
  ["outreach", "Recruitment & Outreach", Megaphone],
  ["activities", "Activities", CalendarCheck],
  ["evaluations", "Competency Evaluations", ClipboardCheck],
  ["clinical-logs", "Clinical Logs", FileCheck],
  ["modules", "Learning Modules", BookOpen],
  ["reports", "Reports", ChartNoAxesCombined],
  ["settings", "Demo Information", Settings],
] as const;
export function AdminLayout() {
  const store = useStore();
  const [open, setOpen] = useState(false),
    [reset, setReset] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    year: "2027",
    quarter: "All",
    status: "All",
  });
  const loc = useLocation();
  const title =
    adminNav.find(([p]) => loc.pathname === `/admin${p ? "/" + p : ""}`)?.[1] ||
    "Overview";
  return (
    <div className="admin-shell">
      <a
        className="skip"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      <aside className={open ? "sidebar open" : "sidebar"}>
        <Link className="admin-brand" to="/admin">
          <GraduationCap size={28} />
          <div>
            CN READY<span>PROGRAM DEMONSTRATION</span>
          </div>
        </Link>
        <div className="sidebar-label">WORKSPACE</div>
        <nav aria-label="Administration">
          {adminNav.map(([p, label, Icon]) => (
            <NavLink
              end={p === ""}
              key={p}
              to={`/admin${p ? "/" + p : ""}`}
              onClick={() => setOpen(false)}
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <span className="demo-pill">DEMO MODE · FICTIONAL DATA</span>
          <Link to="/">Return to Program Website</Link>
          <p>
            Independent concept
            <br />
            School of Nursing · Charlotte
          </p>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-top">
          <button
            className="icon mobile-toggle"
            onClick={() => setOpen(!open)}
            aria-label="Toggle administrative navigation"
            aria-expanded={open}
          >
            <Menu />
          </button>
          <span className="breadcrumb">
            Workspace <span>/</span> {title}
          </span>
          <div className="top-right">
            <span className="avatar">DA</span>
            <div>
              <b>Demo administrator</b>
              <small>Frontend role simulation</small>
            </div>
          </div>
        </header>
        <div className="admin-content" id="main" tabIndex={-1}>
          <div className="admin-tools">
            <span className="demo-pill">Demo Mode — Fictional Data</span>
            <div className="actions">
              <label>
                Role{" "}
                <select
                  aria-label="Demo role"
                  value={store.role}
                  onChange={(e) => store.setRole(e.target.value as Role)}
                >
                  {["Program Administrator", "Nursing Faculty", "Viewer"].map(
                    (x) => (
                      <option key={x}>{x}</option>
                    ),
                  )}
                </select>
              </label>
              <button
                className="text-button"
                disabled={store.role !== "Program Administrator"}
                onClick={() => setReset(true)}
              >
                <RotateCcw size={15} /> Reset Demo Data
              </button>
            </div>
          </div>
          <div className="period-bar">
            <label>
              Program year{" "}
              <select
                value={filters.year}
                onChange={(e) =>
                  setFilters({ ...filters, year: e.target.value })
                }
              >
                <option>All</option>
                <option>2027</option>
                <option>2028</option>
              </select>
            </label>
            <label>
              Reporting quarter{" "}
              <select
                value={filters.quarter}
                onChange={(e) =>
                  setFilters({ ...filters, quarter: e.target.value })
                }
              >
                <option value="All">All quarters</option>
                {[1, 2, 3, 4].map((q) => (
                  <option key={q} value={q}>
                    Q{q}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Scholar status{" "}
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                {["All", "Active", "Completed", "On Hold"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
          </div>
          {store.storageError && (
            <div className="notice" role="alert">
              {store.storageError}
            </div>
          )}
          <Outlet context={{ filters, setFilters } satisfies AdminContext} />
          <div className="admin-foot">
            Independent technical demonstration · All participant data is
            fictional · Frontend role simulation only
          </div>
        </div>
      </div>
      {reset && (
        <Modal title="Reset all demo data?" onClose={() => setReset(false)}>
          <p>
            This replaces every local edit with the original fictional dataset.
          </p>
          <div className="actions">
            <button className="secondary" onClick={() => setReset(false)}>
              Cancel
            </button>
            <button
              onClick={() => {
                store.reset();
                setReset(false);
              }}
            >
              Reset data
            </button>
          </div>
        </Modal>
      )}
      {store.toast && (
        <div className="toast" role="status">
          {store.toast}
        </div>
      )}
    </div>
  );
}
