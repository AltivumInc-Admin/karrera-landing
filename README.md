# Karrera — The Trust Layer for Human Capital

> **Resumes that compile.**

Karrera turns self-reported career claims into cryptographically signed proof of who you are. Built on a patent-pending domain-specific language (DSL), Karrera enforces verification as a compile-time constraint — if a claim can't be authenticated against the original issuer, the profile won't compile.

**Live site:** [master.dqzdzf3srnlw1.amplifyapp.com](https://master.dqzdzf3srnlw1.amplifyapp.com/)

---

## Table of Contents

- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [How It Works](#how-it-works)
- [The Karrera DSL](#the-karrera-dsl)
- [System Architecture](#system-architecture)
- [Verification Providers](#verification-providers)
- [Landing Page](#landing-page)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [Pricing](#pricing)
- [Payments](#payments)
- [Deployment](#deployment)
- [Local Development](#local-development)
- [Market Context](#market-context)
- [Competition](#competition)
- [Patent](#patent)
- [Roadmap](#roadmap)
- [Contact](#contact)
- [License](#license)

---

## The Problem

Traditional resumes suffer from three fundamental deficiencies: **ambiguity**, **unverifiability**, and **nondeterminism**.

- A claim of "Solutions Architect" has no formal definition and may mean vastly different things across organizations
- There exists no mechanism within traditional resume formats to verify that claims are authentic
- The same underlying career history may be represented in countless ways depending on formatting and word choice
- Background checks are expensive, time-consuming, and occur only after significant investment in the hiring process

The numbers tell the story:

| Statistic | Source |
|-----------|--------|
| **70% of workers** admit to lying on their resumes | [Forbes, 2023](https://www.forbes.com/sites/bryanrobinson/2023/11/05/70-of-workers-lie-on-resumes-new-study-shows/) |
| Resume fraud costs employers **$600 billion per year** | [Crosschq, 2025](https://www.crosschq.com/blog/resume-fraud-the-600-billion-crisis-transforming-how-organizations-verify-talent-in-2025) |
| The global labor force is **3.6 billion** people | [United Nations, 2026](https://news.un.org/en/story/2026/01/1166751) |
| There are **zero** universal standards for career trust | — |

The rise of AI agents acting on behalf of humans makes this worse. When an AI agent applies for jobs, negotiates contracts, or makes claims on someone's behalf, the receiving party has no way to distinguish legitimate claims from fabricated ones. The trust infrastructure for the agentic era does not exist yet.

---

## The Solution

Karrera introduces the **notary pattern** — a verification architecture that witnesses authentication against existing issuer systems without requiring those issuers to adopt new standards.

Think of it this way: a traditional notary doesn't create documents — they witness signatures and attest that the signing occurred. Karrera does the same thing digitally. When you authenticate with Google, LinkedIn, GitHub, or Twilio through Karrera, we witness that authentication and produce a cryptographic attestation (a signed JWT) proving the verification happened.

This means:
- **Universities don't need to change anything** — we authenticate through their existing OAuth systems
- **Employers don't need to adopt new standards** — we witness authentication against their existing identity providers
- **Certification bodies don't need an API** — we verify through public badge URLs (e.g., Credly)
- **The user controls their own data** — all PII is SHA-256 hashed before storage; verifiers confirm claims without seeing raw personal information

The output is a `.karr` file — a deterministic, machine-readable career representation where every claim is backed by cryptographic proof.

---

## How It Works

Karrera operates in three steps, surfaced clearly on the landing page:

### Step 1: Paste Your Resume

An AI agent (powered by Perplexity Computer) ingests a resume, LinkedIn profile, or raw text. It structures every claim into Karrera's verification-ready DSL format, identifying which claims can be verified and through which providers.

### Step 2: Verify Each Claim

Each structured claim is authenticated against its original issuer:

- **Email** — Google OAuth 2.0 flow verifies ownership of the email address
- **Phone** — Twilio SMS sends a one-time code to verify the phone number
- **LinkedIn** — LinkedIn OAuth confirms profile ownership and matches claims
- **GitHub** — GitHub OAuth verifies account ownership and contribution history
- **Certifications** — Public badge URLs (e.g., Credly) are fetched and validated

Each successful verification produces a **JWT attestation** — a signed, timestamped, tamper-evident receipt containing the claim hash, verification method, provider, and expiration.

### Step 3: Compile and Share

The profile compiles only when claims are verified. Unverified claims are excluded from the compiled output. The result is a trust score (percentage of verified claims) and a shareable, tamper-proof career file. Users can share via link, QR code, or verified PDF export.

---

## The Karrera DSL

The Karrera DSL uses an HCL-inspired syntax where career claims are structured into typed blocks. Verification metadata is a required structural element — the compiler rejects claims that lack proof.

### Example `.karr` File

```hcl
career "Agentic Engineer" {

  identity {
    email    = "c.perez@example.com"    // ✓ verified via Google OAuth
    phone    = "+1-XXX-XXX-1234"        // ✓ verified via Twilio SMS
    linkedin = "in/christianperez"      // ✓ verified via LinkedIn OAuth
  }

  experience "Senior Engineer" {
    employer = "Acme Corp"
    start    = "2020-01"
    end      = "2024-06"
  }

  certification "AWS Solutions Architect" {
    issuer = "Amazon Web Services"
    badge  = "credly.com/badges/..."    // ✓ verified via badge URL
  }

  education "BS Computer Science" {
    institution = "University of Tennessee"
    year        = "2015"
  }

  // ✓ Compiled — all claims authenticated
}
```

### DSL Block Types

| Block | Purpose | Verification Method |
|-------|---------|-------------------|
| `identity` | Core identity claims (email, phone, social profiles) | OAuth, SMS |
| `experience` | Employment history (employer, role, dates) | Employer email domain OAuth, LinkedIn cross-reference |
| `certification` | Professional certifications (issuer, badge) | Credly badge URL, issuer API |
| `education` | Academic credentials (institution, degree, year) | .edu email OAuth, transcript API |

### DSL Rules

1. Every `.karr` file must begin with a `career` block containing a label (the career title)
2. Block types are keywords: `identity`, `experience`, `certification`, `education`
3. Properties use `key = "value"` assignment syntax
4. String values are enclosed in double quotes
5. Comments use `//` or `#` prefix
6. Verification metadata (verified status, JWT proof, method, provider) is appended by the compiler after verification — it is not manually authored
7. Claims without verification proofs are rejected at compile time and excluded from output

---

## System Architecture

The Karrera system is composed of five patent-defined components, implemented as independent packages in a TypeScript monorepo:

```
                          ┌─────────────────────┐
                          │     User Input       │
                          │  Resume / LinkedIn   │
                          │  Raw Text / .karr    │
                          └──────────┬──────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │    Perplexity Computer AI Agent  │
                    │    Resume Ingestion & Structuring│
                    └────────────────┬────────────────┘
                                     │
                          ┌──────────▼──────────┐
                          │  DSL Processor (100) │
                          │  Lexer → Parser →    │
                          │  AST → Validator     │
                          └──────────┬──────────┘
                                     │
                      ┌──────────────▼──────────────┐
                      │  Verification Runtime (200)  │
                      │  Provider Registry           │
                      │  ┌────────┐ ┌────────┐      │
                      │  │ Google │ │LinkedIn│      │
                      │  │ OAuth  │ │ OAuth  │      │
                      │  └────────┘ └────────┘      │
                      │  ┌────────┐ ┌────────┐      │
                      │  │ GitHub │ │ Twilio │      │
                      │  │ OAuth  │ │  SMS   │      │
                      │  └────────┘ └────────┘      │
                      │  ┌────────┐                  │
                      │  │ Credly │                  │
                      │  │Badge   │                  │
                      │  └────────┘                  │
                      └──────────────┬──────────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │     Privacy Module (300)         │
                    │     SHA-256 Hashing of PII       │
                    │     sha256:<hex_digest>           │
                    └────────────────┬────────────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │  Cryptographic Signing (400)     │
                    │  JWT Generation (HMAC-SHA256)    │
                    │  AWS KMS Key Management          │
                    └────────────────┬────────────────┘
                                     │
                          ┌──────────▼──────────┐
                          │ Output Generator     │
                          │ (Compiler) (500)     │
                          │ Proof Embedding      │
                          │ Trust Score Calc     │
                          │ Unverified → Reject  │
                          └──────────┬──────────┘
                                     │
                          ┌──────────▼──────────┐
                          │  Verified Career     │
                          │  Representation      │
                          │  .karr + JWTs        │
                          └─────────────────────┘
```

### Component Details

| Component | Patent Ref | Package | Description |
|-----------|-----------|---------|-------------|
| DSL Processor | 100 | `packages/dsl-processor` | Tokenizes `.karr` source files into a stream of typed tokens (keywords, strings, identifiers, braces, equals, comments). Builds a typed abstract syntax tree (AST) with `CareerNode`, `BlockNode`, and `PropertyNode` types. Validates structural integrity — required fields per block type, duplicate key detection, empty value rejection. |
| Verification Runtime | 200 | `packages/verification` | Pluggable provider architecture. Each provider implements the `VerificationProvider` interface with a `verify(claim)` method returning a `VerificationResult`. The `ProviderRegistry` manages provider registration, retrieval, and enumeration. Providers for email (Google OAuth), LinkedIn (OAuth), GitHub (OAuth), phone (Twilio SMS), and certifications (Credly badge URL) are defined with full interfaces; verification logic awaits OAuth credential provisioning. |
| Privacy Module | 300 | `packages/privacy` | Hashes all personally identifiable information using SHA-256 with a `sha256:` prefix before storage. Includes specialized normalization: `hashEmail` lowercases and trims before hashing; `hashPhone` strips all non-digit characters before hashing; `hashLinkedIn` strips the `in/` prefix. All hashing is deterministic — the same input always produces the same output, enabling verification without exposing raw PII. |
| Cryptographic Signing | 400 | `packages/signing` | Generates JWT attestations using HMAC-SHA256 (HS256). Each attestation contains: `sub` (subject identifier), `claim_hash` (SHA-256 hash of the verified claim), `verified_at` (ISO 8601 timestamp), `method` (oauth, sms, api, or badge_url), `provider` (google, linkedin, github, twilio, or credly), `iss` ("karrera"), `jti` (UUID v4 for replay protection), `iat` (issued at), and `exp` (expiration). Supports creation, verification, and decoding of attestations. Production keys managed via AWS KMS. |
| Output Generator | 500 | `packages/compiler` | Orchestrates the full pipeline: parse `.karr` source → validate AST → for each claim block, look up the appropriate verification provider → execute verification → hash PII via the privacy module → sign a JWT attestation for each verified claim → compute trust score (percentage of verified blocks) → produce a `CompiledCareer` output object containing the structured data, attestation JWTs, and compilation metadata. Unverified claims are excluded from the compiled output. |

---

## Verification Providers

| Provider | Method | What's Verified | Trust Signal |
|----------|--------|----------------|-------------|
| Google | OAuth 2.0 | Email address ownership | User authenticated with Google, email address matches claim |
| LinkedIn | OAuth 2.0 | Profile ownership, employment history, connections | User authenticated with LinkedIn, profile data cross-referenced |
| GitHub | OAuth 2.0 | Account ownership, repository contributions, commit history | User authenticated with GitHub, contribution data verified |
| Twilio | SMS OTP | Phone number ownership | One-time code sent and correctly entered |
| Credly | Badge URL | Certification validity, issuer, credential status | Public badge URL fetched, metadata extracted, active status confirmed |

### Provider Interface

Each verification provider implements this TypeScript interface:

```typescript
interface VerificationProvider {
  name: string;       // e.g., "google", "linkedin"
  type: string;       // e.g., "oauth", "sms", "badge_url"
  verify(claim: Claim): Promise<VerificationResult>;
}

interface VerificationResult {
  verified: boolean;
  method: string;     // "oauth" | "sms" | "api" | "badge_url"
  provider: string;   // "google" | "linkedin" | "github" | "twilio" | "credly"
  evidence: Record<string, any>;
  timestamp: string;  // ISO 8601
}
```

---

## Landing Page

The public-facing landing page is the primary entry point for Karrera. It communicates the value proposition, demonstrates the DSL, presents pricing, and captures waitlist signups.

**Live URL:** [master.dqzdzf3srnlw1.amplifyapp.com](https://master.dqzdzf3srnlw1.amplifyapp.com/)

### Page Sections

| Section | Content |
|---------|---------|
| **Header** | Karrera logo (custom SVG mark — teal rounded-rect with stylized "K" letterform and verification dot), wordmark, dark/light mode toggle, "Join Waitlist" CTA |
| **Hero** | "Patent-Pending Technology" badge, headline ("Resumes that compile."), subheadline describing cryptographic verification, dual CTAs ("Get Verified — $1" and "See How It Works"), verification provider badges (Email, LinkedIn, GitHub, Certifications), live DSL code preview showing a `.karr` file with inline verified tags |
| **Stats Bar** | Four market statistics — 70% lie rate, $600B annual fraud cost, 3.6B global labor force, 0 universal trust standards |
| **How It Works** | Three-step flow: (1) Paste your resume — AI agent structures claims into DSL format; (2) Verify each claim — OAuth, SMS, and badge verification with JWT proof generation; (3) Compile & share — tamper-proof link, QR code, or verified PDF |
| **Why Karrera** | Four feature cards explaining the notary pattern: Zero issuer burden, Privacy by design, Cryptographic proof, Universal & portable |
| **Pricing** | Two pricing tiers: $1 one-time first assessment and $9.99/month Karrera Pro with skill atrophy tracking |
| **Waitlist** | Email capture form with success state animation. Dark navy background (light mode) or dark surface (dark mode). "Be first in line" messaging |
| **Footer** | Logo, copyright, contact/pricing/how-it-works links |

### DSL Code Preview

The hero section features an interactive code preview that visually demonstrates the `.karr` DSL syntax. It renders a mock file (`christian_perez.karr`) showing:

```
career "Agentic Engineer" {

  identity {
    email    = "c.perez@example.com"   ✓ verified
    phone    = "+1-XXX-XXX-1234"       ✓ verified
    linkedin = "in/christianperez"     ✓ verified
  }

  certification "AWS Solutions Architect" {
    issuer   = "Amazon Web Services"
    badge    = "credly.com/badges/..."  ✓ verified
  }

  // ✓ Compiled — all claims authenticated
}
```

The code preview uses syntax highlighting: keywords in teal, strings in green, properties in muted gray, comments in italic faint text, and verification tags as green badge chips with checkmark icons.

### Features

- **Dark/light mode** — Toggle button in header; respects system `prefers-color-scheme` on initial load; full palette swap across all sections including the waitlist dark section
- **Scroll-reveal animations** — Elements fade up on scroll using IntersectionObserver with a 10% threshold and -40px root margin; each element animates once and is then unobserved
- **Hero entrance animations** — Staggered `fadeInUp` keyframe animations with 150ms incremental delays across badge, headline, subheadline, CTAs, provider badges, and code preview
- **Sticky header** — Blurred backdrop (`backdrop-filter: blur(16px)`) with semi-transparent background; adds subtle box-shadow on scroll past 10px
- **Smooth scroll** — All anchor links (`#how-it-works`, `#pricing`, `#waitlist`) use `scrollIntoView` with smooth behavior
- **Responsive design** — Mobile-first CSS with breakpoints at 640px and 768px; stats grid collapses from 4-column to 2-column; pricing cards stack vertically; step cards stack vertically; waitlist form stacks vertically below 640px
- **Waitlist form** — Email validation with required attribute; on submit, hides form and shows success state with animated checkmark. Currently logs to console — production backend (DynamoDB + Lambda) pending
- **Accessibility** — ARIA labels on logo, theme toggle, and form input; `sr-only` utility class available; focus-visible outlines on all interactive elements; `role="list"` on feature lists; semantic HTML throughout (header, section, footer, nav)

---

## Project Structure

```
karrera-landing/
├── index.html          Single-page landing page (406 lines)
│                       Semantic HTML5 with inline SVG icons
│                       All JavaScript embedded in <script> tag (no build step)
│                       Font loading via Fontshare CDN + Google Fonts CDN
│
├── base.css            CSS reset and global defaults (125 lines)
│                       Box-sizing, font smoothing, text rendering
│                       Selection styling, focus-visible outlines
│                       Reduced-motion media query
│                       Transition defaults for interactive elements
│
├── style.css           Design tokens and component styles (964 lines)
│                       CSS custom properties for full theming
│                       Light mode palette (default)
│                       Dark mode palette (data-theme="dark" + prefers-color-scheme)
│                       All component styles (header, hero, cards, pricing, waitlist, footer)
│                       Animations (fadeInUp keyframes, scroll reveal transitions)
│
└── README.md           This file
```

There is no build step. The site is static HTML, CSS, and vanilla JavaScript. No frameworks, no bundlers, no transpilers. This is intentional — the landing page should load instantly and have zero dependencies that could break.

---

## Design System

### Typography

| Role | Font | Source | Weight |
|------|------|--------|--------|
| Display (headings) | Cabinet Grotesk | [Fontshare](https://www.fontshare.com/fonts/cabinet-grotesk) | 400, 500, 700, 800 |
| Body (paragraphs, UI) | Satoshi | [Fontshare](https://www.fontshare.com/fonts/satoshi) | 300, 400, 500, 600, 700 |
| Monospace (code, DSL) | JetBrains Mono | [Google Fonts](https://fonts.google.com/specimen/JetBrains+Mono) | 400, 500, 600 |

The type scale is fluid, using `clamp()` for responsive sizing from mobile to desktop:

| Token | Min | Max | Usage |
|-------|-----|-----|-------|
| `--text-xs` | 0.75rem | 0.875rem | Badges, labels, fine print |
| `--text-sm` | 0.875rem | 1rem | Card descriptions, feature lists |
| `--text-base` | 1rem | 1.125rem | Body text, form inputs |
| `--text-lg` | 1.125rem | 1.5rem | Card titles, subheadlines |
| `--text-xl` | 1.5rem | 2.25rem | Stat numbers, section titles |
| `--text-2xl` | 2rem | 3.5rem | Section headlines, pricing amounts |
| `--text-3xl` | 2.5rem | 5rem | Hero headline |

### Color Palette

#### Light Mode

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#f8f9fb` | Page background |
| `--color-surface` | `#ffffff` | Cards, code preview |
| `--color-surface-2` | `#f3f5f8` | Pricing section background, header backdrop |
| `--color-text` | `#0f1729` | Primary text (deep navy) |
| `--color-text-muted` | `#5a6578` | Secondary text, descriptions |
| `--color-text-faint` | `#98a2b3` | Tertiary text, stats labels |
| `--color-accent` | `#0d9488` | Teal — CTAs, badges, step numbers, icons |
| `--color-accent-light` | `#ccfbf1` | Badge backgrounds, icon containers |
| `--color-verified` | `#059669` | Verified tags in DSL preview |
| `--color-verified-light` | `#d1fae5` | Verified tag backgrounds |
| `--color-primary` | `#0f1729` | Waitlist section background (dark navy) |
| `--color-border` | `#cdd4de` | Card borders, dividers |

#### Dark Mode

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#0a0f1d` | Page background |
| `--color-surface` | `#111827` | Cards, code preview |
| `--color-text` | `#e2e8f0` | Primary text |
| `--color-accent` | `#2dd4bf` | Teal (brighter for dark bg) |
| `--color-verified` | `#34d399` | Verified tags |

### Logo

The Karrera logo is a custom inline SVG comprising three elements:

1. **Teal rounded rectangle** (6px corner radius) — brand container
2. **White "K" letterform** — stylized as a connected path (`M8 22V10l5 6 5-6v12`) creating a geometric, angular mark
3. **Green verification dot** (2.5px radius circle at top-right) — representing the verified state, echoing the green `✓ verified` tags used throughout the DSL syntax

The logo is rendered inline as an SVG element (not an external file) for zero-latency rendering. The same mark is used as the favicon via a data URI in the `<link>` tag.

---

## Pricing

Pricing is structured to maximize adoption while building sustainable revenue:

| Tier | Price | Type | What's Included |
|------|-------|------|-----------------|
| **First Assessment** | $1 | One-time | Full credential scan, verified/partially verified/not verified status, shareable trust score, AI-powered resume structuring via Perplexity Computer |
| **Karrera Pro** | $9.99/month | Recurring subscription | Everything in First Assessment, plus: skill atrophy tracking and alerts, continuous verification maintenance (re-verification as tokens expire), verified PDF export with cryptographic proof marks, QR code and embeddable verification badge, priority verification processing |

### Pricing Rationale

The $1 entry point is designed for maximum top-of-funnel conversion. At $1, the friction is near-zero — a user gets an immediate, tangible value moment (their trust score and verification status). The $9.99/month Pro tier captures users who want ongoing monitoring and maintenance of their verified profile, creating predictable recurring revenue.

The **skill atrophy** concept is a Karrera innovation: certifications expire, employment tenure changes, and skills degrade over time. Karrera Pro continuously monitors these signals and alerts users when their verified profile needs attention — creating natural retention.

---

## Payments

Stripe is fully configured and operational as the payment processor for Karrera.

### Stripe Account

| Field | Value |
|-------|-------|
| Account ID | `acct_1TM3X81SqwywXTAG` |
| Business Name | Karrera |
| Status | Active |

### Products

| Product | Product ID | Price ID | Amount | Billing |
|---------|-----------|----------|--------|---------|
| Karrera - Initial Assessment | `prod_UKj8L1QhCK16A1` | `price_1TM3g01SqwywXTAGXutl14Vx` | $1.00 USD | One-time |
| Karrera Pro | `prod_UKj66EIwHcJ3rd` | `price_1TM3dr1SqwywXTAGwDk9mwO0` | $9.99 USD | Monthly recurring |

### Payment Links

Pre-generated Stripe Checkout payment links are available for direct integration:

| Product | Payment Link |
|---------|-------------|
| Initial Assessment ($1) | [buy.stripe.com/bJe8wI0013Tp98F4WKb3q00](https://buy.stripe.com/bJe8wI0013Tp98F4WKb3q00) |
| Karrera Pro ($9.99/mo) | [buy.stripe.com/14A9AMbIJcpV4Sp60Ob3q01](https://buy.stripe.com/14A9AMbIJcpV4Sp60Ob3q01) |

These payment links can be wired directly into the landing page CTAs when the waitlist phase transitions to open registration.

---

## Deployment

The landing page is deployed on **AWS Amplify**, connected to this GitHub repository. Every push to `master` triggers an automatic build and deploy.

### Current Infrastructure

| Service | Purpose | Status |
|---------|---------|--------|
| **GitHub** | Source control, CI/CD trigger | [AltivumInc-Admin/karrera-landing](https://github.com/AltivumInc-Admin/karrera-landing) (public) |
| **AWS Amplify** | Hosting, SSL, CDN, auto-deploy | Live at [master.dqzdzf3srnlw1.amplifyapp.com](https://master.dqzdzf3srnlw1.amplifyapp.com/) |
| **Stripe** | Payment processing | Account active, products and payment links configured |

### Deployment Pipeline

```
git push origin master
        │
        ▼
  GitHub webhook
        │
        ▼
  AWS Amplify Build
  (no build step — static files copied directly)
        │
        ▼
  Amplify CDN
  HTTPS + automatic SSL certificate
        │
        ▼
  Live at *.amplifyapp.com
  (custom domain pending Route 53 provisioning)
```

### Pending Infrastructure

A dedicated AWS account is being provisioned to isolate all Karrera infrastructure. Once available:

1. **Custom domain** — Will be registered via Route 53 and connected to Amplify with automatic SSL certificate provisioning
2. **Backend services** — Lambda functions, API Gateway, DynamoDB, Cognito, and KMS will be deployed in the dedicated account
3. **Waitlist backend** — The landing page form will POST to an API Gateway endpoint backed by a Lambda function writing to DynamoDB

---

## Local Development

The landing page has zero dependencies and no build step. To run it locally:

```bash
# Clone the repository
git clone https://github.com/AltivumInc-Admin/karrera-landing.git
cd karrera-landing

# Open in browser (any method works)
open index.html
# or
python3 -m http.server 8000
# then visit http://localhost:8000
```

No `npm install`, no bundler configuration, no environment variables needed. The site loads fonts from CDN (Fontshare and Google Fonts) so an internet connection is required for correct typography rendering.

### Making Changes

1. Edit `index.html` (structure and content), `style.css` (design tokens and component styles), or `base.css` (reset and global defaults)
2. Refresh the browser
3. Commit and push — Amplify auto-deploys

```bash
git add -A
git commit -m "Description of changes"
git push origin master
```

---

## Market Context

Karrera operates at the intersection of three converging markets:

| Market | 2026 Size | 2033 Projection | Source |
|--------|----------|-----------------|--------|
| Digital Identity Verification | $17.3B | $54.2B | [LinkedIn Pulse](https://www.linkedin.com/pulse/digital-identity-verification-market-growth-forecast-2026-2030-pvy2e) |
| Digital Identity Wallet Users | 500M (2026) | — | [Gartner via SecurityBrief](https://securitybrief.com.au/story/gartner-predicts-500-million-will-use-digital-id-wallets-by-2026) |
| LinkedIn Registered Members | 1.3B | — | [LinkedIn](https://www.linkedin.com/pulse/linkedin-stats-2026-updated-joe-apfelbaum-sfxte) |
| Global Labor Force | 3.6B | — | [United Nations](https://news.un.org/en/story/2026/01/1166751) |

The total addressable market is every professional who has a resume — 3.6 billion people globally. The serviceable addressable market starts with the 1.3 billion LinkedIn users who already maintain digital professional profiles.

---

## Competition

Karrera is an entry in the **Perplexity Billion Dollar Build** competition.

| Detail | Value |
|--------|-------|
| Competition | [Perplexity Billion Dollar Build](https://www.perplexity.ai/computer/a/the-billion-dollar-build-ZWzIFW.FTaKdLtufMa0yhw) |
| Registration | April 14, 2026 |
| Submission Deadline | June 2, 2026 |
| Live Pitch | June 9, 2026 (5 min pitch + 5 min Q&A) |
| Builder | Christian Perez (solo) |
| Primary AI Tool | Perplexity Computer (required by competition rules) |
| Discord | [discord.gg/yemVcUXY](https://discord.gg/yemVcUXY) |

### Judging Criteria

1. **Market size** — Is the opportunity genuinely massive?
2. **Product quality** — Does the product work and solve a real problem?
3. **Traction** — Users, revenue, growth trajectory
4. **Perplexity Computer centrality** — Is Computer the primary AI in the workflow?

### Perplexity Computer's Role

Perplexity Computer is the primary AI tool throughout Karrera's lifecycle:

- **Architecture** — System design decisions, component interfaces, technology selection
- **Code generation** — Landing page (HTML/CSS/JS), engine scaffold (TypeScript monorepo), 102 tests
- **Research** — Market data, competition analysis, domain availability, pricing strategy
- **Design** — Brand identity, color palette, typography selection, responsive layout
- **Operations** — GitHub repository management, Stripe product/pricing configuration, deployment automation
- **Product integration** — Perplexity Computer will power the AI agent that ingests raw resumes and structures them into `.karr` DSL format

---

## Patent

Karrera is protected by a patent-pending filing:

> **KARRERA Notary Pattern System: Domain-Specific Language for Multi-Party Cryptographic Attestation of Career Credentials**
>
> Inventor: Christian Perez
>
> A verification notary system for generating trust-anchored career representations. The system comprises a domain-specific language (DSL) requiring verification metadata as structural elements of all claims, a verification runtime that witnesses authentication against authoritative issuers, a cryptographic signing module generating attestation proofs upon successful verification, and an output generator embedding proofs directly into career representation files.

The patent covers 16 claims across system, method, and computer-readable medium categories, protecting:

- The DSL enforcement of verification as a compile-time constraint
- The notary pattern for witnessing authentication against existing issuers
- The JWT attestation structure and generation method
- The privacy-preserving hashing of PII before storage
- The output generation excluding unverified claims

---

## Roadmap

### Sprint 1: Foundation (Apr 14 — Apr 27)

- [x] Domain infrastructure setup
- [x] Landing page with waitlist, pricing, and DSL preview
- [x] GitHub repository initialized (public landing page + private engine)
- [x] Stripe account with both products and payment links
- [x] DSL Processor (Component 100) — full parser, 28 tests
- [x] Privacy Module (Component 300) — SHA-256 hashing, 18 tests
- [x] JWT Signing Module (Component 400) — attestation generation, 17 tests
- [x] Verification Runtime (Component 200) — interfaces + 5 provider stubs, 21 tests
- [x] Compiler (Component 500) — end-to-end pipeline, 18 tests
- [x] CI/CD pipeline (GitHub Actions)
- [ ] Email verification provider (Google OAuth — first live provider)
- [ ] Wire waitlist form to backend (DynamoDB + Lambda)
- [ ] Deploy backend to AWS (Lambda + API Gateway)
- [ ] Compile Christian's own career file as proof of concept

### Sprint 2: Multi-Provider Verification (Apr 28 — May 4)

- [ ] LinkedIn OAuth verification provider
- [ ] GitHub OAuth verification provider
- [ ] Twilio SMS phone verification provider
- [ ] Credly badge URL certification provider
- [ ] Wire payment links into landing page CTAs

### Sprint 3: Public Beta (May 5 — May 11)

- [ ] Next.js web application (user dashboard, profile management)
- [ ] User authentication via Amazon Cognito
- [ ] Public beta launch
- [ ] User acquisition begins

### Sprint 4: Employer Portal (May 12 — May 18)

- [ ] Employer verification API (`GET /verify/:profile_id`)
- [ ] Embeddable verification badge
- [ ] QR code generation for verified profiles

### Sprint 5: Traction Push (May 19 — May 25)

- [ ] Analytics dashboard
- [ ] Referral system
- [ ] Performance optimization
- [ ] Growth campaigns

### Sprint 6: Submission (May 26 — Jun 1)

- [ ] Pitch video recording
- [ ] Submission package finalized
- [ ] Final polish and bug fixes

---

## Contact

- **Email:** hello@karrera.dev
- **Builder:** Christian Perez
- **Organization:** Altivum Inc

---

## License

Copyright 2026 Karrera / Altivum Inc. All rights reserved.

This landing page source code is publicly available for transparency and competition evaluation purposes. The underlying Karrera system, DSL specification, verification architecture, and notary pattern are protected by patent-pending intellectual property. See the [Patent](#patent) section for details.

Unauthorized use of the patented verification system architecture is prohibited. The landing page design and content may be referenced but not duplicated for competing products.
