import Logo from "./Logo";
import { STRIPE_PAYMENT_URL } from "@/lib/constants";

interface FooterProps {
  variant: "home" | "why";
}

export default function Footer({ variant }: FooterProps) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <a href={variant === "why" ? "/" : "#"} className="logo" aria-label="Karrera home" style={{ marginBottom: "var(--space-2)" }}>
            <Logo size={24} />
            <span className="logo-text" style={{ fontSize: "var(--text-sm)" }}>Karrera</span>
          </a>
          <p className="footer-text">
            {variant === "home"
              ? "\u00A9 2026 Karrera. The trust layer for human capital."
              : "\u00A9 2026 Karrera by Altivum Inc. Patent pending."}
          </p>
        </div>
        <div className="footer-links">
          {variant === "home" ? (
            <>
              <a href="/why" className="footer-why-link">Why Karrera</a>
              <a href="#pricing">Pricing</a>
              <a href="#how-it-works">How It Works</a>
              <a href="/login" className="footer-member-link">Member Access</a>
              <a href={STRIPE_PAYMENT_URL} target="_blank" rel="noopener noreferrer">Early Investor — $3/mo</a>
              <a href="mailto:hello@karrera.dev">Contact</a>
            </>
          ) : (
            <>
              <a href="mailto:hello@karrera.dev">Contact</a>
              <a href="/">Home</a>
              <a href="/#pricing">Pricing</a>
              <a href="/#how-it-works">How It Works</a>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
