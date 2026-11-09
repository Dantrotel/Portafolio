# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and tech leads evaluating a candidate for a first (junior) full stack / backend developer role. They scan the page in a few minutes, often between other candidates, and decide whether to invite Daniel Aguayo to an interview. Tech leads may open the GitHub repos to check the code behind the claims.

## Product Purpose

Personal portfolio of Daniel Aguayo (handle `dantrottel`), Full Stack Developer based in Concepción, Chile, graduate of Ingeniería de Ejecución en Computación e Informática at Universidad del Bío-Bío. Success means a recruiter or tech lead leaves convinced enough to contact him (email, LinkedIn/GitHub) or download the CV for an interview.

## Positioning

Backend with judgment: unlike a typical junior portfolio listing technologies, this one shows the reasoning behind real technical decisions in API and database design. Each project states the problem and the decisions taken (e.g. AcTitUBB: 62 relational tables and 7 SQL views, JWT with server-side token blacklist, two-layer role permissions, the full stack up with one `docker compose up`).

## Operating Context

- Single-page site: hero, skills, projects, background (experience + education), contact.
- Bilingual ES / EN with browser-language detection; Spanish is the primary voice.
- Visitors arrive from CV links, LinkedIn and job applications; desktop review is common, mobile must work.
- Contact is direct (copyable email, profiles, CV PDF), with no form.

## Capabilities and Constraints

- React 19 + Vite + Framer Motion (`domAnimation`), React Icons; deployed as a static site to GitHub Pages at `https://dantrotel.github.io/Portafolio/`.
- Project data lives in `src/data/*.js`; adding a project means adding an object. Projects with "problem" and "decisions" fields get the full treatment.
- Light / dark theme, persisted, no flash on load; respects `prefers-reduced-motion`.
- Projects "La Pirámide" and "Calculadora de costos" have no real content yet: keep them hidden until Daniel provides description and stack. Never invent it.

## Brand Commitments

- Name: Daniel Aguayo; handle `dantrottel`.
- Voice: first person, plain and direct, honest about being early-career ("Estoy buscando mi primer rol como desarrollador"); concrete numbers over adjectives.
- Existing assets: `public/profile.webp`, `public/CV.pdf`, `public/og-image.png`, `public/favicon.webp`.

## Evidence on Hand

- Projects with real detail and code: AcTitUBB (approved capstone, `public/projects/comision.png` screenshot, github.com/Dantrotel/AcTitUBB), MusicClassifier (SVM on FMA Small, 58% accuracy, RAG with LangChain/ChromaDB), Multithreaded Race Simulation (C++, std::thread, mutex), DJ Bot for Discord (description only, no repo link).
- Experience: mobile developer internship at Agartha Marketing Agency (Apr–Jun 2024, React Native/Expo, Google Maps API); IT support at Asmar (Jun–Dec 2022).
- No testimonials, client logos, live demos or production metrics exist; do not fabricate any.

## Product Principles

1. Show the reasoning, not just the stack: decisions and trade-offs are the proof.
2. Respect the recruiter's time: the strongest evidence (AcTitUBB) must be reachable fast and readable in a scan.
3. Every claim is verifiable: link code where it exists, state numbers exactly, never inflate seniority.
4. Both languages are first-class: any copy change ships in ES and EN.

## Accessibility & Inclusion

Keyboard navigation with skip link, theme toggle and reduced-motion support are existing commitments to preserve.
