// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Leaderboard from "../components/Leaderboard";
// import EntryForm from "../components/EntryForm";

// const API = "http://localhost:5000";

// export default function ContestPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [contest, setContest] = useState(null);
//   const [entries, setEntries] = useState([]);
//   const [winner, setWinner] = useState(null);
//   const [contestEnded, setContestEnded] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const fetchContestData = async () => {
//     try {
//       const [contestRes, leaderboardRes] = await Promise.all([
//         fetch(`${API}/api/contests/${id}`),
//         fetch(`${API}/api/contest-entries/contest/${id}/leaderboard`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }),
//       ]);

//       if (!contestRes.ok) throw new Error("Invalid contest");
//       const contestData = await contestRes.json();
//       const leaderboardData = await leaderboardRes.json();

//       setContest(contestData);
//       setEntries(Array.isArray(leaderboardData) ? leaderboardData : leaderboardData.entries || []);
//       setWinner(leaderboardData.winner || null);
//       setContestEnded(leaderboardData.contestEnded || false);
//     } catch (err) {
//       console.error("Contest page error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchContestData();
//   }, [id]);

//   if (loading) return <p>Loading contest...</p>;
//   if (!contest) return <p>❌ Contest not found.</p>;

//   return (
//     <div className="contest-page">
//       <button onClick={() => navigate(-1)} className="back-button">← Back</button>
//       <h2>{contest.title}</h2>
//       <p>{contest.description}</p>
//       <p><strong>Dates:</strong> {new Date(contest.startDate).toLocaleDateString()} - {new Date(contest.endDate).toLocaleDateString()}</p>

//       {contestEnded && winner && (
//         <div className="winner-banner">
//           🏅 Winner: {winner.name} (Score: {winner.score})
//         </div>
//       )}

//       <Leaderboard entries={entries} contestEnded={contestEnded} />

//       {!contestEnded && (
//         <EntryForm
//           contestId={id}
//           onSuccess={() => fetchContestData()}
//         />
//       )}
//     </div>
//   );
// }
