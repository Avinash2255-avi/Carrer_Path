const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

async function handleResponse(response) {
  if (!response.ok) {
    const text = await response.text();
    let message = "API request failed";
    try {
      const data = JSON.parse(text);
      message = data.error || data.message || message;
    } catch {
      
    }
    throw new Error(message);
  }
  return response.json();
}

export async function analyzeSkillGap(targetRole, currentSkills) {
  const body = {
    targetRole,
    currentSkills,
  };
  const res = await fetch(`${BASE_URL}/api/skill-gap`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function generateRoadmap(targetRole) {
  const body = { targetRole };
  const res = await fetch(`${BASE_URL}/api/roadmap`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function fetchTopStories() {
  const res = await fetch(`${BASE_URL}/api/news/top-stories`);
  return handleResponse(res);
}
