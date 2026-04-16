"use client";

import { useEffect } from "react";

/**
 * Client component that attaches scroll-reveal IntersectionObserver
 * and smooth-scroll behavior for anchor links.
 * Renders nothing — mount it once in each marketing page.
 */
export default function MarketingEffects({ onWaitlistClick }: { onWaitlistClick?: () => void }) {
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

  // Smooth scroll for anchor links
  useEffect(() => {
    function handleAnchorClick(this: HTMLAnchorElement, e: Event) {
      e.preventDefault();
      const href = this.getAttribute("href");
      if (href === "#waitlist" && onWaitlistClick) {
        onWaitlistClick();
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
  }, [onWaitlistClick]);

  return null;
}
