import React, { useState } from "react";

function App() {
  const [form, setForm] = useState({
    employee: "",
    phone: "",
    outcome: "",
    notes: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setStatus("Sending...");
    try {
      const res = await fetch("https://cold-call-backend.onrender.com/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("✅ Call logged!");
        setForm({ employee: "", phone: "", outcome: "", notes: "" });
      } else {
        setStatus("❌ Error logging call.");
      }
    } catch (err) {
      setStatus("❌ Server not reachable.");
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "400px", margin: "auto" }}>
      <h2>📞 Cold Call Tracker</h2>

      <input
        name="employee"
        placeholder="Employee Name"
        value={form.employee}
        onChange={handleChange}
        style={{ display: "block", margin: "8px 0", width: "100%" }}
      />
      <input
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
        style={{ display: "block", margin: "8px 0", width: "100%" }}
      />
      <input
        name="outcome"
        placeholder="Outcome (Answered, Voicemail, etc)"
        value={form.outcome}
        onChange={handleChange}
        style={{ display: "block", margin: "8px 0", width: "100%" }}
      />
      <textarea
        name="notes"
        placeholder="Notes"
        value={form.notes}
        onChange={handleChange}
        rows={4}
        style={{ display: "block", margin: "8px 0", width: "100%" }}
      ></textarea>

      <button onClick={handleSubmit} style={{ padding: "10px 20px" }}>
        Submit
      </button>

      {status && <p style={{ marginTop: "10px" }}>{status}</p>}
    </div>
  );
}

export default App;
