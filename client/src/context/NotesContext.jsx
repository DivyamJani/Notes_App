import { createContext, useContext, useEffect, useState } from "react";
import axios from "../services/axiosInstance";
import { useAuth } from "./AuthContext"; // Make sure this exists

const NotesContext = createContext();
export const useNotes = () => useContext(NotesContext);

const NotesProvider = ({ children }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  // ⏬ Fetch notes only when user changes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await axios.get("/api/notes", { withCredentials: true });
        setNotes(data.notes || []);
      } catch (err) {
        console.error("❌ Error loading notes", err);
        setNotes([]);
      }
    };

    if (user) fetchNotes();
    else setNotes([]);
  }, [user]);

  const addNote = async () => {
    try {
      const { data } = await axios.post(
        "/api/notes",
        {
          title: "Untitled Note",
          content: "",
          encrypted: false,
        },
        { withCredentials: true }
      );
      setNotes((prev) => [data.note, ...prev]);
      setSelectedNoteId(data.note._id);
    } catch (err) {
      console.error("❌ Error adding note", err);
    }
  };

  const updateNote = (id, updatedFields) => {
    setNotes((prev) =>
      prev.map((note) => (note._id === id ? { ...note, ...updatedFields } : note))
    );
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`/api/notes/${id}`, { withCredentials: true });
      setNotes((prev) => prev.filter((note) => note._id !== id));
      setSelectedNoteId(null);
    } catch (err) {
      console.error("❌ Error deleting note", err);
    }
  };

  const selectedNote = notes.find((n) => n._id === selectedNoteId);

  return (
    <NotesContext.Provider
      value={{
        notes,
        selectedNote,
        selectedNoteId,
        setSelectedNoteId,
        addNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export default NotesProvider;
