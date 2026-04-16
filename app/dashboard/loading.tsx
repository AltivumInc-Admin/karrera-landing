export default function DashboardLoading() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 1rem",
      }}
    >
      <div
        style={{
          width: "2rem",
          height: "2rem",
          border: "3px solid #e5e7eb",
          borderTopColor: "#0d9488",
          borderRadius: "50%",
          animation: "spin 0.6s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
