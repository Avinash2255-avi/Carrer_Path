import React from "react";
import SkillGapResult from "./SkillGapResult";
import RoadmapView from "./RoadmapView";
import NewsList from "./NewsList";

function Dashboard({ skillGapResult, roadmap, news, onBack }) {
  return (
    <div className="main-card">
      <div className="button-row" style={{ justifyContent: "space-between", marginTop: 0 }}>
        <button className="btn btn-secondary" onClick={onBack}>
          &larr; Back to input
        </button>
        <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
          All data below is driven by backend APIs and HackerNews.
        </span>
      </div>

      <div className="dashboard-layout" style={{ marginTop: "1rem" }}>
        <div className="card">
          <h3 className="section-title">Skill Gap Analysis</h3>
          {skillGapResult ? (
            <SkillGapResult result={skillGapResult} />
          ) : (
            <p style={{ fontSize: "0.85rem" }}>No data yet. Run an analysis first.</p>
          )}
        </div>

        <div className="card">
          <h3 className="section-title">Career Roadmap</h3>
          {roadmap ? (
            <RoadmapView roadmap={roadmap} />
          ) : (
            <p style={{ fontSize: "0.85rem" }}>No roadmap available.</p>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: "1.25rem" }}>
        <h3 className="section-title">Latest Tech News (HackerNews)</h3>
        <NewsList news={news} />
      </div>
    </div>
  );
}

export default Dashboard;
