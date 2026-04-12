export default function ThinkingState() {
  return (
    <div className="thinking-row" aria-label="Thinking">
      <div className="thinking-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <span className="thinking-label">Thinking...</span>
    </div>
  );
}