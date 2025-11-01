// src/components/Leaderboard.jsx

import React from "react";
import "./Leaderboard.css";

function Leaderboard({ entries }) {
  // Sort entries descending by score
  const sortedEntries = [...entries].sort((a, b) => b.score - a.score);

  return (
    <section className="leaderboard-container">
      <h2>Leaderboard</h2>
      {entries.length === 0 ? (
        <p className="empty">No entries yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Submission</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedEntries.map((entry, index) => (
              <tr
                key={entry._id}
                className={index === 0 ? "winner" : ""}
              >
                <td data-label="Rank">{index + 1}</td>
                <td data-label="User">
                  {entry.user?.name || entry.user?.email || "Unknown"}
                </td>
                <td data-label="Submission">{entry.submission || "N/A"}</td>
                <td data-label="Score">{entry.score}</td>
                <td data-label="Status">
                  {index === 0 ? (
                    <span>🏆 Winner</span>
                  ) : (
                    entry.status || "Pending"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default Leaderboard;
