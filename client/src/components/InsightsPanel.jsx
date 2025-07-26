import { useEffect, useState } from "react";
import { useNotes } from "../context/NotesContext";

const InsightsPanel = () => {
  const { selectedNote } = useNotes();
  const [summary, setSummary] = useState("");

  useEffect(() => {
    if (selectedNote?.content) {
      const plainText = selectedNote.content.replace(/<[^>]*>?/gm, "");
      const summary = plainText.length > 100
        ? plainText.substring(0, 100) + "..."
        : plainText;
      setSummary(summary);
    }
  }, [selectedNote]);

  if (!selectedNote) return null;

  return (
    <div className="mt-4 p-3 border rounded bg-gray-100 dark:bg-gray-800 dark:text-white">
      <h4 className="font-semibold mb-2">AI Insight Summary</h4>
      <p>{summary}</p>
    </div>
  );
};

export default InsightsPanel;