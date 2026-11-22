# Community Nurse Ready Initiative — Web & Analytics Demo

A lightweight, interactive concept showing how a university nursing initiative website and program dashboard could look and work. This is an independently developed technical proof of concept, not an official UNC Charlotte or HRSA application.

The public experience uses a green university-style masthead, condensed editorial headings, readable Arial/Helvetica body text, and restrained gold accents. The administration experience uses straightforward tables, forms, charts, and fictional records. No account or backend is required.

## Features

- Public homepage, initiative overview, scholar pathway, education modules, partnership categories, and official resources.
- Dashboard with calculated metrics, five chart views, and year, quarter, and scholar-status filters.
- Scholar search, status/cohort filters, sortable columns, add/edit/delete forms, and connected profile details.
- Outreach management, date/type filters, and engagement trends.
- Activities with structured, duplicate-free attendance tracking.
- Illustrative competency evaluations with a reusable three-criterion rubric, individual progress, and historical trends.
- Clinical log review, reviewer notes, revision requests, and confirmation before validation.
- Shared sample learning modules with scholar assignments and progress updates.
- Filtered reporting and CSV downloads with proper escaping and spreadsheet formula neutralization.
- LocalStorage persistence, seed reset, and frontend role simulation.

This is intentionally a concept demo: simple local interactions, no authentication setup, no server infrastructure, and no external integration dependencies.

## Technology stack

React, TypeScript (strict mode), Vite, Tailwind CSS, React Router HashRouter, Recharts, Lucide React, and Vitest. Native HTML forms and dialogs keep the application small and understandable.

## Running locally

Use Node.js 22 or later.

```bash
npm install
npm run dev
```

Open the URL printed by Vite, including `/nursing-web-demo/`. Public routes and administrative routes use URL hashes so they work on GitHub Pages.

If your global npm cache is not writable, use `npm install --cache /tmp/cn-ready-npm-cache`.

## Tests and production build

```bash
npm test
npm run build
```

The build performs strict TypeScript checking before generating `dist/`. Tests cover seed integrity, scholar creation/update/deletion, attendance and participation calculations, competency scores, clinical log review rules, quarter boundaries, storage recovery, and CSV escaping/formula protection.

## Deployment to GitHub Pages

This directory is its own Git repository, named `nursing-web-demo`; it is not part of an unrelated project. Vite uses `/nursing-web-demo/` as its base, and `.github/workflows/deploy.yml` tests, builds, and deploys pushes to `main`.

GitHub Actions publishes the static demo. Choose **GitHub Actions** in repository Settings → Pages. No API keys or backend configuration are needed.

To publish a fresh copy under another account, authenticate and run from this directory:

```bash
gh auth login -h github.com
gh repo create nursing-web-demo --public --source=. --remote=origin --push --description "Independent UNC Charlotte Community Nurse Ready Initiative web and analytics demonstration built with React and TypeScript."
```

In repository Settings → Pages, choose **GitHub Actions** as the build source. If needed, run the deployment workflow manually from the Actions tab. The workflow's successful deployment step provides the actual Pages URL. Verify that URL before sharing it.

## Demo data

All participant identities and operational records are fictional. The deterministic seed contains 50 scholars, 20 outreach activities, 25 program activities, 100 attendance records, 80 evaluations, 75 clinical logs, 8 module definitions, and 160 module assignments.

Data access is centralized in `src/services/store.tsx`, with calculations and record operations in `src/services/analytics.ts`. Entities reference scholar, activity, and module IDs. Deleting a scholar cascades to related demo records. Unsupported or malformed stored data falls back to the seed. Storage failures show a session-only warning.

Default sample dates are in 2027 and do not represent official program milestones. New records can be dated using the simple forms. Reset Demo Data restores the initial fictional records.

### Metric definitions

- Total/active scholars: matching enrollment records, using enrollment date for period filtering.
- Recruitment inquiries: sum of outreach contacts reached, including possible repeated contacts; not unique people or actual applications.
- Training completion: completed assignments divided by assignments, not mean lesson progress.
- Participation rate: a scholar's attendance records divided by all program activities.
- Overall evaluation score: arithmetic mean of three equally weighted criteria, each scored 1–5.
- Aggregate competency score: mean score across completed evaluations only. There is no official passing threshold.
- Attendance filters use activity date; evaluation and clinical-log filters use record date; training reports use assignment date.
- Scholar-status filters apply to scholar-linked records. Outreach records are independent of scholar status.

Record-management pages have their own search and filters. The workspace reporting controls apply to overview, evaluation, clinical-log, and reporting analytics.

## Security limitations

The role selector is a **frontend-only simulation**, not authentication or access control. Administrator, faculty, and viewer choices demonstrate different UI permissions. Anyone with browser developer tools can inspect or change local data. LocalStorage is browser- and origin-specific, has no collaboration or audit history, and is not suitable for sensitive data.

Never enter real student information, patient information, credentials, or other sensitive data. CSV exports are illustrative, not official HRSA submissions. Actual report fields, definitions, validation, and submission formats require project-team confirmation.

## Potential production architecture

A future institutionally approved implementation could use institutional authentication, PostgreSQL, secure backend APIs, server-side authorization, audit logging, encrypted storage, approved university hosting, and university privacy/security review. The small service boundary provides a starting point for replacing browser persistence without redesigning the presentation.

No such production infrastructure is included in this concept demo.

## Content references and visual assets

- [UNC Charlotte School of Nursing](https://nursing.charlotte.edu/)
- [Official October 26, 2026 grant announcement](https://nursing.charlotte.edu/2026/10/26/dr-kelly-powers-awarded-2-7m-federal-hrsa-grant-to-advance-nurse-practice-and-retention/)
- [Charlotte brand guidance](https://brand.charlotte.edu/)
- [Engineering college brand page supplied as a visual reference](https://engineering.charlotte.edu/about/faculty-staff-resources/college-brand-style-guide-and-templates/)

Program context and the four initiative goals are grounded in the grant announcement. Scholar workflows, modules, partner categories, scoring criteria, and reports are labeled illustrative.

The university reference theme uses Interstate Condensed and Indivisible. This demo uses self-hosted **Barlow Condensed** (SIL Open Font License) as a visual approximation for public headings, plus Arial/Helvetica body text. It does not redistribute licensed university fonts, seals, or photographs. At the user’s request, the corner mark uses the exact SVG wordmark from the official School of Nursing header, with its original geometry and white/gold colors. The wordmark remains university-owned; this use does not imply affiliation or endorsement. Source: https://nursing.charlotte.edu/. The community nursing visual is an original CSS/Lucide illustration. Font license: `node_modules/@fontsource/barlow-condensed/LICENSE` (installed with dependencies).

## Disclaimer

Independent technical demonstration. Not an official UNC Charlotte or HRSA website. All participant data shown is fictional.
