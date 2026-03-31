import React, { useState, useEffect } from "react";
import { db } from "./firebase"; // Importing the db from your firebase.js
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

function App() {
  // 1. State for Input Form Fields (Requirement #83)
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  
  // 2. State for Displaying Records (Requirement #85)
  const [students, setStudents] = useState([]);

  // 3. Save Data to Firestore (Requirement #84)
  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !course || !yearLevel) return alert("Please fill all fields!");

    try {
      await addDoc(collection(db, "students"), {
        name: name,
        course: course,
        yearLevel: Number(yearLevel),
        createdAt: new Date(),
      });
      // Clear inputs after saving
      setName("");
      setCourse("");
      setYearLevel("");
      alert("Student Record Saved!");
    } catch (error) {
      console.error("Error saving document: ", error);
    }
  };

  // 4. Retrieve Data from Firestore (Requirement #85 - Real-time)
  useEffect(() => {
    // Orders students by creation time (newest on top)
    const q = query(collection(db, "students"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Define styling objects for better organization
  const styles = {
    container: {
      padding: "40px",
      maxWidth: "800px",
      margin: "0 auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    heading: {
      textAlign: "center",
      color: "#333",
      marginBottom: "20px",
    },
    input: {
      padding: "10px 15px",
      marginRight: "10px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      width: "calc(33.33% - 14px)", // Adjusts for margin/padding
      display: "inline-block",
    },
    button: {
      display: "block",
      margin: "20px auto",
      padding: "10px 30px",
      backgroundColor: "#28a745", // A modern green color
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "bold",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "30px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      overflow: "hidden",
    },
    th: {
      backgroundColor: "#333", // Dark modern header
      color: "white",
      padding: "12px",
      textAlign: "left",
    },
    td: {
      padding: "12px",
      borderBottom: "1px solid #eee",
      color: "#555",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>TIP Student Record System</h2>

      {/* Modernized Form Setup */}
      <form onSubmit={handleSave} style={{ marginBottom: "30px", textAlign: "center" }}>
        <input type="text" placeholder="Full Name" value={name} 
          onChange={(e) => setName(e.target.value)} style={styles.input} />
          
        <input type="text" placeholder="Course" value={course} 
          onChange={(e) => setCourse(e.target.value)} style={styles.input} />
          
        <input type="number" placeholder="Year Level" value={yearLevel} 
          onChange={(e) => setYearLevel(e.target.value)} style={styles.input} />
          
        <button type="submit" style={styles.button}>
          Save Record
        </button>
      </form>

      {/* Styled Table Section */}
      <h3>Saved Student Records</h3>
      {students.length === 0 ? <p>No records found.</p> : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Course</th>
              <th style={styles.th}>Year Level</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} style={{ transition: "background-color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "")}>
                <td style={styles.td}>{student.name}</td>
                <td style={styles.td}>{student.course}</td>
                <td style={styles.td}>{student.yearLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;