import { useState } from "react";
import { Link, NavLink, Outlet, useParams } from "react-router-dom";
import {
  GraduationCap,
  Users,
  HeartHandshake,
  BookOpen,
  Menu,
  Stethoscope,
  ShieldCheck,
  Network,
  Activity,
} from "lucide-react";
import { modules } from "../data/modules";
export const source =
  "https://nursing.charlotte.edu/2026/10/26/dr-kelly-powers-awarded-2-7m-federal-hrsa-grant-to-advance-nurse-practice-and-retention/";
export const disclaimer =
  "Independent technical demonstration. Not an official UNC Charlotte or HRSA website. All participant data shown is fictional.";
const pillars = [
  {
    title: "Community Nurse Scholars",
    text: "Educational pathways that prepare students for nursing careers in community health settings.",
    icon: GraduationCap,
    to: "/scholars",
  },
  {
    title: "Simulation & Interprofessional Education",
    text: "Learning experiences that connect clinical reasoning, communication, and collaborative care.",
    icon: Activity,
    to: "/training",
  },
  {
    title: "Community & Clinical Partnerships",
    text: "Connections that bring nursing education closer to the communities it serves.",
    icon: HeartHandshake,
    to: "/partners",
  },
  {
    title: "Transition to Practice",
    text: "Education for preceptors and faculty to support the transition into professional nursing.",
    icon: Stethoscope,
    to: "/training",
  },
];
const nav = [
  ["/", "Home"],
  ["/about", "About the Initiative"],
  ["/scholars", "Community Nurse Scholars"],
  ["/training", "Education & Training"],
  ["/partners", "Community Partnerships"],
  ["/resources", "Resources"],
];
export function PublicLayout() {
  const [open, setOpen] = useState(false);
  return (
    <>
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
      <div className="demo-strip">
        INDEPENDENT WEB & ANALYTICS DEMONSTRATION{" "}
        <span>Fictional data · No account required</span>
      </div>
      <div className="public-masthead">
        <div className="university-utility">
          <Link
            to="/"
            className="charlotte-wordmark"
            aria-label="Charlotte demo homepage"
          >
            <img
              src={`${import.meta.env.BASE_URL}assets/charlotte-wordmark.svg`}
              alt="Charlotte"
              width="270"
              height="54"
            />
          </Link>
          <span>INDEPENDENT CONCEPT DEMO</span>
        </div>
        <header className="university">
          <div>
            <Link to="/" className="school-title">
              School of Nursing
            </Link>
            <p className="initiative-title">Community Nurse Ready Initiative</p>
          </div>
          <Link className="button masthead-button" to="/admin">
            View Admin Demo
          </Link>
        </header>
        <nav className="public-nav" aria-label="Program navigation">
          <button
            className="mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <Menu size={20} /> Program navigation
          </button>
          <div className={open ? "nav-links open" : "nav-links"}>
            {nav.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={() => setOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer>
        <div className="footer-grid">
          <div>
            <Link
              to="/"
              className="charlotte-wordmark footer-wordmark"
              aria-label="Charlotte demo homepage"
            >
              <img
                src={`${import.meta.env.BASE_URL}assets/charlotte-wordmark.svg`}
                alt="Charlotte"
                width="270"
                height="54"
              />
            </Link>
            <h3>Community Nurse Ready Initiative</h3>
            <p>School of Nursing · UNC Charlotte</p>
          </div>
          <div>
            <h3>Explore the official sources</h3>
            <a href="https://nursing.charlotte.edu/">School of Nursing</a>
            <a href={source}>Initiative grant announcement</a>
            <Link to="/admin">Explore the administrative demo</Link>
          </div>
        </div>
        <p className="footer-note">{disclaimer}</p>
      </footer>
    </>
  );
}
function Pillars() {
  return (
    <div className="pillars">
      {pillars.map((p) => (
        <article className="pillar" key={p.title}>
          <p.icon size={30} strokeWidth={1.6} />
          <h3>{p.title}</h3>
          <p>{p.text}</p>
          <Link to={p.to}>Learn more</Link>
        </article>
      ))}
    </div>
  );
}
export function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow light">COMMUNITY NURSE READY INITIATIVE</div>
          <h1>
            Preparing nurses.
            <br />
            <em>Strengthening</em>
            <br />
            communities.
          </h1>
          <p>
            Connecting nursing education, competency development, and the
            transition to professional practice.
          </p>
          <div className="actions">
            <Link className="button gold" to="/about">
              Explore the Initiative
            </Link>
            <Link className="button outline-light" to="/admin">
              View Program Dashboard
            </Link>
          </div>
          <div className="hero-caption">
            An independent technical proof of concept
          </div>
        </div>
        <div
          className="hero-art"
          aria-label="Illustration of connected community nursing education"
          role="img"
        >
          <div className="art-grid" />
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-center">
            <Stethoscope size={92} strokeWidth={1} />
            <span>
              CARE BEGINS
              <br />
              WITH CONNECTION
            </span>
          </div>
          <div className="art-label art-a">
            <GraduationCap /> Nursing education
          </div>
          <div className="art-label art-b">
            <Users /> Community practice
          </div>
          <div className="art-label art-c">
            <ShieldCheck /> Practice readiness
          </div>
          <span className="art-note">CONCEPTUAL EDUCATION ILLUSTRATION</span>
        </div>
      </section>
      <section className="intro section">
        <div>
          <div className="eyebrow">EDUCATION WITH COMMUNITY AT ITS HEART</div>
          <h2>
            Building readiness.
            <br />
            Expanding possibility.
          </h2>
        </div>
        <div>
          <p className="lead">
            The Community Nurse Ready Initiative aims to prepare BSN students
            for healthcare settings serving rural and medically vulnerable
            populations.
          </p>
          <p>
            The HRSA-funded initiative connects scholar preparation, simulation,
            partnerships, and education for preceptors and faculty.
          </p>
          <a href={source}>Read the official October 2026 announcement</a>
        </div>
      </section>
      <section className="section pale">
        <div className="section-heading">
          <div>
            <div className="eyebrow">A CONNECTED APPROACH</div>
            <h2>Four pillars. A shared purpose.</h2>
          </div>
          <p>
            From the classroom to the community,
            <br />
            supporting the journey into nursing practice.
          </p>
        </div>
        <Pillars />
      </section>
      <section className="section impact">
        <div>
          <div className="eyebrow">THE FOCUS OF THIS DEMONSTRATION</div>
          <h2>
            Thoughtful systems.
            <br />
            More informed decisions.
          </h2>
          <p>
            Explore how connected digital tools could support faculty and
            program teams. All operational metrics in this demo are
            illustrative.
          </p>
          <Link className="button" to="/admin">
            Explore the working dashboard
          </Link>
        </div>
        <div className="impact-list">
          {[
            [
              Network,
              "Connected program records",
              "Follow recruitment, participation, and learning in one place.",
            ],
            [
              ShieldCheck,
              "Competency-informed learning",
              "Record sample assessments and review clinical activity.",
            ],
            [
              BookOpen,
              "Clear, useful reporting",
              "Explore quarterly trends and export fictional records.",
            ],
          ].map(([Icon, title, desc]) => (
            <div key={String(title)}>
              {typeof Icon !== "string" && <Icon size={25} />}
              <div>
                <h3>{String(title)}</h3>
                <p>{String(desc)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="cta">
        <div>
          <div className="eyebrow light">EXPLORE THE POSSIBILITIES</div>
          <h2>A pathway from learning to practice.</h2>
          <p>
            Discover the initiative’s focus and explore sample educational
            resources.
          </p>
        </div>
        <Link className="button gold" to="/training">
          Explore Education & Training
        </Link>
      </section>
    </>
  );
}
export function About() {
  return (
    <PublicPage
      eyebrow="ABOUT THE INITIATIVE"
      title="Preparing for community-centered nursing."
      intro="The Community Nurse Ready Initiative connects nursing education with the needs of rural and medically vulnerable populations."
    >
      <div className="prose">
        <h2>Grant context</h2>
        <p>
          UNC Charlotte announced on October 26, 2026 that Dr. Kelly Powers
          received federal support through HRSA’s Nurse Education, Practice,
          Quality and Retention – Transition to Practice Program. The
          announcement describes support over four years.
        </p>
        <p>
          The initiative focuses on BSN student readiness, simulation and
          interprofessional education, clinical and community connections, and
          education for nurse preceptors and faculty.
        </p>
        <a href={source}>
          Source: UNC Charlotte School of Nursing grant announcement
        </a>
      </div>
      <h2 className="spaced">Four initiative goals</h2>
      <Pillars />
      <div className="notice">
        This website demonstrates possible digital infrastructure. Its
        workflows, participant records, modules, and rubrics are independently
        developed examples.
      </div>
    </PublicPage>
  );
}
export function PublicPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="public-page-banner">
        <div className="eyebrow light">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
      <div className="section">{children}</div>
    </>
  );
}
export function ScholarsPublic() {
  return (
    <PublicPage
      eyebrow="COMMUNITY NURSE SCHOLARS"
      title="A learning journey with community in view."
      intro="Explore the concept of a scholar pathway connecting education, practice, and reflection."
    >
      <div className="prose">
        <h2>Learning opportunities</h2>
        <p>
          The official initiative describes a Community Nurse Scholars Program
          to prepare students for careers in community health settings. This
          demonstration shows how participation and educational progress could
          be organized.
        </p>
        <a href={source}>Read the official program context</a>
      </div>
      <h2 className="spaced">An illustrative scholar journey</h2>
      <div className="journey">
        {[
          "Explore community nursing",
          "Connect with learning resources",
          "Participate in simulation and activities",
          "Reflect on competencies and practice",
        ].map((x, i) => (
          <article className="panel" key={x}>
            <span className="eyebrow">ILLUSTRATIVE STEP {i + 1}</span>
            <h3>{x}</h3>
            <p>
              A sample workflow for demonstrating connected program support.
            </p>
          </article>
        ))}
      </div>
      <div className="notice">
        This is not an application portal. Eligibility, awards, dates, and
        participation requirements must be confirmed with the university.
      </div>
      <Link className="button" to="/resources">
        Find official resources
      </Link>
    </PublicPage>
  );
}
export function Training() {
  return (
    <PublicPage
      eyebrow="EDUCATION & TRAINING"
      title="Learning mapped to practice."
      intro="Illustrative learning modules, organized around sample nursing competency categories."
    >
      <div className="notice">
        These sample modules are not official course offerings and are not
        connected to Canvas or a university LMS.
      </div>
      <div className="module-grid">
        {modules.map((m) => (
          <article className="panel module" key={m.id}>
            <BookOpen size={26} />
            <span className="eyebrow">{m.category}</span>
            <h2>{m.name}</h2>
            <p>{m.description}</p>
            <p className="muted">Illustrative · {m.lessons} sample lessons</p>
            <Link className="button secondary" to={`/training/${m.id}`}>
              View Module
            </Link>
          </article>
        ))}
      </div>
    </PublicPage>
  );
}
export function ModuleDetail() {
  const { id } = useParams();
  const m = modules.find((x) => x.id === id);
  if (!m)
    return (
      <PublicPage
        eyebrow="MODULE"
        title="Module not found"
        intro="Choose a sample learning module."
      >
        <Link to="/training">All modules</Link>
      </PublicPage>
    );
  return (
    <PublicPage
      eyebrow="ILLUSTRATIVE LEARNING MODULE"
      title={m.name}
      intro={m.description}
    >
      <div className="two-col">
        <section className="panel">
          <h2>Learning objectives</h2>
          <ul>
            {m.objectives.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
          <p>Sample competency: {m.category}</p>
        </section>
        <section className="panel">
          <h2>Sample lesson structure</h2>
          {Array.from({ length: m.lessons }, (_, i) => (
            <details key={i}>
              <summary>
                Lesson {i + 1}:{" "}
                {
                  [
                    "Foundations",
                    "Guided scenario",
                    "Reflection",
                    "Team discussion",
                    "Knowledge check",
                  ][i]
                }
              </summary>
              <p>
                {i === 1
                  ? "Consider a fictional community care scenario. Identify learning needs, communication priorities, and available resources."
                  : "Review the learning objective, discuss an example, and record a short reflection on practice."}
              </p>
            </details>
          ))}
        </section>
      </div>
      <div className="notice">
        Educational structure only; not a clinical guideline or official
        curriculum.
      </div>
      <Link to="/training">Back to sample modules</Link>
    </PublicPage>
  );
}
export function Partners() {
  return (
    <PublicPage
      eyebrow="COMMUNITY PARTNERSHIPS"
      title="Connecting education and community."
      intro="The initiative identifies expanding clinical and community partnerships as one of its four goals."
    >
      <div className="three-col">
        {[
          "Clinical education partners",
          "Community health organizations",
          "Nursing education collaborators",
        ].map((t) => (
          <article className="panel" key={t}>
            <HeartHandshake size={30} />
            <h2>{t}</h2>
            <p>
              Illustrative partner category: a way to organize collaborative
              learning, community engagement, and educational opportunities.
            </p>
          </article>
        ))}
      </div>
      <div className="notice">
        These are generic categories, not claims of established partnerships.
      </div>
      <a href={source}>Explore the verified initiative goals</a>
    </PublicPage>
  );
}
export function Resources() {
  return (
    <PublicPage
      eyebrow="RESOURCES"
      title="Start with trusted sources."
      intro="Official university resources for learning more about nursing education and the initiative."
    >
      <div className="module-grid">
        {[
          [
            "School of Nursing",
            "https://nursing.charlotte.edu/",
            "University nursing information and news.",
          ],
          [
            "Initiative announcement",
            source,
            "The source for verified initiative goals and grant context.",
          ],
          [
            "Nursing academics",
            "https://nursing.charlotte.edu/academics/",
            "Explore university nursing programs.",
          ],
          [
            "Charlotte brand",
            "https://brand.charlotte.edu/",
            "University identity and brand guidance.",
          ],
        ].map(([t, url, d]) => (
          <a className="panel resource" key={t} href={url}>
            <BookOpen />
            <h2>{t}</h2>
            <p>{d}</p>
            <span>Visit official resource</span>
          </a>
        ))}
      </div>
    </PublicPage>
  );
}
