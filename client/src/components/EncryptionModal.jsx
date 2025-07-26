import { useState } from "react";
import { useNotes } from "../context/NotesContext";

const EncryptionModal = () => {
  const { selectedNote, updateNote } = useNotes();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const encryptNote = () => {
    const encrypted = btoa(selectedNote.content + "--" + password);
    updateNote(selectedNote.id, { content: encrypted });
    setShow(false);
  };

  return (
    <div className="mt-4">
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded"
        onClick={() => setShow(true)}
      >
        Encrypt Note
      </button>
      {show && (
        <div className="mt-2 flex items-center gap-2">
          <input
            type="password"
            placeholder="Enter password"
            className="p-2 border rounded"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={encryptNote} className="bg-green-500 text-white px-3 py-1 rounded">
            Encrypt
          </button>
        </div>
      )}
    </div>
  );
};

export default EncryptionModal;