import React from "react";

function SkillGapResult({ result }) {
  const { targetRole, requiredSkills, matchedSkills, missingSkills, recommendations, suggestedLearningOrder } =
    result || {};

  return (
    <div>
      <p style={{ fontSize: "0.85rem" }}>
        Target role: <strong>{targetRole}</strong>
      </p>

      <div style={{ marginBottom: "0.5rem" }}>
        <strong>Required skills (for demo):</strong>
        <div className="skill-tags">
          {requiredSkills &&
            requiredSkills.map((s) => (
              <span key={s} className="skill-tag">
                {s}
              </span>
            ))}
        </div>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <strong>Matched skills:</strong>
        <div className="skill-tags">
          {matchedSkills && matchedSkills.length > 0 ? (
            matchedSkills.map((s) => (
              <span key={s} className="skill-tag matched">
                {s}
              </span>
            ))
          ) : (
            <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>No overlaps yet.</span>
          )}
        </div>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <strong>Missing skills:</strong>
        <div className="skill-tags">
          {missingSkills && missingSkills.length > 0 ? (
            missingSkills.map((s) => (
              <span key={s} className="skill-tag missing">
                {s}
              </span>
            ))
          ) : (
            <span style={{ fontSize: "0.8rem", color: "#16a34a" }}>
              You cover all demo skills for this role.
            </span>
          )}
        </div>
      </div>

      <div style={{ marginTop: "0.75rem" }}>
        <strong>Recommendations:</strong>
        <ul style={{ fontSize: "0.85rem", paddingLeft: "1.1rem", marginTop: "0.3rem" }}>
          {recommendations &&
            recommendations.map((r, idx) => (
              <li key={idx}>
                {r}
              </li>
            ))}
        </ul>
      </div>

      <div style={{ marginTop: "0.75rem" }}>
        <strong>Suggested learning order:</strong>
        <div className="skill-tags">
          {suggestedLearningOrder &&
            suggestedLearningOrder.map((s, idx) => (
              <span key={s + idx} className="skill-tag">
                {idx + 1}. {s}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}

export default SkillGapResult;
