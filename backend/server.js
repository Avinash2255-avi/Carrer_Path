const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());


const ROLE_SKILLS = {
  FrontendDeveloper: ["HTML", "CSS", "JavaScript", "React", "Git"],
  "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "Git"],
  "Backend Developer": ["Java", "Spring Boot", "SQL", "APIs", "Git"],
  "Data Analyst": ["Excel", "SQL", "Python", "Dashboards", "Statistics"],
};


const ROADMAPS = {
  "Backend Developer": [
    {
      phase: "Phase 1 (1–2 months)",
      focus: "Core language and Git fundamentals",
      topics: ["Java basics", "OOP concepts", "Collections", "Git & GitHub basics"],
    },
    {
      phase: "Phase 2 (2 months)",
      focus: "Backend ecosystem",
      topics: ["Spring Boot fundamentals", "REST APIs", "SQL & relational DB basics"],
    },
    {
      phase: "Phase 3 (1–2 months)",
      focus: "Production readiness",
      topics: ["Deployment (Heroku/AWS)", "Building 2–3 projects", "Intro to system design"],
    },
  ],
  "Frontend Developer": [
    {
      phase: "Phase 1 (1–2 months)",
      focus: "Web foundations",
      topics: ["HTML & semantic tags", "CSS layout (Flexbox, Grid)", "Basic JavaScript"],
    },
    {
      phase: "Phase 2 (2 months)",
      focus: "Modern frontend",
      topics: ["React basics", "State & props", "Component patterns", "Git & GitHub"],
    },
    {
      phase: "Phase 3 (1–2 months)",
      focus: "Advanced topics & projects",
      topics: ["Routing", "API integration", "State management intro", "1–2 portfolio projects"],
    },
  ],
  "Data Analyst": [
    {
      phase: "Phase 1 (1–2 months)",
      focus: "Data fundamentals",
      topics: ["Excel basics", "Data cleaning", "Basic charts", "Intro to SQL"],
    },
    {
      phase: "Phase 2 (2 months)",
      focus: "Programming & analytics",
      topics: [
        "Python for data analysis",
        "Pandas & NumPy basics",
        "Intermediate SQL (JOINs, GROUP BY)",
      ],
    },
    {
      phase: "Phase 3 (1–2 months)",
      focus: "Business dashboards & storytelling",
      topics: ["Power BI / Tableau / Dashboards", "Statistics basics", "End-to-end case study"],
    },
  ],
};


function normaliseSkill(skill) {
  return skill.trim().toLowerCase();
}


