import "@/styles/landing.css";
import "@/styles/why.css";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import SkipToContent from "@/components/marketing/SkipToContent";
import WhyClient from "@/components/marketing/WhyClient";
import { STRIPE_PAYMENT_URL } from "@/lib/constants";

export default function WhyPage() {
  return (
    <>
      <SkipToContent />
      <Header variant="why" />
      <WhyClient />

      {/* ===== MAIN CONTENT ===== */}
      <main id="main-content">

        {/* ===== SECTION 1: THE CRISIS ===== */}
        <section className="why-hero">
          <div className="why-hero-bg"></div>
          <div className="container">
            <div className="why-hero-content">
              <span className="hero-badge animate-in">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                The Trust Crisis
              </span>

              <h1 className="animate-in">The hiring ecosystem is <span className="accent">broken.</span></h1>

              <p className="why-hero-sub animate-in">70% of workers admit to lying on their resumes. Generative AI just made fabrication effortless and undetectable. There is no universal standard for verifying that a person is who they say they are.</p>

              <div className="why-hero-cta animate-in">
                <a href="#preorder" className="btn btn-accent btn-lg">Pre-Order — $3/mo for Life</a>
                <a href="#what-is-karrera" className="btn btn-outline btn-lg">What is Karrera?</a>
              </div>
            </div>

            {/* Crisis Stats */}
            <div className="crisis-stats animate-in">
              <div className="crisis-stat">
                <div className="crisis-stat-number">70%</div>
                <div className="crisis-stat-context">of workers have lied on a resume</div>
                <div className="crisis-stat-source">Resume Builder, 2023</div>
              </div>
              <div className="crisis-stat">
                <div className="crisis-stat-number">$600B</div>
                <div className="crisis-stat-context">annual cost of credential fraud globally</div>
                <div className="crisis-stat-source">Crosschq Research</div>
              </div>
              <div className="crisis-stat">
                <div className="crisis-stat-number">$4,129</div>
                <div className="crisis-stat-context">average cost of one bad hire</div>
                <div className="crisis-stat-source">SHRM</div>
              </div>
              <div className="crisis-stat">
                <div className="crisis-stat-number">0</div>
                <div className="crisis-stat-context">universal trust standards for careers</div>
                <div className="crisis-stat-source">Industry-wide gap</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 2: AI IS MAKING IT WORSE ===== */}
        <section className="section why-ai-section">
          <div className="container">
            <div className="why-split">
              <div className="why-split-text reveal">
                <div className="section-label">The AI Amplifier</div>
                <h2 className="section-title">AI didn&apos;t fix the problem.<br />It broke it wide open.</h2>
                <p className="why-body-text">Before generative AI, fabricating a convincing resume took effort. Now anyone can generate a perfect resume, tailored cover letter, and fake portfolio in minutes. Hiring managers can no longer tell real from generated.</p>
                <p className="why-body-text">Background checks are reactive — they take days or weeks, cost thousands, and only catch lies after the damage is done. The system was already failing. AI made it collapse.</p>
                <p className="why-body-text why-highlight">The world needs a proactive, cryptographic, real-time trust layer for human credentials. That&apos;s Karrera.</p>
              </div>
              <div className="why-split-visual reveal">
                <div className="comparison-card comparison-card--before">
                  <div className="comparison-label">Before AI</div>
                  <div className="comparison-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                  </div>
                  <p>Fabrication took effort. Most lies were small embellishments.</p>
                </div>
                <div className="comparison-card comparison-card--after">
                  <div className="comparison-label">After AI</div>
                  <div className="comparison-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                  </div>
                  <p>Perfect resumes generated in seconds. Entire work histories fabricated at scale.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 3: WHAT IS KARRERA ===== */}
        <section className="section" id="what-is-karrera" style={{ borderTop: "1px solid var(--color-divider)" }}>
          <div className="container">
            <div className="section-header reveal">
              <div className="section-label">The Solution</div>
              <h2 className="section-title">Karrera is the notary for your career</h2>
              <p className="section-subtitle">A patent-pending system that cryptographically proves your credentials are real — without requiring anyone else to adopt new standards.</p>
            </div>

            <div className="notary-explanation reveal">
              <div className="notary-step">
                <div className="notary-step-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
                </div>
                <h3 className="notary-step-title">You authenticate</h3>
                <p className="notary-step-desc">Log in to Google, LinkedIn, GitHub, or any OAuth provider. Verify your phone via SMS. Link your Credly badges.</p>
              </div>
              <div className="notary-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              </div>
              <div className="notary-step">
                <div className="notary-step-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                </div>
                <h3 className="notary-step-title">Karrera witnesses</h3>
                <p className="notary-step-desc">Like a digital notary, Karrera watches you prove your identity against the original issuer. It records the verification.</p>
              </div>
              <div className="notary-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              </div>
              <div className="notary-step">
                <div className="notary-step-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                </div>
                <h3 className="notary-step-title">Cryptographic proof is generated</h3>
                <p className="notary-step-desc">Every verified claim produces a signed JWT attestation — timestamped, tamper-evident, machine-readable. Not a checkbox. A receipt.</p>
              </div>
            </div>

            {/* DSL Code Preview */}
            <div className="dsl-preview reveal" style={{ maxWidth: "640px", margin: "var(--space-12) auto 0" }}>
              <div className="dsl-header">
                <span className="dsl-dot dsl-dot--red"></span>
                <span className="dsl-dot dsl-dot--yellow"></span>
                <span className="dsl-dot dsl-dot--green"></span>
                <span className="dsl-filename">your_career.karr</span>
              </div>
              <pre className="dsl-body"><span className="kw">career</span> <span className="str">&quot;Your Name&quot;</span> {`{`}
{"\n"}
{"\n"}  <span className="kw">identity</span> {`{`}
{"\n"}    <span className="prop">email</span>    = <span className="str">&quot;you@company.com&quot;</span>     <span className="verified-tag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg> verified</span>
{"\n"}    <span className="prop">linkedin</span> = <span className="str">&quot;in/yourprofile&quot;</span>      <span className="verified-tag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg> verified</span>
{"\n"}    <span className="prop">github</span>   = <span className="str">&quot;github.com/you&quot;</span>      <span className="verified-tag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg> verified</span>
{"\n"}  {`}`}
{"\n"}
{"\n"}  <span className="kw">certification</span> <span className="str">&quot;AWS Solutions Architect&quot;</span> {`{`}
{"\n"}    <span className="prop">badge</span>  = <span className="str">&quot;credly.com/badges/...&quot;</span>  <span className="verified-tag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg> verified</span>
{"\n"}  {`}`}
{"\n"}
{"\n"}  <span className="cmt">{"// ✓ Compiled — every claim backed by cryptographic proof"}</span>
{"\n"}{`}`}</pre>
            </div>

            <div className="why-key-insight reveal">
              <div className="key-insight-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              </div>
              <p>Universities, employers, and certification bodies don&apos;t need to adopt anything new. Karrera authenticates through their <strong>existing</strong> systems. Zero issuer burden. That&apos;s what makes it scale.</p>
            </div>
          </div>
        </section>

        {/* ===== SECTION 4: WHO BENEFITS ===== */}
        <section className="section why-audience-section" style={{ background: "var(--color-surface-2)" }}>
          <div className="container">
            <div className="section-header reveal">
              <div className="section-label">Who Benefits</div>
              <h2 className="section-title">Built for people who refuse to be doubted</h2>
              <p className="section-subtitle">Whether you&apos;re proving yourself or verifying others, Karrera eliminates the trust gap.</p>
            </div>

            <div className="audience-grid">
              <div className="audience-card reveal">
                <div className="audience-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <h3>Job Seekers</h3>
                <p>In a sea of AI-generated resumes, a verified Karrera profile is proof you&apos;re real. Stand out by proving — not just claiming — your credentials. Your compiled profile is a competitive weapon.</p>
                <ul className="audience-benefits" role="list">
                  <li>Shareable verified profile link</li>
                  <li>QR code for interviews</li>
                  <li>Trust score that speaks for itself</li>
                </ul>
              </div>

              <div className="audience-card reveal">
                <div className="audience-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
                </div>
                <h3>Veterans</h3>
                <p>Military credentials don&apos;t translate cleanly to civilian resumes. Security clearances, MOS qualifications, service records — Karrera verifies what you actually earned and makes it legible to every employer.</p>
                <ul className="audience-benefits" role="list">
                  <li>Verify military email domains</li>
                  <li>Bridge the civilian translation gap</li>
                  <li>Prove what DD-214s can&apos;t convey</li>
                </ul>
              </div>

              <div className="audience-card reveal">
                <div className="audience-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                </div>
                <h3>Employers &amp; Recruiters</h3>
                <p>Stop spending $4,129 per bad hire on background checks that take weeks. Scan a Karrera QR code and get instant, cryptographic verification of every claim — before the first interview.</p>
                <ul className="audience-benefits" role="list">
                  <li>Instant verification portal</li>
                  <li>API for ATS integration</li>
                  <li>No account required to verify</li>
                </ul>
              </div>

              <div className="audience-card reveal">
                <div className="audience-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                </div>
                <h3>Certification Holders</h3>
                <p>Your AWS, Google Cloud, Azure, or CompTIA certifications are already verified through Credly. Karrera makes them part of a compiled, tamper-proof career file that employers can verify in one click.</p>
                <ul className="audience-benefits" role="list">
                  <li>Credly badge auto-verification</li>
                  <li>Compiled into your career file</li>
                  <li>Proof that never expires from your profile</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 5: WHY ADOPTION IS A MUST ===== */}
        <section className="section" style={{ borderTop: "1px solid var(--color-divider)" }}>
          <div className="container">
            <div className="section-header reveal">
              <div className="section-label">Why Now</div>
              <h2 className="section-title">This isn&apos;t optional anymore</h2>
              <p className="section-subtitle">The trust infrastructure for careers is being built right now. Early movers define the standard.</p>
            </div>

            <div className="urgency-grid">
              <div className="urgency-card reveal">
                <div className="urgency-number">01</div>
                <h3>AI resumes are flooding the market</h3>
                <p>Recruiters report that up to 50% of applications now contain AI-generated content. The signal-to-noise ratio is collapsing. Verified profiles cut through instantly.</p>
              </div>
              <div className="urgency-card reveal">
                <div className="urgency-number">02</div>
                <h3>Background checks are broken</h3>
                <p>They&apos;re slow (days to weeks), expensive ($100-$500 per check), and reactive — they only catch fraud after someone&apos;s already been hired. The industry needs a proactive alternative.</p>
              </div>
              <div className="urgency-card reveal">
                <div className="urgency-number">03</div>
                <h3>Network effects reward early adopters</h3>
                <p>The first verified profiles on the network are the most visible. Early Karrera users build reputation equity that compounds — the earlier you verify, the more trust you accumulate.</p>
              </div>
              <div className="urgency-card reveal">
                <div className="urgency-number">04</div>
                <h3>SSL certificates went from optional to mandatory</h3>
                <p>Browsers once said &quot;this site is secure.&quot; Now they warn when a site isn&apos;t. Career verification will follow the same path. Unverified resumes will become the red flag, not the norm.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 6: HOW EASY ===== */}
        <section className="section why-easy-section" style={{ background: "var(--color-surface-2)" }}>
          <div className="container">
            <div className="section-header reveal">
              <div className="section-label">Getting Started</div>
              <h2 className="section-title">Three minutes. That&apos;s it.</h2>
              <p className="section-subtitle">No forms to fill out. No documents to upload. No waiting period. Karrera verifies through the accounts you already use.</p>
            </div>

            <div className="easy-steps">
              <div className="easy-step reveal">
                <div className="easy-step-number">1</div>
                <div className="easy-step-content">
                  <h3>Paste your resume or LinkedIn URL</h3>
                  <p>Our AI agent reads your career data and automatically structures every claim into Karrera&apos;s verification-ready format. No manual entry.</p>
                </div>
              </div>
              <div className="easy-connector">
                <div className="easy-connector-line"></div>
              </div>
              <div className="easy-step reveal">
                <div className="easy-step-number">2</div>
                <div className="easy-step-content">
                  <h3>Tap to verify each claim</h3>
                  <p>Click &quot;Verify&quot; next to each credential. You&apos;ll be redirected to the original issuer — Google, LinkedIn, GitHub, Credly, or SMS. One tap per claim.</p>
                </div>
              </div>
              <div className="easy-connector">
                <div className="easy-connector-line"></div>
              </div>
              <div className="easy-step reveal">
                <div className="easy-step-number">3</div>
                <div className="easy-step-content">
                  <h3>Compile and share</h3>
                  <p>Once your claims are verified, hit &quot;Compile.&quot; Karrera generates your cryptographically signed career file. Share a link, scan a QR code, or export a verified PDF.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 7: PRE-ORDER (THE MONEY SECTION) ===== */}
        <section className="section preorder-section" id="preorder">
          <div className="container">
            <div className="section-header reveal">
              <div className="section-label">Early Investor Program</div>
              <h2 className="section-title">Back the trust layer before it ships</h2>
              <p className="section-subtitle">Pre-order now and lock in a rate that will never be offered again.</p>
            </div>

            <div className="preorder-grid">
              {/* Standard pricing context */}
              <div className="preorder-context reveal">
                <div className="context-label">At Launch</div>
                <div className="context-price">
                  <span className="context-amount">$9.99</span><span className="context-period">/month</span>
                </div>
                <p className="context-desc">Standard Karrera Pro when we ship. Continuous verification, skill tracking, verified exports.</p>
                <ul className="context-features" role="list">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    All verification providers
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Shareable verified profile
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Skill atrophy tracking
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Verified PDF export
                  </li>
                </ul>
              </div>

              {/* Early Investor offer */}
              <div className="preorder-card reveal">
                <div className="preorder-badge">Early Investor</div>
                <div className="preorder-price">
                  <span className="preorder-amount">$3</span><span className="preorder-period">/month</span>
                </div>
                <div className="preorder-lock">Locked for life</div>
                <p className="preorder-desc">Everything in Pro — plus an automatic upgrade to <strong>Karrera Elite</strong> when it ships. No price increase. Ever.</p>

                <ul className="preorder-features" role="list">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Everything in Karrera Pro
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    $3/month locked forever (70% off)
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Free upgrade to Karrera Elite at launch
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Priority verification processing
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Early Investor badge on your profile
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Shape the product — direct feedback channel
                  </li>
                </ul>

                <a href={STRIPE_PAYMENT_URL} className="btn btn-accent btn-lg preorder-btn" data-preorder-cta target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "20px", height: "20px", display: "inline", flexShrink: 0 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  Become an Early Investor — $3/mo
                </a>
                <p className="preorder-note">Cancel anytime. Rate locks the moment you subscribe.</p>
              </div>
            </div>

            {/* Trust signals */}
            <div className="preorder-trust reveal">
              <div className="trust-signal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                <span>Secure Stripe checkout</span>
              </div>
              <div className="trust-signal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                <span>Patent-pending technology</span>
              </div>
              <div className="trust-signal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 8: FAQ ===== */}
        <section className="section" style={{ background: "var(--color-surface-2)", borderTop: "1px solid var(--color-divider)" }}>
          <div className="container">
            <div className="section-header reveal">
              <div className="section-label">Questions</div>
              <h2 className="section-title">Frequently asked</h2>
            </div>

            <div className="faq-list">
              <details className="faq-item reveal">
                <summary className="faq-question">What exactly do I get as an Early Investor?</summary>
                <div className="faq-answer">
                  <p>You get Karrera Pro at $3/month — locked at that rate forever, even when the standard price is $9.99/month. When Karrera Elite launches, you&apos;ll be automatically upgraded at no additional cost. You also get priority verification processing and a direct feedback channel to shape the product.</p>
                </div>
              </details>

              <details className="faq-item reveal">
                <summary className="faq-question">When does the $3/month rate expire?</summary>
                <div className="faq-answer">
                  <p>The Early Investor rate is only available before Karrera ships. Once the product launches publicly, this offer disappears permanently. Your rate is locked the moment you subscribe.</p>
                </div>
              </details>

              <details className="faq-item reveal">
                <summary className="faq-question">What is Karrera Elite?</summary>
                <div className="faq-answer">
                  <p>Karrera Elite is our premium tier that will include advanced features beyond Pro — including employer-facing tools, advanced analytics, and premium verification providers. Details will be announced closer to launch. Every Early Investor gets Elite automatically.</p>
                </div>
              </details>

              <details className="faq-item reveal">
                <summary className="faq-question">Can I cancel my pre-order?</summary>
                <div className="faq-answer">
                  <p>Yes, you can cancel anytime through your Stripe billing portal. However, if you cancel the Early Investor subscription, the $3/month locked rate cannot be restored.</p>
                </div>
              </details>

              <details className="faq-item reveal">
                <summary className="faq-question">Do employers need to use Karrera for my profile to be useful?</summary>
                <div className="faq-answer">
                  <p>No. Your verified Karrera profile is a standalone trust document. You can share it as a link, QR code, or verified PDF. Employers can verify your credentials without an account — they just scan your profile and see the cryptographic proofs. No adoption required on their end.</p>
                </div>
              </details>

              <details className="faq-item reveal">
                <summary className="faq-question">Is my data safe?</summary>
                <div className="faq-answer">
                  <p>Yes. All personally identifiable information is SHA-256 hashed before storage. Your raw data is never stored on our servers. Verifiers can confirm your claims without seeing your personal information. Privacy isn&apos;t a feature — it&apos;s the architecture.</p>
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="section preorder-final">
          <div className="container">
            <div className="final-cta-content reveal">
              <h2 className="final-cta-title">The trust layer is being built.<br />Be part of it from day one.</h2>
              <p className="final-cta-sub">$3/month. Locked for life. Free upgrade to Elite. This offer disappears at launch.</p>
              <a href={STRIPE_PAYMENT_URL} className="btn btn-accent btn-lg" data-preorder-cta target="_blank" rel="noopener noreferrer">Become an Early Investor — $3/mo</a>
              <p className="final-cta-note">or <a href="/#waitlist" style={{ color: "var(--color-accent)", textDecoration: "underline" }}>join the free waitlist</a> to stay updated</p>
            </div>
          </div>
        </section>

      </main>

      <Footer variant="why" />
    </>
  );
}
