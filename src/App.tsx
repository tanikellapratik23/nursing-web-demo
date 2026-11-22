import { HashRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Provider } from "./services/store";
import {
  PublicLayout,
  Home,
  About,
  ScholarsPublic,
  Training,
  ModuleDetail,
  Partners,
  Resources,
} from "./pages/Public";
import { AdminLayout } from "./pages/AdminLayout";
import { Overview } from "./pages/Overview";
import { Scholars } from "./pages/Scholars";
import { OutreachActivities } from "./pages/OutreachActivities";
import { Evaluations } from "./pages/Evaluations";
import { Logs, ModulesAdmin } from "./pages/LogsModules";
import { Reports, Settings } from "./pages/Reports";
function Scroll() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${pathname === "/ " || pathname === "/" ? "Community Nurse Ready" : pathname.split("/").filter(Boolean).join(" · ")} · Independent Demo`;
  }, [pathname]);
  return null;
}
export default function App() {
  return (
    <Provider>
      <HashRouter>
        <Scroll />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="scholars" element={<ScholarsPublic />} />
            <Route path="training" element={<Training />} />
            <Route path="training/:id" element={<ModuleDetail />} />
            <Route path="partners" element={<Partners />} />
            <Route path="resources" element={<Resources />} />
          </Route>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Overview />} />
            <Route path="scholars" element={<Scholars />} />
            <Route
              path="outreach"
              element={<OutreachActivities kind="outreach" />}
            />
            <Route
              path="activities"
              element={<OutreachActivities kind="activities" />}
            />
            <Route path="evaluations" element={<Evaluations />} />
            <Route path="clinical-logs" element={<Logs />} />
            <Route path="modules" element={<ModulesAdmin />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route
            path="*"
            element={
              <main className="section">
                <h1>Page not found</h1>
                <Link to="/">Return to the program website</Link>
              </main>
            }
          />
        </Routes>
      </HashRouter>
    </Provider>
  );
}
