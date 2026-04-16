"use client";

import { useEffect } from "react";
import MarketingEffects from "./MarketingEffects";

/**
 * Client island for the /why page.
 * Provides scroll-reveal + smooth-scroll via MarketingEffects,
 * plus pre-order CTA tracking and FAQ accordion behavior.
 */
export default function WhyClient() {
  // Track pre-order CTA clicks
  useEffect(() => {
    function handlePreorderClick(this: HTMLElement) {
      if ((window as any).plausible) {
        (window as any).plausible("Pre-Order Click", {
          props: { location: this.closest("section")?.id || "header" },
        });
      }
    }
    const btns = document.querySelectorAll("[data-preorder-cta]");
    btns.forEach((btn) => {
      btn.addEventListener("click", handlePreorderClick as EventListener);
    });
    return () => {
      btns.forEach((btn) => {
        btn.removeEventListener("click", handlePreorderClick as EventListener);
      });
    };
  }, []);

  // FAQ accordion
  useEffect(() => {
    function handleSummaryClick(this: HTMLElement) {
      const item = this.closest(".faq-item");
      document.querySelectorAll(".faq-item[open]").forEach((other) => {
        if (other !== item) other.removeAttribute("open");
      });
    }
    const summaries = document.querySelectorAll(".faq-item summary");
    summaries.forEach((s) => {
      s.addEventListener("click", handleSummaryClick as EventListener);
    });
    return () => {
      summaries.forEach((s) => {
        s.removeEventListener("click", handleSummaryClick as EventListener);
      });
    };
  }, []);

  return <MarketingEffects />;
}
