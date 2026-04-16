export default function Logo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={className ?? "logo-mark"}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={size !== 32 ? { width: `${size}px`, height: `${size}px` } : undefined}
    >
      <rect width="32" height="32" rx="6" fill="var(--color-accent)" />
      <path
        d="M10 8v16M10 16l8-8M10 16l8 8"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="8" r="2.5" fill="#34d399" />
    </svg>
  );
}
