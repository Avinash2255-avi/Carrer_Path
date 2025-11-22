import React, { useState } from "react";
import CareerForm from "./components/CareerForm";
import Dashboard from "./components/Dashboard";
import { analyzeSkillGap, generateRoadmap, fetchTopStories } from "./services/api";
import "./App.css";

function App() {
  const [skillGapResult, setSkillGapResult] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [news, setNews] = useState([]);
  const [view, setView] = useState("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async ({ targetRole, currentSkills }) => {
    setError("");
    setLoading(true);
    try {
      const [skillGapRes, roadmapRes, newsRes] = await Promise.all([
        analyzeSkillGap(targetRole, currentSkills),
        generateRoadmap(targetRole),
        fetchTopStories(),
      ]);

      setSkillGapResult(skillGapRes);
      setRoadmap(roadmapRes);
      setNews(newsRes.stories || []);
      setView("dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setView("form");
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Career Path Assistant</h1>
        <p className="subtitle">
          Skill-gap analysis, roadmap and latest tech news &mdash; built for the CodeAtRandom AI
          full-stack assignment.
        </p>
      </header>

      {error && <div className="error-banner">{error}</div>}
      {loading && <div className="loading-banner">Analyzing your career path...</div>}

      {view === "form" && <CareerForm onAnalyze={handleAnalyze} />}
      {view === "dashboard" && (
        <Dashboard
          skillGapResult={skillGapResult}
          roadmap={roadmap}
          news={news}
          onBack={handleBack}
        />
      )}

      <footer className="app-footer">
        <small>
          Demo app &ndash; you can extend logic, roles and UI freely. All APIs are mocked except
          HackerNews.
        </small>
      </footer>
    </div>
  );
}

export default App;
