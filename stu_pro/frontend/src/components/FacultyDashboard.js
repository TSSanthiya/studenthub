import React, { useState } from "react";
import axios from "axios";
import { useMessage } from "../context/MessageContext";
import "./FacultyDashboard.css";

const FacultyDashboard = () => {
  const [message, setMessage] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [tag, setTag] = useState("");
  const [file, setFile] = useState(null);

  const { messages, sendMessage } = useMessage();

  const handleSendMessage = async () => {
    if (!message.trim() && !file) {
      alert("❌ Please enter a message or upload a file.");
      return;
    }

    if (!department || !year || !section || !tag) {
      alert("❌ Please select Department, Year, Section, and Tag.");
      return;
    }

    const formData = new FormData();
    formData.append("text", message);
    formData.append("department", department);
    formData.append("year", year);
    formData.append("section", section);
    formData.append("tag", tag.toLowerCase());
    if (file) formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/send-message", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        alert("✅ Message sent successfully!");
        setMessage("");
        setDepartment("");
        setYear("");
        setSection("");
        setTag("");
        setFile(null);
        sendMessage(response.data);
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
      alert("❌ Failed to send message. Please check console for details.");
    }
  };

  return (
    <div className="faculty-dashboard">
      <h2>Faculty Dashboard</h2>

      {/* Filters Section */}
      <div className="filters">
        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="">Select Department</option>
          <option value="CSE">Computer Science</option>
          <option value="ECE">Electronics and Communication</option>
          <option value="EEE">Electrical and Electronics</option>
          <option value="AIDS">AI & Data Science</option>
          <option value="All">All Departments</option>
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Select Year</option>
          <option value="1st">1st Year</option>
          <option value="2nd">2nd Year</option>
          <option value="3rd">3rd Year</option>
          <option value="4th">4th Year</option>
          <option value="All">All Years</option>
        </select>

        <select value={section} onChange={(e) => setSection(e.target.value)}>
          <option value="">Select Section</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="All">All</option>
        </select>

        <select value={tag} onChange={(e) => setTag(e.target.value)}>
          <option value="">Select Tag</option>
          <option value="urgent">Urgent</option>
          <option value="announcement">Announcement</option>
          <option value="exam">Exam</option>
          <option value="general">General</option>
        </select>
      </div>

      {/* Message Input */}
      <textarea
        className="message-box"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />

      {/* File Upload */}
      <div className="file-upload">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      </div>

      {/* Send Button */}
      <button className="send-btn" onClick={handleSendMessage}>Send</button>

      {/* Previous Messages */}
      <div className="message-list">
        <h3>Previous Messages</h3>
        <ul>
          {messages && messages.length > 0 ? (
            messages.map((msg) => (
              <li key={msg._id} className="message-item">
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
                <p><strong>Tag:</strong> {msg.tag}</p>
                <span className="timestamp">{new Date(msg.timestamp).toLocaleString()}</span>
              </li>
            ))
          ) : (
            <p>No messages yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default FacultyDashboard;
