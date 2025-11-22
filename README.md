# Career Path Assistant – CodeAtRandom AI Full‑Stack Assignment

This repository contains a **minimal, structured full‑stack implementation** of the assignment:

- Skill‑gap analyzer API
- Career roadmap generator API (mock AI logic)
- Public API integration with **HackerNews**
- React dashboard that combines everything

The project is split into:

- `/backend` – Node.js + Express
- `/frontend` – React (Create React App style)

> You can deploy the backend (Render / Railway / EC2 / etc.) and the frontend (Vercel / Netlify) separately.
> Then set `REACT_APP_API_BASE_URL` in the frontend to point to your backend URL.

---

## 1. Tech Stack

**Frontend**

- React 18
- Fetch API for HTTP calls
- Plain CSS for a simple responsive layout

**Backend**

- Node.js + Express
- `node-fetch` to call HackerNews API
- CORS enabled for local dev

**Database**

- Not used in this round (all logic is in‑memory / mock).

You can later extend the backend to persist inputs to a JSON file if you want extra brownie points.

---

## 2. How to Run – Backend

```bash
cd backend
npm install
npm run dev   # or: npm start
```

The backend will run on **http://localhost:4000** by default.

### Backend Endpoints

#### 1) `POST /api/skill-gap`

**Body (JSON)**

```json
{
  "targetRole": "Backend Developer",
  "currentSkills": "Java, SQL, Git"
}
```

- `currentSkills` can be:
  - A **comma‑separated string** `"Java, SQL, Git"`
  - Or an **array of strings** `["Java", "SQL", "Git"]`

**Supported roles (demo):**

- `Frontend Developer`
- `Backend Developer`
- `Data Analyst`

These map to the predefined JSON from the problem statement:

```json
{
  "FrontendDeveloper": ["HTML", "CSS", "JavaScript", "React", "Git"],
  "Backend Developer": ["Java", "Spring Boot", "SQL", "APIs", "Git"],
  "Data Analyst": ["Excel", "SQL", "Python", "Dashboards", "Statistics"]
}
```

For convenience, both `"FrontendDeveloper"` and `"Frontend Developer"` are supported internally.

**Success Response Example**

```json
{
  "targetRole": "Backend Developer",
  "requiredSkills": ["Java", "Spring Boot", "SQL", "APIs", "Git"],
  "matchedSkills": ["Java", "SQL"],
  "missingSkills": ["Spring Boot", "APIs", "Git"],
  "recommendations": [
    "Focus on learning the missing core skills: Spring Boot, APIs, Git. Start with fundamentals first, then move into frameworks and tools.",
    "Create at least one small project for every 1–2 new skills you learn to make the knowledge stick."
  ],
  "suggestedLearningOrder": [
    "Spring Boot",
    "APIs",
    "Git",
    "Java",
    "SQL"
  ]
}
```

#### 2) `POST /api/roadmap`

**Body (JSON)**

```json
{
  "targetRole": "Backend Developer"
}
```

**Success Response Example**

```json
{
  "targetRole": "Backend Developer",
  "phases": [
    {
      "phase": "Phase 1 (1–2 months)",
      "focus": "Core language and Git fundamentals",
      "topics": ["Java basics", "OOP concepts", "Collections", "Git & GitHub basics"]
    },
    {
      "phase": "Phase 2 (2 months)",
      "focus": "Backend ecosystem",
      "topics": ["Spring Boot fundamentals", "REST APIs", "SQL & relational DB basics"]
    },
    {
      "phase": "Phase 3 (1–2 months)",
      "focus": "Production readiness",
      "topics": ["Deployment (Heroku/AWS)", "Building 2–3 projects", "Intro to system design"]
    }
  ]
}
```

If the role is **not** recognised, a **generic 3‑phase roadmap** is returned:
- Phase 1: fundamentals
- Phase 2: ecosystem + projects
- Phase 3: capstone + interview prep

#### 3) `GET /api/news/top-stories`

Fetches top stories from **HackerNews** and returns the latest 5 stories with the required fields.

**Response Example**

```json
{
  "stories": [
    {
      "id": 123,
      "title": "Some tech story",
      "url": "https://example.com",
      "score": 123,
      "time": 1729587392,
      "type": "story",
      "by": "hn_user"
    }
  ]
}
```

