"use client";

import { useEffect, useCallback, useRef } from "react";
import "@/styles/landing.css";

export default function LandingPage() {
  const headerRef = useRef<HTMLElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // Theme toggle
  useEffect(() => {
    const t = document.querySelector("[data-theme-toggle]") as HTMLButtonElement | null;
    const r = document.documentElement;
    let d = matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light";
    r.setAttribute("data-theme", d);
    updateToggleIcon();

    function handleClick() {
      d = d === "dark" ? "light" : "dark";
      r.setAttribute("data-theme", d);
      if (t) t.setAttribute("aria-label", "Switch to " + (d === "dark" ? "light" : "dark") + " mode");
      updateToggleIcon();
    }

    function updateToggleIcon() {
      if (!t) return;
      t.innerHTML =
        d === "dark"
          ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
          : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }

    if (t) t.addEventListener("click", handleClick);
    return () => {
      if (t) t.removeEventListener("click", handleClick);
    };
  }, []);

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

  // Scroll reveal
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Smooth scroll for anchor links — intercept waitlist links to open modal
  useEffect(() => {
    function handleAnchorClick(this: HTMLAnchorElement, e: Event) {
      e.preventDefault();
      const href = this.getAttribute("href");
      if (href === "#waitlist") {
        openWaitlistModal();
      } else if (href) {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }

    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((anchor) => {
      anchor.addEventListener("click", handleAnchorClick as EventListener);
    });
    return () => {
      anchors.forEach((anchor) => {
        anchor.removeEventListener("click", handleAnchorClick as EventListener);
      });
    };
  }, []);

  // Modal keyboard handling
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape" && modal!.classList.contains("active")) {
        closeWaitlistModal();
      }
    }

    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const focusable = modal!.querySelectorAll<HTMLElement>('input, button, [tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleEscape);
    modal.addEventListener("keydown", handleTab);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      modal.removeEventListener("keydown", handleTab);
    };
  }, []);

  function openWaitlistModal() {
    const modal = modalRef.current;
    if (!modal) return;
    lastFocusedRef.current = document.activeElement as HTMLElement;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    // Reset form state
    const form = document.getElementById("modal-waitlist-form") as HTMLFormElement | null;
    if (form) form.style.display = "";
    const success = document.getElementById("modal-success");
    if (success) success.classList.remove("show");
    const submitBtn = document.getElementById("modal-submit-btn") as HTMLButtonElement | null;
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Join Waitlist";
    }
    setTimeout(() => {
      const nameInput = document.getElementById("modal-name") as HTMLInputElement | null;
      if (nameInput) nameInput.focus();
    }, 150);
  }

  function closeWaitlistModal() {
    const modal = modalRef.current;
    if (!modal) return;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocusedRef.current) lastFocusedRef.current.focus();
  }

  const handleModalWaitlist = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const form = document.getElementById("modal-waitlist-form") as HTMLFormElement | null;
      const success = document.getElementById("modal-success");
      const btn = document.getElementById("modal-submit-btn") as HTMLButtonElement | null;
      const nameInput = document.getElementById("modal-name") as HTMLInputElement | null;
      const emailInput = document.getElementById("modal-email") as HTMLInputElement | null;
      const phoneInput = document.getElementById("modal-phone") as HTMLInputElement | null;

      const name = nameInput?.value.trim() || "";
      const email = emailInput?.value.trim() || "";
      const phone = phoneInput?.value.trim() || "";

      if (btn) {
        btn.disabled = true;
        btn.textContent = "Joining...";
      }

      const payload: Record<string, string> = { email, name, source: "landing_page" };
      if (phone) payload.phone = phone;

      fetch("https://105ec3w0n3.execute-api.us-east-1.amazonaws.com/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then(() => {
          if (form) form.style.display = "none";
          if (success) success.classList.add("show");
          if ((window as any).plausible) {
            (window as any).plausible("Waitlist Signup", { props: { source: "landing_page" } });
          }
        })
        .catch(() => {
          if (form) form.style.display = "none";
          if (success) success.classList.add("show");
        });

      // localStorage fallback
      const waitlist = JSON.parse(localStorage.getItem("karrera_waitlist") || "[]");
      waitlist.push({ name, email, phone, timestamp: new Date().toISOString(), source: "landing_page" });
      localStorage.setItem("karrera_waitlist", JSON.stringify(waitlist));

      // Typeform fallback
      const typeformData = new FormData();
      typeformData.append("email", email);
      typeformData.append("name", name);
      if (phone) typeformData.append("phone", phone);
      fetch("https://form.typeform.com/to/JZktLW1h", {
        method: "POST",
        mode: "no-cors",
        body: typeformData,
      }).catch(() => {});
    },
    []
  );

  const handleWaitlist = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      openWaitlistModal();
    },
    []
  );

  return (
    <>
      {/* Skip to main content (accessibility) */}
      <a
        href="#main-content"
        className="sr-only"
        style={{ position: "absolute", top: "-40px", left: 0, background: "var(--color-accent)", color: "#fff", padding: "8px 16px", zIndex: 100, transition: "top 0.2s" }}
        onFocus={(e) => { (e.target as HTMLElement).style.top = "0"; }}
        onBlur={(e) => { (e.target as HTMLElement).style.top = "-40px"; }}
      >
        Skip to main content
      </a>

      {/* ===== HEADER ===== */}
      <header className="header" id="header" ref={headerRef}>
        <div className="container header-inner">
          <a href="#" className="logo" aria-label="Karrera home">
            <svg className="logo-mark" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="32" height="32" rx="6" fill="var(--color-accent)" />
              <path d="M10 8v16M10 16l8-8M10 16l8 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="24" cy="8" r="2.5" fill="#34d399" />
            </svg>
            <span className="logo-text">Karrera</span>
          </a>

          <nav className="header-nav" aria-label="Main navigation">
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#pricing" className="nav-link">Pricing</a>
          </nav>

          <div className="header-actions">
            <button className="theme-toggle" data-theme-toggle aria-label="Switch to dark mode">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            </button>
            <a href="/why" className="btn btn-outline btn-sm nav-why-btn">Why Karrera</a>
            <a href="/login" className="btn btn-member btn-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '16px', height: '16px', flexShrink: 0}}>
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Member Access
            </a>
            <a href="https://buy.stripe.com/aFa6oAcMN2Pl4Spcpcb3q02" className="btn btn-accent btn-sm" target="_blank" rel="noopener noreferrer">Early Investor — $3/mo</a>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <main id="main-content">
        <section className="hero">
          <video className="hero-video" autoPlay muted loop playsInline disablePictureInPicture aria-hidden="true">
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="hero-video-overlay"></div>
          <div className="container">
            <div className="animate-in">
              <span className="hero-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                Patent-Pending Technology
              </span>
            </div>

            <h1 className="animate-in">Resumes that <span className="accent">compile.</span></h1>

            <p className="hero-sub animate-in">Turn self-reported career claims into cryptographically signed proof. Every credential verified. Every claim authenticated. No more trust gaps.</p>

            <div className="hero-cta animate-in">
              <a href="https://buy.stripe.com/aFa6oAcMN2Pl4Spcpcb3q02" className="btn btn-accent btn-lg" target="_blank" rel="noopener noreferrer">Become an Early Investor — $3/mo</a>
              <a href="/why" className="btn btn-outline btn-lg">Why Karrera</a>
            </div>

            <div className="hero-member-access animate-in">
              <a href="/login" className="member-access-link">
                <span className="member-access-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '14px', height: '14px'}}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </span>
                Already a member? <span className="member-access-cta">Enter your dashboard &rarr;</span>
              </a>
            </div>

            <div className="hero-proof animate-in">
              <span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                Email verified
              </span>
              <span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                LinkedIn verified
              </span>
              <span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                GitHub verified
              </span>
              <span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                Certifications verified
              </span>
            </div>

            {/* DSL Code Preview */}
            <div className="dsl-preview animate-in">
              <div className="dsl-header">
                <span className="dsl-dot dsl-dot--red"></span>
                <span className="dsl-dot dsl-dot--yellow"></span>
                <span className="dsl-dot dsl-dot--green"></span>
                <span className="dsl-filename">christian_perez.karr</span>
              </div>
              <pre className="dsl-body"><span className="kw">career</span> <span className="str">&quot;Agentic Engineer&quot;</span> {`{`}
{"\n"}
{"\n"}  <span className="kw">identity</span> {`{`}
{"\n"}    <span className="prop">email</span>    = <span className="str">&quot;c.perez@example.com&quot;</span>  <span className="verified-tag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg> verified</span>
{"\n"}    <span className="prop">phone</span>    = <span className="str">&quot;+1-XXX-XXX-1234&quot;</span>     <span className="verified-tag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg> verified</span>
{"\n"}    <span className="prop">linkedin</span> = <span className="str">&quot;in/christianperez&quot;</span>   <span className="verified-tag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg> verified</span>
{"\n"}  {`}`}
{"\n"}
{"\n"}  <span className="kw">certification</span> <span className="str">&quot;AWS Solutions Architect&quot;</span> {`{`}
{"\n"}    <span className="prop">issuer</span>   = <span className="str">&quot;Amazon Web Services&quot;</span>
{"\n"}    <span className="prop">badge</span>    = <span className="str">&quot;credly.com/badges/...&quot;</span>  <span className="verified-tag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg> verified</span>
{"\n"}  {`}`}
{"\n"}
{"\n"}  <span className="cmt">{"// ✓ Compiled — all claims authenticated"}</span>
{"\n"}{`}`}</pre>
            </div>
          </div>
        </section>

        {/* ===== STATS BAR ===== */}
        <section className="stats-bar">
          <div className="container">
            <div className="stats-grid">
              <div className="reveal">
                <div className="stat-number">70%</div>
                <div className="stat-label">of workers lie on resumes</div>
              </div>
              <div className="reveal">
                <div className="stat-number">$600B</div>
                <div className="stat-label">annual cost of resume fraud</div>
              </div>
              <div className="reveal">
                <div className="stat-number">3.6B</div>
                <div className="stat-label">global labor force</div>
              </div>
              <div className="reveal">
                <div className="stat-number">0</div>
                <div className="stat-label">universal trust standards</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="section" id="how-it-works">
          <div className="container">
            <div className="section-header reveal">
              <div className="section-label">How It Works</div>
              <h2 className="section-title">Three steps to verified proof</h2>
              <p className="section-subtitle">Karrera uses a domain-specific language to structure your career claims, then authenticates each one against the original issuer.</p>
            </div>

            {/* Verification concept video */}
            <div className="concept-video-wrapper reveal">
              <video className="concept-video" autoPlay muted loop playsInline disablePictureInPicture>
                <source src="/verify-concept.mp4" type="video/mp4" />
              </video>
            </div>

            <div className="steps-grid">
              <div className="step-card reveal">
                <div className="step-number">1</div>
                <h3 className="step-title">Paste your resume</h3>
                <p className="step-desc">Our AI agent ingests your resume, LinkedIn, or raw text — then structures every claim into Karrera&apos;s verification-ready format.</p>
              </div>

              <div className="step-card reveal">
                <div className="step-number">2</div>
                <h3 className="step-title">Verify each claim</h3>
                <p className="step-desc">Authenticate via OAuth (Google, LinkedIn, GitHub), SMS, or certification badge. Each verified claim generates a cryptographic JWT proof.</p>
              </div>

              <div className="step-card reveal">
                <div className="step-number">3</div>
                <h3 className="step-title">Compile &amp; share</h3>
                <p className="step-desc">Your profile compiles only when claims are verified. Share a tamper-proof link or QR code. Employers verify instantly — no phone calls, no delays.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== WHY KARRERA ===== */}
        <section className="section" style={{ borderTop: "1px solid var(--color-divider)" }}>
          <div className="container">
            <div className="section-header reveal">
              <div className="section-label">Why Karrera</div>
              <h2 className="section-title">The notary pattern</h2>
              <p className="section-subtitle">We don&apos;t require employers or institutions to adopt new standards. Karrera witnesses your authentication against existing systems — like a digital notary.</p>
            </div>

            <div className="trust-grid">
              <div className="trust-card reveal">
                <div className="trust-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                </div>
                <h3>Zero issuer burden</h3>
                <p>Universities, employers, and certifiers don&apos;t need to change anything. We authenticate through their existing OAuth and public verification systems.</p>
              </div>

              <div className="trust-card reveal">
                <div className="trust-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </div>
                <h3>Privacy by design</h3>
                <p>All PII is SHA-256 hashed before storage. Your data stays yours. Verifiers confirm claims without seeing raw personal information.</p>
              </div>

              <div className="trust-card reveal">
                <div className="trust-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                </div>
                <h3>Cryptographic proof</h3>
                <p>Every verified claim produces a signed JWT attestation. Not a checkbox — a tamper-evident, timestamped, cryptographic receipt.</p>
              </div>

              <div className="trust-card reveal">
                <div className="trust-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                </div>
                <h3>Universal &amp; portable</h3>
                <p>Your Karrera profile works everywhere — share a link, scan a QR code, export a verified PDF. One source of truth for your entire career.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== PRICING ===== */}
        <section className="section pricing-section" id="pricing">
          <div className="container">
            <div className="section-header reveal">
              <div className="section-label">Pricing</div>
              <h2 className="section-title">Start with $1. Know where you stand.</h2>
              <p className="section-subtitle">Get your first career assessment for a dollar. Upgrade to keep your credentials verified, tracked, and always current.</p>
            </div>

            <div className="pricing-cards pricing-cards--three">
              <div className="pricing-card reveal">
                <div className="pricing-label">First Assessment</div>
                <div className="pricing-amount">$1</div>
                <p className="pricing-desc">One-time career credential assessment. See exactly where you stand — verified, partially verified, or needs work.</p>
                <ul className="pricing-features" role="list">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Full credential scan
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Verified / Partially Verified / Not Verified status
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Shareable trust score
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    AI-powered resume structuring
                  </li>
                </ul>
                <a href="#waitlist" className="btn btn-outline" style={{ width: "100%" }}>Join Waitlist</a>
              </div>

              <div className="pricing-card pricing-card--investor reveal">
                <div className="pricing-badge-investor">Early Investor — Limited</div>
                <div className="pricing-label">Karrera Pro</div>
                <div className="pricing-amount">$3<span>/month</span></div>
                <div className="pricing-lock">Locked for life <span className="pricing-savings">(70% off $9.99)</span></div>
                <p className="pricing-desc">Everything in Pro — plus a free upgrade to Karrera Elite when it ships. This rate disappears at launch.</p>
                <ul className="pricing-features" role="list">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Everything in Karrera Pro
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    $3/month locked forever
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Free upgrade to Karrera Elite
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Early Investor badge on your profile
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Priority verification processing
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Direct feedback channel
                  </li>
                </ul>
                <a href="https://buy.stripe.com/aFa6oAcMN2Pl4Spcpcb3q02" className="btn btn-accent" style={{ width: "100%" }} target="_blank" rel="noopener noreferrer">Become an Early Investor</a>
                <p className="pricing-note">Secure Stripe checkout · Cancel anytime</p>
              </div>

              <div className="pricing-card reveal">
                <div className="pricing-label">Karrera Pro</div>
                <div className="pricing-amount">$9.99<span>/month</span></div>
                <div className="pricing-lock" style={{ opacity: 0.5 }}>At launch</div>
                <p className="pricing-desc">Continuous verification monitoring. Track skill atrophy, maintain active proofs, and keep your profile compiled.</p>
                <ul className="pricing-features" role="list">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Everything in First Assessment
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Skill atrophy tracking &amp; alerts
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Continuous verification maintenance
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Verified PDF export with proof marks
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    QR code &amp; embeddable badge
                  </li>
                </ul>
                <a href="#waitlist" className="btn btn-outline" style={{ width: "100%" }}>Join Waitlist</a>
              </div>
            </div>
          </div>
        </section>

        {/* ===== WAITLIST CTA ===== */}
        <section className="section waitlist-section" id="waitlist">
          <div className="container">
            <div className="section-header reveal">
              <div className="section-label">Early Access</div>
              <h2 className="section-title">Be first in line</h2>
              <p className="section-subtitle">Join the waitlist for early access. Be among the first to compile your career.</p>
            </div>

            <form className="waitlist-form reveal" id="waitlist-form" onSubmit={handleWaitlist}>
              <input type="email" className="waitlist-input" placeholder="you@example.com" required aria-label="Email address" />
              <button type="submit" className="btn btn-accent waitlist-btn">Join Waitlist</button>
            </form>
            <p className="waitlist-note reveal">No spam. We&apos;ll notify you when early access opens.</p>

            <div className="waitlist-success" id="waitlist-success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", marginBottom: "var(--space-2)" }}>You&apos;re on the list.</h3>
              <p style={{ color: "inherit", opacity: 0.7, fontSize: "var(--text-sm)" }}>We&apos;ll reach out when early access is ready.</p>
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <a href="#" className="logo" aria-label="Karrera home" style={{ marginBottom: "var(--space-2)" }}>
              <svg className="logo-mark" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: "24px", height: "24px" }}>
                <rect width="32" height="32" rx="6" fill="var(--color-accent)" />
                <path d="M10 8v16M10 16l8-8M10 16l8 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="24" cy="8" r="2.5" fill="#34d399" />
              </svg>
              <span className="logo-text" style={{ fontSize: "var(--text-sm)" }}>Karrera</span>
            </a>
            <p className="footer-text">&copy; 2026 Karrera. The trust layer for human capital.</p>
          </div>
          <div className="footer-links">
            <a href="/why" className="footer-why-link">Why Karrera</a>
            <a href="#pricing">Pricing</a>
            <a href="#how-it-works">How It Works</a>
            <a href="/login" className="footer-member-link">Member Access</a>
            <a href="https://buy.stripe.com/aFa6oAcMN2Pl4Spcpcb3q02" target="_blank" rel="noopener noreferrer">Early Investor — $3/mo</a>
            <a href="mailto:hello@karrera.dev">Contact</a>
          </div>
        </div>
      </footer>

      {/* ===== WAITLIST MODAL ===== */}
      <div className="modal-overlay" id="waitlist-modal" ref={modalRef} aria-hidden="true" role="dialog" aria-labelledby="modal-title" aria-modal="true">
        <div className="modal-backdrop" data-modal-close onClick={closeWaitlistModal}></div>
        <div className="modal-content">
          <button className="modal-close" data-modal-close aria-label="Close" onClick={closeWaitlistModal}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
          <div className="modal-header">
            <svg className="modal-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="32" height="32" rx="6" fill="var(--color-accent)" />
              <path d="M10 8v16M10 16l8-8M10 16l8 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="24" cy="8" r="2.5" fill="#34d399" />
            </svg>
            <h3 id="modal-title" className="modal-title">Join the Waitlist</h3>
            <p className="modal-subtitle">Be among the first to compile your career.</p>
          </div>
          <form className="modal-form" id="modal-waitlist-form" onSubmit={handleModalWaitlist}>
            <div className="modal-field">
              <label htmlFor="modal-name">Full Name</label>
              <input type="text" id="modal-name" name="name" placeholder="Jane Doe" required autoComplete="name" />
            </div>
            <div className="modal-field">
              <label htmlFor="modal-email">Email</label>
              <input type="email" id="modal-email" name="email" placeholder="you@example.com" required autoComplete="email" />
            </div>
            <div className="modal-field">
              <label htmlFor="modal-phone">Phone <span className="optional-label">(optional)</span></label>
              <input type="tel" id="modal-phone" name="phone" placeholder="+1 (555) 000-0000" autoComplete="tel" />
            </div>
            <button type="submit" className="btn btn-accent modal-submit-btn" id="modal-submit-btn">Join Waitlist</button>
            <p className="modal-note">No spam. We&apos;ll notify you when early access opens.</p>
          </form>
          <div className="modal-success" id="modal-success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            <h3>You&apos;re on the list.</h3>
            <p>We&apos;ll reach out when early access is ready.</p>
          </div>
        </div>
      </div>
    </>
  );
}
