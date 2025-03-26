import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const [messages, setMessages] = useState([]);
  
  // ✅ Get student details from localStorage
  const studentDept = localStorage.getItem("studentDept");
  const studentSec = localStorage.getItem("studentSec");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // ✅ Fetch only messages related to the student's department and section
        const response = await axios.get("http://localhost:5000/api/messages", {
          params: { department: studentDept, section: studentSec },
        });

        setMessages(response.data);
        console.log("Messages received in StudentDashboard:", response.data);
      } catch (error) {
        console.error("❌ Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [studentDept, studentSec]); // ✅ Fetch data when dept/sec changes

  const getTagColor = (tag) => {
    switch (tag?.toLowerCase()) {
      case "urgent":
        return "red";
      case "exam":
        return "blue";
      case "announcement":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>
      </header>

      <div className="student-dashboard">
        <h3>Received Messages</h3>
        <ul className="message-list">
          {messages.length === 0 ? (
            <p>No messages found.</p>
          ) : (
            messages.map((msg) => (
              <li key={msg._id} className="message-item">
                <span className="tag" style={{ backgroundColor: getTagColor(msg.tag), color: "white", padding: "5px", borderRadius: "5px" }}>
                  {msg.tag}
                </span>
                <p>
                  <strong>Department:</strong> {msg.department || "N/A"} |{" "}
                  <strong>Year:</strong> {msg.year || "N/A"} |{" "}
                  <strong>Section:</strong> {msg.section || "N/A"}
                </p>
                <p>{msg.text}</p>
                {msg.file && (
                  <p>
                    <strong>File:</strong>{" "}
                    <a href={`http://localhost:5000/uploads/${msg.file}`} target="_blank" rel="noopener noreferrer">
                      {msg.file}
                    </a>
                  </p>
                )}
                <span className="timestamp">{new Date(msg.timestamp).toLocaleString()}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default StudentDashboard;