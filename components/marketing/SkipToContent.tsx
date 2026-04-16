"use client";

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only"
      style={{
        position: "absolute",
        top: "-40px",
        left: 0,
        background: "var(--color-accent)",
        color: "#fff",
        padding: "8px 16px",
        zIndex: 100,
        transition: "top 0.2s",
      }}
      onFocus={(e) => {
        (e.target as HTMLElement).style.top = "0";
      }}
      onBlur={(e) => {
        (e.target as HTMLElement).style.top = "-40px";
      }}
    >
      Skip to main content
    </a>
  );
}
