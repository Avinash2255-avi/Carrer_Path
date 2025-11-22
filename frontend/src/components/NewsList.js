import React from "react";

function formatUnixTime(unix) {
  if (!unix) return "";
  const date = new Date(unix * 1000);
  return date.toLocaleString();
}

function NewsList({ news }) {
  if (!news || news.length === 0) {
    return <p style={{ fontSize: "0.85rem" }}>No news yet. Run an analysis to trigger fetch.</p>;
  }

  return (
    <ul className="news-list">
      {news.map((item) => (
        <li key={item.id} className="news-item">
          <p className="news-title">
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none", color: "#1d4ed8" }}
            >
              {item.title}
            </a>
          </p>
          <p className="news-meta">
            <span className="badge">Score: {item.score}</span>
            <span className="badge">By: {item.by}</span>
            <span className="badge">Type: {item.type}</span>
            <span style={{ marginLeft: "0.25rem" }}>{formatUnixTime(item.time)}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}

export default NewsList;
