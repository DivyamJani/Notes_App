import { useEffect, useState } from "react";
import { useNotes } from "../context/NotesContext";
import { checkGrammar } from "../utils/grammarUtils";

const GrammarHighlighter = () => {
  const { selectedNote } = useNotes();
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    if (selectedNote?.content) {
      const results = checkGrammar(selectedNote.content);
      setIssues(results);
    }
  }, [selectedNote]);

  if (!selectedNote || issues.length === 0) return null;

  return (
    <div className="mt-2 p-3 bg-yellow-100 border border-yellow-300 rounded text-sm">
      <h4 className="font-semibold mb-1">Grammar Suggestions:</h4>
      <ul className="list-disc pl-4 space-y-1">
        {issues.map((issue, index) => (
          <li key={index}>{issue}</li>)
        )}
      </ul>
    </div>
  );
};

export default GrammarHighlighter;