# Adithyan — AI & ML Engineer Portfolio

A premium, product-grade personal portfolio website built with React 19, TypeScript, Tailwind CSS v4, and Framer Motion. 

This website is architected like a digital product to communicate precision, craftsmanship, engineering quality, and simplicity.

---

## 🚀 Environment Setup & Installation

Since Node.js is not configured in the standard system path, you will need to follow these steps to run the project locally:

1. **Install Node.js:** Download and install the latest stable version of [Node.js](https://nodejs.org/) (v20+ recommended).
2. **Open Terminal:** Navigate to the project root directory:
   ```bash
   cd "d:\my portfolio"
   ```
3. **Install Dependencies:**
   ```bash
   npm install
   ```
4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## 📁 Folder Structure

```text
src/
├── app/                  # Application bootstrap, routing (App.tsx, main.tsx)
├── assets/               # Minimal static abstract asset layers
├── components/           # Reusable UI primitives and layouts
│   ├── ui/               # Button, CustomImage, ErrorBoundary, AnimatedBackground, LoadingScreen
│   └── layout/           # Container, Section, SectionHeading, Grid, Stack primitives
├── modules/              # Unified features (Timeline modules, forms, indicators)
├── sections/             # Page sections (Hero, Philosophy, SelectedProjects, Education, Skills, R&D, About, Contact)
├── pages/                # Page route components (Home, ProjectDetail, NotFound, ProjectNotFound)
├── layouts/              # Global shell wrappers (Navbar, Footer, ScrollProgress, MainLayout)
├── hooks/                # Custom hooks (useScroll, useLenis)
├── data/                 # Segmented data files (projects.ts, skills.ts, etc.)
├── constants/            # Global configs (theme.ts, animations.ts, seo.ts)
├── lib/                  # Library configurations (Lenis config)
├── types/                # Core TypeScript interfaces (portfolio.ts)
├── utils/                # Utility modules (seo.ts, schema.ts)
└── styles/               # Global styling entry point (global.css)
```

---

## ⚙️ How to Update Portfolio Content

All copy, project listings, and technologies are completely decoupled from component templates. You do not need to edit any UI code to modify your content.

Simply edit the corresponding data files under `src/data/`:

- **Selected Projects:** Edit `src/data/projects.ts` to add, edit, or delete featured case studies. The route pages (e.g. `/projects/desktop-buddy`) will build dynamically based on the slug.
- **R&D Work:** Edit `src/data/rd.ts` to update what you are currently building or experimenting with.
- **Skills:** Edit `src/data/skills.ts` to modify categorized expertise groupings and lists.
- **Education:** Edit `src/data/education.ts` to update certifications, coursework, and milestones.
- **Socials & Links:** Edit `src/data/socials.ts` to update your email, GitHub, LinkedIn profiles, or resume download path.
- **Featured Technologies:** Edit `src/data/technologies.ts` to update the scrolling marquee list in the Hero.

---

## 🛠️ Build and Deploy

To create an optimized production bundle ready for hosting on Vercel, Netlify, or GitHub Pages:

```bash
npm run build
```

This compiles TypeScript definitions (`tsc`) and bundles the static assets (`vite build`) under the `dist/` directory.

### Performance Targets
This site is optimized to meet the following budgets:
- **First Contentful Paint (FCP):** < 1.5s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Cumulative Layout Shift (CLS):** < 0.1
- **Interaction to Next Paint (INP):** < 200ms
- **Lighthouse Performance Score:** &ge; 95

---

## 🎨 Motion & Design System

The visual design is anchored on whitespace and typography, avoiding distracting glowing neon edges or glassmorphism overload.
- **Accent Color:** `#4F8CFF` (used only for highlighting interaction states).
- **Core Easing:** `cubic-bezier(.22, 1, .36, 1)` for hardware-accelerated transforms (`opacity` and `transform` properties only).
- **Wow Moment:** Premium dynamic loading sequence drawing the AL SVG monogram, and soft, delayed case study transitions.
