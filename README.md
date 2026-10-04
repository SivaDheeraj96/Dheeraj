# obulam.com — Personal Portfolio

Personal portfolio site for **Siva Dheeraj Reddy Obulam**, hosted at [obulam.com](https://obulam.com).

Built with React + TypeScript, deployed via GitHub Pages.

---

## Tech stack

- **React 18** + **TypeScript**
- **SCSS Modules** for component-scoped styles
- **Create React App** as the build tool
- **gh-pages** for deployment to GitHub Pages
- **Google Fonts** — Inter + Fira Code

## Sections

| Section | Description |
|---|---|
| Home | Hero with name, tagline, about blurb, stats, and core tech |
| Skills | Skill tags grouped by category |
| Experience | Timeline — Sigma Computing, Zoho Analytics |
| Education | Northeastern University, SASTRA University + IEEE publication |
| Contact | Email, GitHub, LinkedIn |

The left sidebar collapses to icon-only navigation. Scrolling the page auto-highlights the active section icon via `IntersectionObserver`.

## Local development

```bash
npm install
npm start        # dev server at http://localhost:3000
npm run build    # production build → /build
```

## Deploying

```bash
npm run deploy   # builds and pushes to the gh-pages branch
```

GitHub Pages serves the `gh-pages` branch. The `public/CNAME` file routes it to `obulam.com`.

> After merging changes, run `npm run deploy` from the repo root to publish.

## Updating content

All site content lives in one file:

```
src/portfolio/data/info.json
```

Edit that file to update your name, title, about text, skills, experience, education, publications, and contact info. No component changes needed for content updates.

## Project structure

```
src/
  portfolio/
    data/
      info.json          ← all site content
    static/
      profile-pic.jpeg   ← profile photo
    homepage/
      Homepage.tsx       ← layout + scroll tracking
      LeftRail.tsx       ← icon sidebar
    Home/                ← hero section
    skills/
    experience/
    education/
    contact/
    styles/
      theme.module.scss  ← color tokens
      general.module.scss← shared mixins
public/
  CNAME                  ← custom domain (obulam.com)
```
