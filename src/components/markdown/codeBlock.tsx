import { useState} from "react";

export default function CodeBlock({ language, code }: Readonly<{ language: string; code: string }>) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      globalThis.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="code-block-wrap">
      <div className="code-block-header">
        <span>{language}</span>
        <button
          type="button"
          className={`code-copy-button ${copied ? "copied" : ""}`}
          onClick={() => void handleCopy()}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}