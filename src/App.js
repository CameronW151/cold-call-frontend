import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [viewMode, setViewMode] = useState(null); // "log" or "admin"
  const [passwordInput, setPasswordInput] = useState("");

  // Call form state
  const [employee, setEmployee] = useState("");
  const [phone, setPhone] = useState("");
  const [outcome, setOutcome] = useState("");
  const [notes, setNotes] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  // Admin dashboard state
  const [callData, setCallData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogin = () => {
    if (passwordInput === "silvano123") {
      setAuthenticated(true);
      setViewMode("log");
    } else if (passwordInput === "admin789") {
      setAuthenticated(true);
      setViewMode("admin");
    } else {
      alert("Incorrect password");
    }
  };

  useEffect(() => {
    if (authenticated && viewMode === "admin") {
      axios.get("https://cold-call-backend.onrender.com/logs")
        .then((res) => {
          setCallData(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching logs:", err);
          setIsLoading(false);
        });
    }
  }, [authenticated, viewMode]);

  const handleSubmit = async () => {
    if (!employee || !phone || !outcome) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const response = await axios.post("https://cold-call-backend.onrender.com/log", {
        employee,
        phone,
        outcome,
        notes,
      });

      if (response.status === 200) {
        setSubmitMessage("✅ Call logged!");
        setEmployee("");
        setPhone("");
        setOutcome("");
        setNotes("");
      }
    } catch (error) {
      setSubmitMessage("❌ Failed to log call.");
    }
  };

  if (!authenticated) {
    return (
      <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto", textAlign: "center" }}>
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" style={{ width: "120px", marginBottom: "20px" }} />
        <h2>🔒 Enter Password</h2>
        <input
          type="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <br />
        <button onClick={handleLogin} style={{ padding: "10px 20px" }}>
          Unlock
        </button>
      </div>
    );
  }

  if (viewMode === "log") {
    return (
      <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
        <h2>📞 Log a Cold Call</h2>
        <label>Employee*</label>
        <input type="text" value={employee} onChange={(e) => setEmployee(e.target.value)} style={inputStyle} />

        <label>Phone*</label>
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />

        <label>Outcome*</label>
        <select value={outcome} onChange={(e) => setOutcome(e.target.value)} style={inputStyle}>
          <option value="">Select...</option>
          <option value="Answered">Answered</option>
          <option value="Not Answered">Not Answered</option>
          <option value="Voicemail">Voicemail</option>
          <option value="Number Not in Service">Number Not in Service</option>
        </select>

        <label>Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} style={inputStyle} />

        <button onClick={handleSubmit} style={{ padding: "10px 20px", marginTop: "10px" }}>
          Log Call
        </button>

        {submitMessage && <p style={{ marginTop: "10px" }}>{submitMessage}</p>}
      </div>
    );
  }

  if (viewMode === "admin") {
    return (
      <div style={{ padding: "2rem", maxWidth: "1000px", margin: "auto" }}>
        <h2>📋 Cold Call Log Dashboard</h2>
        {isLoading ? (
          <p>Loading call logs...</p>
        ) : callData.length === 0 ? (
          <p>No calls logged yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Employee</th>
                <th style={th}>Phone</th>
                <th style={th}>Outcome</th>
                <th style={th}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {callData.map((log) => (
                <tr key={log.id}>
                  <td style={td}>{log.employee}</td>
                  <td style={td}>{log.phone}</td>
                  <td style={td}>{log.outcome}</td>
                  <td style={td}>{log.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  return null;
}

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px"
};

const th = {
  borderBottom: "2px solid #ccc",
  padding: "8px",
  textAlign: "left",
  backgroundColor: "#f7f7f7"
};

const td = {
  borderBottom: "1px solid #ddd",
  padding: "8px"
};

export default App;
