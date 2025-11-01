import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EntryForm.css";

function EntryForm({ contestId, onSuccess }) {
  const [matrix, setMatrix] = useState([]);
  const [revealed, setRevealed] = useState(Array(12).fill(false));
  const [submission, setSubmission] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [timer, setTimer] = useState(120);
  const [timerActive, setTimerActive] = useState(false);

  const generateMatrix = () => {
    const digits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
    setMatrix(digits);
    setRevealed(Array(12).fill(false));
    setSubmission("");
    setTimer(120);
    setTimerActive(false);
    setMessage("");
  };

  useEffect(() => {
    generateMatrix();
  }, []);

  useEffect(() => {
    if (timerActive && timer > 0) {
      const countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timerActive, timer]);

  const handleReveal = (index) => {
    if (submission.length >= 12) return;

    // Reveal the current digit
    const updatedRevealed = [...revealed];
    updatedRevealed[index] = true;
    setRevealed(updatedRevealed);

    // Start timer if this is the first click
    if (submission.length === 0) {
      setTimerActive(true);
    }

    // Add the digit to submission
    setSubmission((prev) => prev + matrix[index].toString());

    // After 500ms, hide it and replace with new random digit
    setTimeout(() => {
      const newMatrix = [...matrix];
      newMatrix[index] = Math.floor(Math.random() * 10);
      setMatrix(newMatrix);

      const hideRevealed = [...revealed];
      hideRevealed[index] = false;
      setRevealed(hideRevealed);
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("⚠️ Please log in to submit your entry.");
      return;
    }

    if (!/^\d{12}$/.test(submission)) {
      setMessage("Submission must be exactly 12 digits.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/contest-entries",
        { contestId, submission },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200 || res.status === 201) {
        setMessage("✅ Entry submitted successfully!");
        generateMatrix();
        if (onSuccess) onSuccess();
      } else {
        setMessage(res.data?.message || "Submission failed.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setMessage(err.response?.data?.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contest-container">
      <section className="contest-header">
        <h2>🎯 Contest Entry</h2>
        <p>Reveal digits and submit your 12-digit entry.</p>
      </section>

      <form onSubmit={handleSubmit} className="contest-form">
        <div className="matrix-grid">
          {matrix.map((digit, idx) => (
            <button
              key={idx}
              type="button"
              disabled={submission.length >= 12}
              onClick={() => handleReveal(idx)}
              className={`matrix-cell ${revealed[idx] ? "revealed" : ""}`}
            >
              {revealed[idx] ? digit : "?"}
            </button>
          ))}
        </div>

        <div className="score-display">
          <strong>Submission:</strong> {submission.padEnd(12, "_")}
        </div>

        <div className="timer-display">⏳ {timer}s remaining</div>

        <button
          type="submit"
          disabled={submitting || submission.length !== 12 || timer <= 0}
          className="submit-button"
        >
          {submitting ? "Submitting..." : "Submit Entry"}
        </button>

        {message && <div className="error-message">{message}</div>}
      </form>
    </div>
  );
}

export default EntryForm;