The backend internally calls:

- `https://hacker-news.firebaseio.com/v0/topstories.json`
- `https://hacker-news.firebaseio.com/v0/item/<id>.json`

---

## 3. How to Run – Frontend

```bash
cd frontend
npm install
npm start
```

The frontend runs on **http://localhost:3000**.

By default it talks to the backend at `http://localhost:4000`.

To point it to a hosted backend, create a `.env` in `/frontend`:

```env
REACT_APP_API_BASE_URL=https://your-backend-host.com
```

Then rebuild / redeploy the frontend.

---

## 4. Frontend Flow & Pages

### 4.1 Career Goal Input Page (main entry)

Component: `CareerForm`

Fields:

- **Target Role**
  - Select box with:
    - `Frontend Developer`
    - `Backend Developer`
    - `Data Analyst`
    - `Custom / Other (generic roadmap)`
- **Current Skills**
  - Textarea, comma‑separated (e.g. `Java, Spring Boot, SQL, Git`)

Button:

- `Analyze My Career Path`

On submit:

1. Calls `POST /api/skill-gap`
2. Calls `POST /api/roadmap`
3. Calls `GET /api/news/top-stories`

All 3 calls are made from the frontend **via the backend APIs only** (no direct HackerNews call from the React app).

### 4.2 Combined Dashboard Page

Component: `Dashboard`

Layout:

- **Left side**: `SkillGapResult`
  - Required, matched and missing skills as coloured tags
  - Recommendations list
  - Suggested learning order (ordered tags)
- **Right side**: `RoadmapView`
  - 3‑phase roadmap for the role (or generic roadmap)
- **Bottom section**: `NewsList`
  - Latest 5 HackerNews stories with:
    - Title (clickable link)
    - URL
    - Score
    - Time (formatted)
    - Type
    - By (author)

Layout is responsive using plain CSS grid and media queries.

---

## 5. Folder Structure

```text
.
├── backend
│   ├── package.json
│   └── server.js
└── frontend
    ├── package.json
    ├── public
    │   └── index.html
    └── src
        ├── App.css
        ├── App.js
        ├── index.css
        ├── index.js
        ├── services
        │   └── api.js
        └── components
            ├── CareerForm.js
            ├── Dashboard.js
            ├── NewsList.js
            ├── RoadmapView.js
            └── SkillGapResult.js
```

---

## 6. Assumptions & Notes

1. **Roles**
   - The assignment’s predefined JSON is used as the source of truth.
   - `"FrontendDeveloper"` and `"Frontend Developer"` are treated as the same for convenience.
2. **Skill matching**
   - Matching is **case‑insensitive**.
   - Comparison is performed on a normalised version of skill names.
3. **Suggested learning order**
   - Keeps the predefined order but **prioritises missing skills first**, then already‑known skills.
4. **Roadmap logic**
   - Fully **mocked logic** as requested (no AI call).
   - Backend returns a fixed 3‑phase roadmap per supported role.
5. **HackerNews**
   - Top stories are taken from `/v0/topstories.json`.
   - A few extra IDs are fetched, then filtered to the first 5 `story` items.
6. **Error handling**
   - Basic validation on backend (`targetRole` required, proper type for `currentSkills`).
   - Frontend displays a simple banner on failures.

---

## 7. Next Steps / Possible Enhancements

If you want to impress further, you can:

- Persist each request (target role + skills) into a `data.json` file on the backend.
- Add a separate page to view “recent analyses”.
- Add loading skeletons for the dashboard cards.
- Add authentication with a basic email/password login.

---

## 8. Deployment Hints

- Host backend on:
  - Render, Railway, Heroku‑like PaaS, or any Node‑friendly host.
- Host frontend on:
  - Vercel, Netlify, or GitHub Pages (with a proxy to backend).

Once deployed, share in your submission:

1. GitHub repo URL (this project structure).
2. Live backend URL (e.g. `https://your-backend.onrender.com`).
3. Live frontend URL (e.g. `https://your-frontend.vercel.app`).

That will fully satisfy the **“GitHub + README + Live Hosted Link”** requirements.
