import React, { useEffect, useState } from "react";
import "./MyEntries.css";
function MyEntries() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/contest-entries/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setEntries(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <section className="max-w-3xl mx-auto bg-white p-4 shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">MY SCORE</h2>
      {entries.length === 0 ? (
        <p>You have not submitted any entries yet.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2 border">Contest</th>
              <th className="text-left p-2 border">Submission</th>
              <th className="text-left p-2 border">Score</th>
              <th className="text-left p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry._id}>
                <td className="p-2 border">{entry.contest?.title}</td>
                <td className="p-2 border">{entry.submission}</td>
                <td className="p-2 border">{entry.score}</td>
                <td className="p-2 border">{entry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default MyEntries;
