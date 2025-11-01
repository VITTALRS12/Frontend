import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CompletedContestsPage.css";

function CompletedContestsPage() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/contests/completed")
      .then((res) => {
        setContests(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="completed-contests-page">
      <h1>🏁 Completed Contests</h1>

      {loading ? (
        <p className="loading-text">Loading contests...</p>
      ) : contests.length === 0 ? (
        <p className="no-contests">No completed contests found.</p>
      ) : (
        contests.map((c) => (
          <div key={c._id} className="contest-card">
            <h2>{c.title}</h2>
            <p>{c.description}</p>
            <p className="ended-date">
              Ended on: {new Date(c.endDate).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default CompletedContestsPage;
