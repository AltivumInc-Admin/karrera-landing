"use client";

import { useCallback, useEffect, useRef } from "react";
import Logo from "./Logo";
import { WAITLIST_API_URL, TYPEFORM_URL } from "@/lib/constants";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // Lock/unlock body scroll and manage focus
  useEffect(() => {
    if (isOpen) {
      lastFocusedRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      // Reset form state
      const form = modalRef.current?.querySelector("#modal-waitlist-form") as HTMLFormElement | null;
      if (form) {
        form.style.display = "";
        form.reset();
      }
      const success = modalRef.current?.querySelector("#modal-success") as HTMLElement | null;
      if (success) success.classList.remove("show");
      const submitBtn = modalRef.current?.querySelector("#modal-submit-btn") as HTMLButtonElement | null;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Join Waitlist";
      }
      setTimeout(() => {
        const nameInput = modalRef.current?.querySelector("#modal-name") as HTMLInputElement | null;
        if (nameInput) nameInput.focus();
      }, 150);
    } else {
      document.body.style.overflow = "";
      if (lastFocusedRef.current) lastFocusedRef.current.focus();
    }
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;
    const modal = modalRef.current;
    if (!modal) return;

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

    modal.addEventListener("keydown", handleTab);
    return () => modal.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const form = modalRef.current?.querySelector("#modal-waitlist-form") as HTMLFormElement | null;
      const success = modalRef.current?.querySelector("#modal-success") as HTMLElement | null;
      const btn = modalRef.current?.querySelector("#modal-submit-btn") as HTMLButtonElement | null;
      const nameInput = modalRef.current?.querySelector("#modal-name") as HTMLInputElement | null;
      const emailInput = modalRef.current?.querySelector("#modal-email") as HTMLInputElement | null;
      const phoneInput = modalRef.current?.querySelector("#modal-phone") as HTMLInputElement | null;

      const name = nameInput?.value.trim() || "";
      const email = emailInput?.value.trim() || "";
      const phone = phoneInput?.value.trim() || "";

      if (btn) {
        btn.disabled = true;
        btn.textContent = "Joining...";
      }

      const payload: Record<string, string> = { email, name, source: "landing_page" };
      if (phone) payload.phone = phone;

      fetch(WAITLIST_API_URL, {
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
      fetch(TYPEFORM_URL, {
        method: "POST",
        mode: "no-cors",
        body: typeformData,
      }).catch(() => {});
    },
    []
  );

  return (
    <div
      className={`modal-overlay${isOpen ? " active" : ""}`}
      id="waitlist-modal"
      ref={modalRef}
      aria-hidden={!isOpen}
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content">
        <button className="modal-close" aria-label="Close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="modal-header">
          <Logo className="modal-icon" />
          <h3 id="modal-title" className="modal-title">Join the Waitlist</h3>
          <p className="modal-subtitle">Be among the first to compile your career.</p>
        </div>
        <form className="modal-form" id="modal-waitlist-form" onSubmit={handleSubmit}>
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
  );
}
