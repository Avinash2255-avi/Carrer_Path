import React from "react";

function RoadmapView({ roadmap }) {
  const { targetRole, phases } = roadmap || {};

  return (
    <div>
      <p style={{ fontSize: "0.85rem", marginBottom: "0.75rem" }}>
        Roadmap for: <strong>{targetRole}</strong>
      </p>

      {phases &&
        phases.map((phase) => (
          <div key={phase.phase} className="roadmap-phase">
            <h4>{phase.phase}</h4>
            <p style={{ fontSize: "0.8rem", margin: 0, color: "#4b5563" }}>{phase.focus}</p>
            <ul>
              {phase.topics.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}

export default RoadmapView;
