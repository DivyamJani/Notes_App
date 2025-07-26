import { useEffect, useRef, useState } from "react";
import { useNotes } from "../context/NotesContext";
import { glossaryTerms } from "../utils/glossary";
import GlossaryTooltip from "./GlossaryTooltip";
import axios from "../services/axiosInstance";
import { toast } from "react-toastify";


// Safe base64 encoding for Unicode characters
const safeBtoa = (str) => btoa(unescape(encodeURIComponent(str)));
const safeAtob = (str) => decodeURIComponent(escape(atob(str)));


const Editor = () => {
  const {
    selectedNote,
    updateNote,
    addNote,
    setSelectedNoteId,
  } = useNotes();

  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false });
  const [aiSuggestion, setAiSuggestion] = useState("");

  // New states for enhanced features
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [draggedText, setDraggedText] = useState(null);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const [activeFormats, setActiveFormats] = useState([]);

  // Emoji list for picker
  const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕'];

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title || "");
      if (selectedNote.encrypted) {
        setIsEncrypted(true);
        editorRef.current.innerHTML = "[Encrypted]";
      } else {
        setIsEncrypted(false);
        editorRef.current.innerHTML = selectedNote.content || "";
      }
      // Initialize history
      saveToHistory();
    }
  }, [selectedNote]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveEnabled && selectedNote && !isEncrypted) {
      const interval = setInterval(() => {
        handleAutoSave();
      }, 30000); // Auto-save every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoSaveEnabled, selectedNote, isEncrypted]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            handleFormat('bold');
            break;
          case 'i':
            e.preventDefault();
            handleFormat('italic');
            break;
          case 'u':
            e.preventDefault();
            handleFormat('underline');
            break;
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
          case 'y':
            e.preventDefault();
            handleRedo();
            break;
          case 'f':
            e.preventDefault();
            setShowSearch(true);
            break;
          case 's':
            e.preventDefault();
            handleSave();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  useEffect(() => {
    if (!isEncrypted) {
      setPassword("");
    }
  }, [isEncrypted]);

  useEffect(() => {
    const updateFromSelection = () => {
      const commands = ["bold", "italic", "underline", "strikeThrough", "superscript", "subscript"];
      const active = commands.filter((cmd) => document.queryCommandState(cmd));
      setActiveFormats(active);
    };
    document.addEventListener("selectionchange", updateFromSelection);
    return () => document.removeEventListener("selectionchange", updateFromSelection);
  }, []);


  const saveToHistory = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(content);
        if (newHistory.length > 50) newHistory.shift(); // Limit history size
        return newHistory;
      });
      setHistoryIndex(prev => Math.min(prev + 1, 49));
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      editorRef.current.innerHTML = history[historyIndex - 1];
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      editorRef.current.innerHTML = history[historyIndex + 1];
    }
  };

  const handleFormat = (command, value = null) => {
    if (command === 'formatBlock') {
      document.execCommand('formatBlock', false, `<${value}>`);
    } else if (command === 'insertLink') {
      const url = prompt('Enter URL:');
      if (url) {
        const text = prompt('Enter link text:', window.getSelection().toString()) || url;
        document.execCommand(
          'insertHTML',
          false,
          `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
        );
      }
    } else {
      document.execCommand(command, false, value);
    }

    saveToHistory();
  };




  const isActive = (command) => {
    if (['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'].includes(command)) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const parentElement = selection.getRangeAt(0).commonAncestorContainer.parentElement;
        const currentAlign = window.getComputedStyle(parentElement).textAlign;
        return (
          (command === 'justifyLeft' && currentAlign === 'left') ||
          (command === 'justifyCenter' && currentAlign === 'center') ||
          (command === 'justifyRight' && currentAlign === 'right') ||
          (command === 'justifyFull' && currentAlign === 'justify')
        );
      }
      return false;
    }
    return document.queryCommandState(command);
  };

  const handleAutoSave = async () => {
    if (!selectedNote || isEncrypted) return;

    const content = editorRef.current.innerHTML;
    try {
      await axios.put(
        `/api/notes/${selectedNote._id}`,
        { title: title.trim() || "Untitled Note", content, encrypted: false },
        { withCredentials: true }
      );
      updateNote(selectedNote._id, { title, content, encrypted: false });
    } catch (err) {
      console.error("Auto-save failed", err);
    }
  };

  const handleSave = async () => {
    let content = editorRef.current.innerHTML;
    let finalContent = content;

    // 🔐 If encrypting, require password
    if (isEncrypted) {
      if (!password.trim()) {
        toast.error("❌ Please enter a password to encrypt the note.");
        return;
      }
      try {
        finalContent = btoa(unescape(encodeURIComponent(content + "::" + password)));
      } catch (err) {
        toast.error("❌ Failed to encrypt content. Avoid special characters.");
        return;
      }
    }

    try {
      await axios.put(
        `/api/notes/${selectedNote._id}`,
        {
          title: title.trim() || "Untitled Note",
          content: finalContent,
          encrypted: isEncrypted,
        },
        { withCredentials: true }
      );

      updateNote(selectedNote._id, { title, content: finalContent, encrypted: isEncrypted });
      toast.success("✅ Note saved successfully!");
      setSelectedNoteId(null);
    } catch (err) {
      console.error("❌ Save failed", err);
      toast.error("❌ Error saving note");
    }
  };


  const decryptNote = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(selectedNote.content)));
      const [raw, pass] = decoded.split("::");

      if (pass === password) {
        editorRef.current.innerHTML = raw;
        setIsEncrypted(false);
        updateNote(selectedNote._id, { content: raw, encrypted: false });
        toast.success("🔓 Decrypted successfully");
      } else {
        toast.error("❌ Incorrect password");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Decryption failed");
    }
  };


  const togglePin = async () => {
    const updatedPin = !selectedNote.pinned;
    await axios.put(
      `/api/notes/${selectedNote._id}`,
      { pinned: updatedPin },
      { withCredentials: true }
    );
    updateNote(selectedNote._id, { pinned: updatedPin });
  };

  const highlightGlossaryTerms = async () => {
    try {
      const response = await axios.post("/api/glossary", {
        content: editorRef.current.innerText,
      });

      let terms = response.data.terms;

      // Validate format
      if (!Array.isArray(terms)) {
        throw new Error("Glossary response is not a valid array");
      }

      let modified = editorRef.current.innerHTML;

      for (const { term } of terms) {
        if (!term) continue;
        const regex = new RegExp(`\\b(${term})\\b`, "gi");
        modified = modified.replace(
          regex,
          `<span class="glossary-term text-yellow-700 bg-yellow-100 px-1 rounded" data-term="$1">$1</span>`
        );
      }

      editorRef.current.innerHTML = modified;
      toast.success("📚 Glossary terms highlighted!");
    } catch (error) {
      console.error("Glossary AI Error:", error);
      const raw = error?.response?.data?.raw;
      if (raw) {
        console.warn("Glossary parsing failed. Raw response:", raw);
      }
      toast.error("❌ No Glossary Terms Found!!!");
    }
  };







  const handleMouseOver = (e) => {
    if (e.target.classList.contains("glossary-term")) {
      const term = e.target.getAttribute("data-term").toLowerCase();
      const definition = glossaryTerms[term];
      const rect = e.target.getBoundingClientRect();
      setTooltip({
        visible: true,
        term,
        definition,
        position: { x: rect.left + window.scrollX, y: rect.bottom + window.scrollY },
      });
    } else {
      setTooltip({ visible: false });
    }
  };

  const handleAISuggestion = async () => {
    const text = editorRef.current.innerText;
    if (!text.trim()) return;
    try {
      const { data } = await axios.post("/api/insight", { content: text }, { withCredentials: true });
      setAiSuggestion(data.suggestion);
    } catch (err) {
      console.error(err);
      toast.error("AI suggestion failed.");
    }
  };



  const insertImage = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.createElement("img");
      img.src = reader.result;
      img.className = "max-w-full h-auto my-2 resize-handle";
      img.draggable = true;
      editorRef.current.appendChild(img);
      saveToHistory();
    };
    reader.readAsDataURL(file);
  };

  // Find and Replace functionality
  const handleFind = () => {
    if (!searchTerm) return;

    const content = editorRef.current.innerHTML;
    const regex = new RegExp(searchTerm, 'gi');
    const highlighted = content.replace(regex, `<mark>$&</mark>`);
    editorRef.current.innerHTML = highlighted;
  };

  const handleReplace = () => {
    if (!searchTerm || !replaceTerm) return;

    const content = editorRef.current.innerHTML;
    const regex = new RegExp(searchTerm, 'gi');
    const replaced = content.replace(regex, replaceTerm);
    editorRef.current.innerHTML = replaced;
    saveToHistory();
  };

  const handleReplaceAll = () => {
    handleReplace();
  };

  // Drag and Drop functionality
  const handleDragStart = (e) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      setDraggedText(selection.toString());
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedText) {
      document.execCommand('insertText', false, draggedText);
      setDraggedText(null);
      saveToHistory();
    }
  };

  // Insert Table functionality
  const insertTable = () => {
    const rows = prompt('Number of rows:', '3');
    const cols = prompt('Number of columns:', '3');
    if (rows && cols) {
      let table = '<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;"><tbody>';
      for (let i = 0; i < parseInt(rows); i++) {
        table += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          table += '<td style="border: 1px solid #ccc; padding: 8px; min-width: 50px;">&nbsp;</td>';
        }
        table += '</tr>';
      }
      table += '</tbody></table>';
      document.execCommand('insertHTML', false, table);
      saveToHistory();
    }
  };

  // Insert Emoji
  const insertEmoji = (emoji) => {
    document.execCommand('insertText', false, emoji);
    setShowEmojiPicker(false);
    saveToHistory();
  };

  // Apply Font Size
  const applyFontSize = () => {
    editorRef.current.style.fontSize = `${fontSize}px`;
  };

  // Apply Line Height
  const applyLineHeight = () => {
    editorRef.current.style.lineHeight = lineHeight;
  };

  // Copy with formatting
  const handleCopy = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const div = document.createElement('div');
      div.appendChild(range.cloneContents());
      navigator.clipboard.writeText(div.innerHTML);
    }
  };

  if (!selectedNote) return <div className="p-4 text-gray-500">📝 Select or create a note to begin.</div>;

  return (
    <div className="space-y-4 relative" onMouseOver={handleMouseOver}>
      {/* Title + Pin + Close */}
      <div className="flex items-center justify-between gap-2">
        <input
          type="text"
          value={title}
          placeholder="Enter Title"
          onChange={(e) => setTitle(e.target.value.trimStart())}
          className="w-full p-2 text-lg font-semibold border rounded dark:bg-gray-800 dark:text-white"
        />
        <button
          onClick={togglePin}
          className={`text-xl px-3 py-1 rounded border transition ${selectedNote.pinned
            ? "bg-yellow-400 hover:bg-yellow-500"
            : "bg-gray-200 hover:bg-gray-300"
            }`}
          title={selectedNote.pinned ? "Unpin Note" : "Pin Note"}
        >
          {selectedNote.pinned ? "📌" : "📍"}
        </button>

        <button
          onClick={() => setSelectedNoteId(null)}
          title="❌ Close note"
          className="text-xl px-3 py-1 rounded border bg-red-200 hover:bg-red-400"
        >
          ❌
        </button>
      </div>

      {/* Search and Replace */}
      {showSearch && (
        <div className="flex gap-2 p-2 border rounded bg-gray-50 dark:bg-gray-800">
          <input
            type="text"
            placeholder="Find..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
          />
          <input
            type="text"
            placeholder="Replace..."
            value={replaceTerm}
            onChange={(e) => setReplaceTerm(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
          />
          <button onClick={handleFind} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">Find</button>
          <button onClick={handleReplace} className="px-2 py-1 bg-green-500 text-white rounded text-sm">Replace</button>
          <button onClick={handleReplaceAll} className="px-2 py-1 bg-orange-500 text-white rounded text-sm">All</button>
          <button onClick={() => setShowSearch(false)} className="px-2 py-1 bg-red-500 text-white rounded text-sm">✕</button>
        </div>
      )}

      {/* Font Size and Line Height Controls */}
      <div className="flex gap-4 items-center text-sm">
        <div className="flex items-center gap-2">
          <label>Font Size:</label>
          <input
            type="range"
            min="12"
            max="24"
            value={fontSize}
            onChange={(e) => {
              setFontSize(e.target.value);
              applyFontSize();
            }}
            className="w-20"
          />
          <span>{fontSize}px</span>
        </div>
        <div className="flex items-center gap-2">
          <label>Line Height:</label>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={lineHeight}
            onChange={(e) => {
              setLineHeight(e.target.value);
              applyLineHeight();
            }}
            className="w-20"
          />
          <span>{lineHeight}</span>
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={autoSaveEnabled}
            onChange={(e) => setAutoSaveEnabled(e.target.checked)}
          />
          Auto-save
        </label>
        <button
          onClick={() => setToolbarVisible(!toolbarVisible)}
          className="px-2 py-1 bg-gray-500 text-white rounded text-sm"
        >
          {toolbarVisible ? 'Hide' : 'Show'} Toolbar
        </button>
      </div>

      {/* Toolbar */}
      {toolbarVisible && (
        <div className="flex flex-wrap gap-2">
          {/* Undo/Redo */}
          <button
            onClick={handleUndo}
            title="Undo (Ctrl+Z)"
            disabled={historyIndex <= 0}
            className={`btn ${historyIndex <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            ↶
          </button>
          <button
            onClick={handleRedo}
            title="Redo (Ctrl+Y)"
            disabled={historyIndex >= history.length - 1}
            className={`btn ${historyIndex >= history.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            ↷
          </button>
          {[
            { cmd: "bold", label: "B", title: "Bold (Ctrl+B)" },
            { cmd: "italic", label: "I", title: "Italic (Ctrl+I)" },
            { cmd: "underline", label: "U", title: "Underline (Ctrl+U)" },
            { cmd: "strikeThrough", label: "S", title: "Strikethrough" },
            { cmd: "superscript", label: "x²", title: "Superscript" },
            { cmd: "subscript", label: "x₂", title: "Subscript" },
            { cmd: "insertOrderedList", label: "OL", title: "Ordered List" },
            { cmd: "insertUnorderedList", label: "UL", title: "Unordered List" },
            { cmd: "justifyLeft", label: "⬅", title: "Align Left" },
            { cmd: "justifyCenter", label: "☰", title: "Align Center" },
            { cmd: "justifyRight", label: "➡", title: "Align Right" },
            { cmd: "justifyFull", label: "⬌", title: "Justify" },
            { cmd: "indent", label: "→|", title: "Increase Indent" },
            { cmd: "outdent", label: "|←", title: "Decrease Indent" },
            { cmd: "formatBlock", value: "pre", label: "</>", title: "Code Block" },
            { cmd: "removeFormat", label: "✂", title: "Clear Formatting" },
          ].map(({ cmd, value, label, title }) => (
            <button
              key={label}
              onClick={() => handleFormat(cmd, value)}
              title={title}
              className={`px-2 py-1 rounded text-sm font-bold transition ${activeFormats.includes(cmd)
                ? "bg-blue-600 text-white dark:bg-blue-700"
                : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                }`}

            >
              {label}
            </button>
          ))}



          {/* Font Picker */}
          <select
            onChange={(e) => handleFormat("fontName", e.target.value)}
            className="border px-2 rounded"
            title="Font Family"
          >
            <option value="">Font</option>
            {["Arial", "Courier New", "Georgia", "Times New Roman", "Verdana", "Helvetica", "Comic Sans MS", "Impact"].map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>

          {/* Color Pickers */}
          <input
            type="color"
            onChange={(e) => handleFormat("foreColor", e.target.value)}
            title="Font Color"
            className="w-8 h-8 p-0 border rounded"
          />
          <input
            type="color"
            onChange={(e) => handleFormat("backColor", e.target.value)}
            title="Background Color"
            className="w-8 h-8 p-0 border rounded"
          />

          {/* Special buttons */}
          <button onClick={() => handleFormat('insertLink')} title="Insert Link" className="btn">🔗</button>
          <button onClick={insertTable} title="Insert Table" className="btn">📋</button>
          <button onClick={() => setShowSearch(true)} title="Find & Replace (Ctrl+F)" className="btn">🔍</button>
          <button onClick={handleCopy} title="Copy with Formatting" className="btn">📋</button>

          {/* Emoji Picker Button */}
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              title="Insert Emoji"
              className="btn"
            >
              😀
            </button>
            {showEmojiPicker && (
              <div className="absolute top-10 left-0 bg-white border rounded shadow-lg p-2 flex flex-col gap-1 max-h-60 overflow-y-auto z-10">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => insertEmoji(emoji)}
                    className="emoji-btn"
                    title={`Insert ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!isEncrypted}
        suppressContentEditableWarning
        className="min-h-[300px] p-4 border rounded bg-white dark:bg-gray-900 dark:text-white outline-none"
        spellCheck
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onInput={saveToHistory}
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: lineHeight
        }}
      />

      {/* Encryption Options */}
      <div className="flex gap-3 flex-wrap">
        <input
          type="password"
          placeholder="Optional Password"
          className="p-2 border rounded dark:bg-gray-800 dark:text-white"
          onChange={(e) => setPassword(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isEncrypted}
            onChange={(e) => setIsEncrypted(e.target.checked)}
          />
          Encrypt Note
        </label>
        {isEncrypted && (
          <button onClick={decryptNote} className="bg-green-600 text-white px-3 py-2 rounded">
            🔓 Decrypt
          </button>
        )}
      </div>

      {/* Glossary & AI */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={highlightGlossaryTerms}
          className="bg-yellow-500 text-black px-3 py-2 rounded"
        >
          📚 Highlight Glossary Terms
        </button>
        <button
          onClick={handleAISuggestion}
          className="bg-purple-600 text-white px-3 py-2 rounded"
        >
          💡 Get AI Suggestion
        </button>
      </div>

      {aiSuggestion && (
        <div className="p-2 mt-2 text-sm border-l-4 border-purple-600 bg-purple-50 text-purple-800 rounded">
          {aiSuggestion}
        </div>
      )}

      {/* Save */}
      <button
        onClick={handleSave}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded text-lg"
      >
        💾 Save {autoSaveEnabled && "(Auto-save enabled)"}
      </button>

      {/* Tooltip */}
      {tooltip.visible && (
        <GlossaryTooltip
          term={tooltip.term}
          definition={tooltip.definition}
          position={tooltip.position}
        />
      )}
    </div>
  );
};

export default Editor;