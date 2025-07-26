import React from "react";
import { useNotes } from "../context/NotesContext";
import Editor from "../components/Editor";

const Dashboard = () => {
  const {
    notes,
    selectedNote,
    setSelectedNoteId,
    addNote,
    deleteNote,
    updateNote,
  } = useNotes();

  const handleTitleChange = (e, id) => {
    const newTitle = e.target.value;
    updateNote(id, { title: newTitle });
  };

  // ✅ Sort pinned notes first
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned === b.pinned) return 0;
    return a.pinned ? -1 : 1;
  });


  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="md:w-72 w-full md:h-full h-60 overflow-y-auto bg-gray-100 dark:bg-gray-800 p-4 space-y-4 shadow-md">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">🗂 Notes</h2>
          <button
            onClick={addNote}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            ➕
          </button>
        </div>

        {sortedNotes.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">No notes yet.</p>
        )}

{sortedNotes.map((note) => {
  const isSelected = selectedNote?._id === note._id;
  const isPinned = note.pinned;

  return (
    <div
      key={note._id}
      className={`flex items-center justify-between p-2 border rounded-md cursor-pointer transition shadow-sm
        ${isSelected
          ? "bg-blue-100 dark:bg-blue-700 text-black dark:text-white"
          : isPinned
            ? "bg-yellow-300 dark:bg-yellow-600 text-black dark:text-white"
            : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        }
      `}
      onClick={() => setSelectedNoteId(note._id)}
    >
      <div className="flex items-center gap-2 min-w-0 flex-grow">
        {isPinned && <span className="text-yellow-600 text-sm">📌</span>}
        <input
          value={note.title}
          onChange={(e) => handleTitleChange(e, note._id)}
          className="flex-grow bg-transparent border-none focus:outline-none font-medium truncate min-w-0"
          title={note.title}
        />
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (confirm("Are you sure you want to delete this note?")) {
            deleteNote(note._id);
          }
        }}
        className="ml-2 text-red-500 hover:text-red-700 text-lg shrink-0"
        title="Delete Note"
      >
        ❌
      </button>
    </div>
  );
})}

      </aside>

      {/* Editor Panel */}
      <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 p-4">
        <Editor />
      </main>
    </div>
  );
};

export default Dashboard;
