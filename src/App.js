import React, { useState, useEffect } from "react";
import { db } from "./firebase"; // Importing the db from your firebase.js
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

function App() {
  // 1. State for Input Form Fields
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  
  // 2. State for Displaying Records
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

  // 4. Retrieve Data from Firestore (Requirement #85)
  useEffect(() => {
    const q = query(collection(db, "students"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h2>TIP Student Record Form</h2>

      {/* Requirement #83: Input Form */}
      <form onSubmit={handleSave} style={{ marginBottom: "30px" }}>
        <div style={{ marginBottom: "10px" }}>
          <input type="text" placeholder="Name" value={name} 
            onChange={(e) => setName(e.target.value)} style={{ padding: "8px", width: "250px" }} />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input type="text" placeholder="Course" value={course} 
            onChange={(e) => setCourse(e.target.value)} style={{ padding: "8px", width: "250px" }} />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input type="number" placeholder="Year Level" value={yearLevel} 
            onChange={(e) => setYearLevel(e.target.value)} style={{ padding: "8px", width: "250px" }} />
        </div>
        <button type="submit" style={{ padding: "10px 20px", cursor: "pointer", background: "#007bff", color: "#fff", border: "none" }}>
          Save Record
        </button>
      </form>

      <hr />

      {/* Requirement #85: Display Section */}
      <h3>Saved Student Records</h3>
      <div style={{ marginTop: "20px" }}>
        {students.length === 0 ? <p>No records found.</p> : (
          <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f4f4f4" }}>
                <th>Name</th>
                <th>Course</th>
                <th>Year Level</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.course}</td>
                  <td>{student.yearLevel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;