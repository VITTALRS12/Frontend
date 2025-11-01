import React, { useState, useEffect } from "react";
import ContestList from "../components/ContestList";
import Leaderboard from "../components/Leaderboard";
import EntryForm from "../components/EntryForm";
import "./HomePage.css";

const API = "http://localhost:5000";

function HomePage() {
  const [activeContests, setActiveContests] = useState([]);
  const [completedContests, setCompletedContests] = useState([]);
  const [selectedContest, setSelectedContest] = useState(null);
  const [leaderboardEntries, setLeaderboardEntries] = useState([]);
  const [winner, setWinner] = useState(null);
  const [contestEnded, setContestEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [activeRes, completedRes] = await Promise.all([
          fetch(`${API}/api/contests/active`),
          fetch(`${API}/api/contests/completed`)
        ]);
        
        const [activeData, completedData] = await Promise.all([
          activeRes.json(),
          completedRes.json()
        ]);
        
        setActiveContests(activeData);
        setCompletedContests(completedData);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadLeaderboard = async (contestId) => {
    try {
      const res = await fetch(`${API}/api/contest-entries/contest/${contestId}/leaderboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      
      setLeaderboardEntries(Array.isArray(data) ? data : data.entries || []);
      setWinner(data.winner || null);
      setContestEnded(data.contestEnded || false);
    } catch (error) {
      console.error("Leaderboard error:", error);
    }
  };

  const handleSelectContest = (contest) => {
    setSelectedContest(contest);
    loadLeaderboard(contest._id);
  };

  return (
    <div className="cyber-container">
      <div className="cyber-header">
        <h1 className="cyber-title glitch" data-text="CONTEST PLATFORM">CONTEST PLATFORM</h1>
        <div className="cyber-line"></div>
      </div>

      {isLoading ? (
        <div className="cyber-loading">
          <div className="cyber-spinner"></div>
          <p>LOADING DATABASE CONNECTION...</p>
        </div>
      ) : (
        <>
          <ContestList
            contests={activeContests}
            onSelect={handleSelectContest}
            selectedId={selectedContest?._id}
            title="ACTIVE CONTESTS"
            variant="active"
          />

          <ContestList
            contests={completedContests}
            onSelect={handleSelectContest}
            title="ARCHIVED CONTESTS"
            variant="completed"
          />

          {selectedContest && (
            <div className="cyber-dashboard">
              {contestEnded && winner && (
                <div className="cyber-winner-panel">
                  <div className="cyber-winner-badge">🏆 VICTORY</div>
                  <div className="cyber-winner-content">
                    {winner.imageUrl && (
                      <div className="cyber-winner-avatar">
                        <img
                          src={winner.imageUrl}
                          alt={winner.name}
                          className="cyber-avatar-img"
                        />
                        <div className="cyber-avatar-glow"></div>
                      </div>
                    )}
                    <div className="cyber-winner-info">
                      <h2 className="cyber-winner-name">{winner.name}</h2>
                      <p className="cyber-winner-score">SCORE: <span>{winner.score}</span></p>
                    </div>
                  </div>
                  <div className="cyber-winner-decoration"></div>
                </div>
              )}

              <Leaderboard 
                entries={leaderboardEntries} 
                contestEnded={contestEnded}
              />

              {!contestEnded && (
                <EntryForm
                  contestId={selectedContest._id}
                  onSuccess={() => loadLeaderboard(selectedContest._id)}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HomePage;