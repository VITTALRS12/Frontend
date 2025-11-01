import React from "react";
import "./ContestList.css";

function ContestList({ contests, onSelect, selectedId, title }) {
  return (
    <section className="contest-list-wrapper">
      {/* Main Heading */}
      <h1 className="hero-title">🏆 Discover Exciting Contests!</h1>

      {/* Section Title */}
      <h2>{title}</h2>

      {/* Contest List */}
      {contests.length === 0 ? (
        <p className="no-contests">No contests available at the moment. Check back soon!</p>
      ) : (
        contests.map((contest) => (
          <div
            key={contest._id}
            className={`contest ${selectedId === contest._id ? "selected" : ""}`}
            onClick={() => onSelect(contest)}
          >
            {contest.imageUrl && (
              <img
                src={contest.imageUrl}
                alt={contest.title}
                className="contest-img"
              />
            )}
            <div className="contest-content">
              <h3>{contest.title}</h3>
              <small>
                {new Date(contest.startDate).toLocaleDateString()} -{" "}
                {new Date(contest.endDate).toLocaleDateString()}
              </small>
            </div>
          </div>
        ))
      )}
    </section>
  );
}

export default ContestList;
