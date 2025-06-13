import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [callData, setCallData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const correctPassword = "silvano123"; // CHANGE THIS

  useEffect(() => {
    if (authenticated) {
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
  }, [authenticated]);

  const handleLogin = () => {
    if (passwordInput === correctPassword) {
      setAuthenticated(true);
    } else {
      alert("Incorrect password");
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