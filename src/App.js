import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [viewMode, setViewMode] = useState(null); // "log" or "admin"
  const [loginRole, setLoginRole] = useState("employee");
  const [passwordInput, setPasswordInput] = useState("");

  // Call form state
  const [employee, setEmployee] = useState("");
  const [phone, setPhone] = useState("");
  const [outcome, setOutcome] = useState("");
  const [notes, setNotes] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  // Admin dashboard state
  const [callData, setCallData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const handleLogout = () => {
  setAuthenticated(false);
  setPasswordInput("");
  setViewMode(null);
};

  const handleLogin = () => {
  if (loginRole === "employee" && passwordInput === "silvano123") {
    setAuthenticated(true);
    setViewMode("log");
  } else if (loginRole === "admin" && passwordInput === "admin789") {
    setAuthenticated(true);
    setViewMode("admin");
  } else {
    alert("Incorrect password for selected role");
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
    <h2>🔒 Log In</h2>

    <div style={{ marginBottom: "10px", textAlign: "left" }}>
      <label>
        <input
          type="radio"
          value="employee"
          checked={loginRole === "employee"}
          onChange={() => setLoginRole("employee")}
        />{" "}
        Employee
      </label>
      <br />
      <label>
        <input
          type="radio"
          value="admin"
          checked={loginRole === "admin"}
          onChange={() => setLoginRole("admin")}
        />{" "}
        Admin
      </label>
    </div>

    <input
      type="password"
      value={passwordInput}
      onChange={(e) => setPasswordInput(e.target.value)}
      placeholder="Enter password"
      style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
    />
    <br />
    <button onClick={handleLogin} style={{ padding: "10px 20px" }}>
      Log In
    </button>
  </div>
);
  }

  if (authenticated && viewMode === "log") {
  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "auto" }}>
      <button onClick={handleLogout} style={{ marginBottom: "1rem", padding: "8px 16px" }}>
        🔓 Log Out
      </button>

      <h2>📞 Cold Call Logger</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={employee}
          onChange={(e) => setEmployee(e.target.value)}
          placeholder="Employee Name"
          required
          style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
        />

        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          required
          style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
        />

        <select
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          required
          style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
        >
          <option value="">Select Outcome</option>
          <option value="Answered">Answered</option>
          <option value="Voicemail">Voicemail</option>
          <option value="No Answer">No Answer</option>
        </select>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
          style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
        />

        <button type="submit" style={{ padding: "10px 20px", width: "100%" }}>
          Log Call
        </button>
      </form>

      {responseMessage && (
        <p style={{ color: "green", marginTop: "10px" }}>{responseMessage}</p>
      )}
    </div>
  );
}
  if (viewMode === "admin") {
    return (
      <div style={{ padding: "2rem", maxWidth: "1000px", margin: "auto" }}>
        <h2>📋 Cold Call Log Dashboard</h2>
        <button onClick={handleLogout} style={{ marginBottom: "1rem", padding: "8px 16px" }}>
  🔓 Log Out
</button>
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
