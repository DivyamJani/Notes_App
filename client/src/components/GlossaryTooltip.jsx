const GlossaryTooltip = ({ term, definition, position }) => {
  return (
    <div
      className="absolute z-50 bg-black text-white text-sm rounded px-3 py-1"
      style={{ top: position.y + 8, left: position.x }}
    >
      <strong>{term}</strong>: {definition}
    </div>
  );
};

export default GlossaryTooltip;