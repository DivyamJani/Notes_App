import { useNotes } from "../context/NotesContext";
import { toast } from "react-toastify";

const NotesList = () => {
  const { notes, selectNote, selectedNoteId, addNote, deleteNote, togglePin } = useNotes();
  const sortedNotes = [...notes].sort((a, b) => b.pinned - a.pinned);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if (confirmDelete) {
      await deleteNote(id);
      toast.success("🗑️ Note deleted successfully");
    }
  };

  return (
    <div className="w-full sm:w-64 bg-gray-100 dark:bg-gray-800 p-4 overflow-y-auto max-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          📝 Notes
        </h2>
        <button
          onClick={addNote}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          title="Add Note"
        >
          +
        </button>
      </div>

      {/* Notes List */}
      <ul className="space-y-2">
        {sortedNotes.map((note) => (
          <li
            key={note._id}
            onClick={() => selectNote(note._id)}
            className={`flex justify-between items-center px-3 py-2 rounded transition-all ${
              note._id === selectedNoteId
                ? "bg-blue-200 dark:bg-blue-600 text-black dark:text-white"
                : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
          >
            {/* Title with overflow control */}
            <div className="flex-1 truncate pr-2">{note.title}</div>

            {/* Action buttons */}
            <div className="flex-shrink-0 flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePin(note._id);
                }}
                title="Pin/Unpin"
              >
                {note.pinned ? "📌" : "📍"}
              </button>
              <button
                onClick={(e) => handleDelete(e, note._id)}
                title="Delete"
                className="text-red-500 hover:text-red-700"
              >
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesList;
