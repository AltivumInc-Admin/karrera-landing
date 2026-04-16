import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        backgroundColor: "#f9fafb",
        padding: "1rem",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "24rem" }}>
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: 800,
            color: "#0d9488",
            marginBottom: "0.5rem",
          }}
        >
          404
        </h1>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#111827",
            marginBottom: "0.5rem",
          }}
        >
          Page not found
        </h2>
        <p
          style={{
            fontSize: "0.875rem",
            color: "#6b7280",
            marginBottom: "1.5rem",
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "0.625rem 1.5rem",
            borderRadius: "0.5rem",
            backgroundColor: "#0d9488",
            color: "white",
            fontSize: "0.875rem",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
