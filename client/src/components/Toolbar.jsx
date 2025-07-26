// ==== Toolbar.jsx ====
const Toolbar = () => {
  const applyCommand = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 border-b bg-gray-100 dark:bg-gray-800">
      <button className="btn font-bold" onClick={() => applyCommand("bold")}>B</button>
      <button className="btn italic" onClick={() => applyCommand("italic")}>I</button>
      <button className="btn underline" onClick={() => applyCommand("underline")}>U</button>
      <button className="btn" onClick={() => applyCommand("justifyLeft")}>Left</button>
      <button className="btn" onClick={() => applyCommand("justifyCenter")}>Center</button>
      <button className="btn" onClick={() => applyCommand("justifyRight")}>Right</button>
      <select
        className="ml-4 border px-2 py-1 rounded"
        onChange={(e) => applyCommand("fontSize", e.target.value)}
        defaultValue="3"
      >
        <option value="1">Small</option>
        <option value="3">Normal</option>
        <option value="5">Large</option>
        <option value="7">Huge</option>
      </select>
    </div>
  );
};

export default Toolbar;
