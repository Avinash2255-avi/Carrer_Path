import React, { useState } from "react";

const defaultSkillsPlaceholder =
  "Example: Java, Spring Boot, SQL, Git (comma separated). Leave empty if starting from scratch.";

function CareerForm({ onAnalyze }) {
  const [targetRole, setTargetRole] = useState("Backend Developer");
  const [currentSkills, setCurrentSkills] = useState("");
  const [customRole, setCustomRole] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!targetRole.trim()) return;

    
    let roleToSend = targetRole;
    if (targetRole === "Custom") {
      roleToSend = customRole.trim() || "Custom Role";
    }

    onAnalyze({
      targetRole: roleToSend,
      currentSkills,
    });
  };

  return (
    <div className="main-card">
      <h2 className="section-title">Step 1: Tell us your career goal</h2>
      <p style={{ fontSize: "0.85rem", marginBottom: "1rem" }}>
        Enter your target role and current skills. We&apos;ll call the backend skill-gap API,
        generate a roadmap, and then fetch the latest tech news from HackerNews.
      </p>
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-field">
          <label htmlFor="targetRole">Target Role</label>
          <select
            id="targetRole"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          >
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="Custom">Custom / Other (uses generic roadmap)</option>
          </select>
          <p className="helper-text">
            The assignment explicitly mentions Backend Developer, FrontendDeveloper, and Data
            Analyst. You can also choose a custom role.
          </p>
        </div>

        <div className="form-field">
          <label htmlFor="customRole">Custom Role (optional)</label>
          <input
            id="customRole"
            type="text"
            placeholder='Example: "Python Developer" or "Machine Learning Engineer"'
            disabled={targetRole !== "Custom"}
            value={customRole}
            onChange={(e) => setCustomRole(e.target.value)}
          />
          <p className="helper-text">
            When &quot;Custom&quot; is selected above, this value will be sent to the backend.
            Roadmap becomes generic, and skill-gap falls back to generic guidance.
          </p>
        </div>

        <div className="form-field">
          <label htmlFor="currentSkills">Current Skills (comma separated)</label>
          <textarea
            id="currentSkills"
            value={currentSkills}
            placeholder={defaultSkillsPlaceholder}
            onChange={(e) => setCurrentSkills(e.target.value)}
          />
          <p className="helper-text">We send this as-is to the backend skill-gap API.</p>
        </div>

        <div className="button-row">
          <button type="submit" className="btn btn-primary">
            Analyze My Career Path
          </button>
        </div>
      </form>
    </div>
  );
}

export default CareerForm;