app.post("/api/skill-gap", (req, res) => {
  try {
    let { targetRole, currentSkills } = req.body;

    if (!targetRole) {
      return res.status(400).json({ error: "targetRole is required" });
    }

    
    if (!currentSkills) {
      currentSkills = [];
    } else if (typeof currentSkills === "string") {
      currentSkills = currentSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (!Array.isArray(currentSkills)) {
      return res.status(400).json({
        error: "currentSkills must be an array of strings or a comma-separated string",
      });
    }

    const normalisedCurrent = currentSkills.map(normaliseSkill);

    
    let requiredSkills = null;

    
    for (const key of Object.keys(ROLE_SKILLS)) {
      if (key.toLowerCase() === targetRole.trim().toLowerCase()) {
        requiredSkills = ROLE_SKILLS[key];
        targetRole = key; // canonical name
        break;
      }
    }

    
    if (!requiredSkills) {
      const userSkills = currentSkills.map((s) => s.trim()).filter(Boolean);

      let recommendations = [];
      if (userSkills.length === 0) {
        recommendations = [
          `This is a custom or unsupported role in this demo, so there is no predefined skill list for "${targetRole}".`,
          "Study 5–10 job descriptions for this role, list recurring skills (8–12), and treat those as your required skills.",
        ];
      } else {
        recommendations = [
          `You already have a starting stack for ${targetRole}: ${userSkills.join(
            ", "
          )}. Next, compare this with job descriptions and add missing tools.`,
          "Prioritise: 1 core language, 1 main framework, databases, version control (Git), and 1–2 real projects.",
        ];
      }

      return res.json({
        targetRole,
        requiredSkills: userSkills,      
        matchedSkills: userSkills,       
        missingSkills: [],
        recommendations,
        suggestedLearningOrder: userSkills,
      });
    }

    
    const matchedSkills = [];
    const missingSkills = [];

    requiredSkills.forEach((skill) => {
      if (normalisedCurrent.includes(normaliseSkill(skill))) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    const recommendations = [];

    if (missingSkills.length === 0) {
      recommendations.push(
        "You already cover all the core skills for this demo role. Next, focus on building 2–3 solid projects and practicing interview problems."
      );
    } else {
      recommendations.push(
        `Focus on learning the missing core skills: ${missingSkills.join(
          ", "
        )}. Start with fundamentals first, then move into frameworks and tools.`
      );
      recommendations.push(
        "Create at least one small project for every 1–2 new skills you learn to make the knowledge stick."
      );
    }

    
    const suggestedLearningOrder = [
      ...requiredSkills.filter((s) => missingSkills.includes(s)),
      ...requiredSkills.filter((s) => matchedSkills.includes(s)),
    ];

    res.json({
      targetRole,
      requiredSkills,
      matchedSkills,
      missingSkills,
      recommendations,
      suggestedLearningOrder,
    });
  } catch (err) {
    console.error("Error in /api/skill-gap:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/api/roadmap", (req, res) => {
  try {
    let { targetRole } = req.body;

    if (!targetRole) {
      return res.status(400).json({ error: "targetRole is required" });
    }

    let roadmap = null;
    let canonicalRole = targetRole;

    for (const key of Object.keys(ROADMAPS)) {
      if (key.toLowerCase() === targetRole.trim().toLowerCase()) {
        roadmap = ROADMAPS[key];
        canonicalRole = key;
        break;
      }
    }

    if (!roadmap) {
      
      roadmap = [
        {
          phase: "Phase 1 (1–2 months)",
          focus: "Fundamentals of the role",
          topics: ["Core language / tools", "Basic concepts", "Version control (Git)"],
        },
        {
          phase: "Phase 2 (2 months)",
          focus: "Applied skills & ecosystem",
          topics: [
            "Most used framework / library",
            "Databases or integrations",
            "Build 1–2 guided projects",
          ],
        },
        {
          phase: "Phase 3 (1–2 months)",
          focus: "Projects & interview prep",
          topics: [
            "1 capstone project",
            "System / problem-solving basics",
            "Resume & portfolio polishing",
          ],
        },
      ];
    }

    res.json({
      targetRole: canonicalRole,
      phases: roadmap,
    });
  } catch (err) {
    console.error("Error in /api/roadmap:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/api/news/top-stories", async (req, res) => {
  try {
    const topStoriesResponse = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );
    const ids = await topStoriesResponse.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(500).json({ error: "Failed to fetch top stories from HackerNews" });
    }

    const top5Ids = ids.slice(0, 10); // take a few extra in case some are deleted

    const storyPromises = top5Ids.map((id) =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((r) => r.json())
    );

    const storiesRaw = await Promise.all(storyPromises);

    const stories = storiesRaw
      .filter((s) => s && s.type === "story")
      .slice(0, 5)
      .map((s) => ({
        id: s.id,
        title: s.title,
        url: s.url || `https://news.ycombinator.com/item?id=${s.id}`,
        score: s.score,
        time: s.time,
        type: s.type,
        by: s.by,
      }));

    res.json({ stories });
  } catch (err) {
    console.error("Error in /api/news/top-stories:", err);
    res.status(500).json({ error: "Failed to fetch news from HackerNews" });
  }
});


app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Career assistant backend is running" });
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
