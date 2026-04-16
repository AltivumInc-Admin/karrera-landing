import "@/styles/landing.css";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import SkipToContent from "@/components/marketing/SkipToContent";
import LandingClient from "@/components/marketing/LandingClient";
import { STRIPE_PAYMENT_URL } from "@/lib/constants";

export default function LandingPage() {
  return (
    <>
      <SkipToContent />
      <Header variant="home" />
      <LandingClient />

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
              <a href={STRIPE_PAYMENT_URL} className="btn btn-accent btn-lg" target="_blank" rel="noopener noreferrer">Become an Early Investor — $3/mo</a>
              <a href="/why" className="btn btn-outline btn-lg">Why Karrera</a>
            </div>

            <div className="hero-member-access animate-in">
              <a href="/login" className="member-access-link">
                <span className="member-access-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: "14px", height: "14px"}}>
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
                <a href={STRIPE_PAYMENT_URL} className="btn btn-accent" style={{ width: "100%" }} target="_blank" rel="noopener noreferrer">Become an Early Investor</a>
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

            <form className="waitlist-form reveal" id="waitlist-form">
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

      <Footer variant="home" />
    </>
  );
}
