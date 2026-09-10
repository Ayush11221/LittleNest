/**
 * Wraps a word/phrase with a hand-drawn-style underline accent —
 * an editorial signature detail used sparingly in section headings.
 */
function Highlight({ children, className = '' }) {
  return (
    <span className={`relative inline-block whitespace-nowrap ${className}`}>
      <span className="relative z-10">{children}</span>
      <svg
        viewBox="0 0 120 14"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute -bottom-1 left-0 w-full h-[0.4em] text-highlight"
      >
        <path
          d="M2 9.5C22 4 45 3 60 6.5C77 10.5 100 5 118 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export default Highlight;
