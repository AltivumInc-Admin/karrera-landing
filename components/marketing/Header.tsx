"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { STRIPE_PAYMENT_URL } from "@/lib/constants";

interface HeaderProps {
  variant: "home" | "why";
}

export default function Header({ variant }: HeaderProps) {
  const headerRef = useRef<HTMLElement>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Initialize theme from system preference
  useEffect(() => {
    const initial = matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  // Sync theme attribute whenever state changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Scroll header shadow
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    function onScroll() {
      header!.classList.toggle("header--scrolled", window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  const ThemeIcon =
    theme === "dark" ? (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ) : (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    );

  return (
    <header className="header" id="header" ref={headerRef}>
      <div className="container header-inner">
        <a href={variant === "why" ? "/" : "#"} className="logo" aria-label="Karrera home">
          <Logo />
          <span className="logo-text">Karrera</span>
        </a>

        {variant === "home" ? (
          <nav className="header-nav" aria-label="Main navigation">
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#pricing" className="nav-link">Pricing</a>
          </nav>
        ) : (
          <nav className="header-nav" aria-label="Main navigation">
            <a href="/" className="nav-link">Home</a>
            <a href="/#how-it-works" className="nav-link">How It Works</a>
            <a href="/#pricing" className="nav-link">Pricing</a>
          </nav>
        )}

        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {ThemeIcon}
          </button>
          {variant === "home" && (
            <>
              <a href="/why" className="btn btn-outline btn-sm nav-why-btn">Why Karrera</a>
              <a href="/login" className="btn btn-member btn-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "16px", height: "16px", flexShrink: 0 }}>
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Member Access
              </a>
            </>
          )}
          <a
            href={STRIPE_PAYMENT_URL}
            className="btn btn-accent btn-sm"
            target="_blank"
            rel="noopener noreferrer"
            {...(variant === "why" ? { "data-preorder-cta": true } : {})}
          >
            {variant === "home" ? "Early Investor — $3/mo" : "Become an Early Investor"}
          </a>
        </div>
      </div>
    </header>
  );
}
