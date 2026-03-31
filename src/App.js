import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import "./App.css";

function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const notesCollection = collection(db, "notes");

  // FETCH: Get notes from Firebase
  const fetchNotes = async () => {
    const q = query(notesCollection, orderBy("createdAt", "desc"));
    const data = await getDocs(q);
    setNotes(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  // CREATE: Save a new note
  const addNote = async () => {
    if (note.trim() === "") return;
    await addDoc(notesCollection, {
      text: note,
      createdAt: new Date()
    });
    setNote("");
    fetchNotes(); // Refresh list
  };

  // DELETE: Remove a note
  const deleteNote = async (id) => {
    await deleteDoc(doc(db, "notes", id));
    fetchNotes(); // Refresh list
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="container">
      <h1>Cloud Notes Created By Harold!</h1>
      <div className="input-section">
        <input 
          placeholder="What's on your mind?" 
          value={note} 
          onChange={(e) => setNote(e.target.value)} 
        />
        <button onClick={addNote}>Add</button>
      </div>

      <div className="notes-list">
        {notes.map((n) => (
          <div className="note-card" key={n.id}>
            <span>{n.text}</span>
            <button className="delete-btn" onClick={() => deleteNote(n.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;