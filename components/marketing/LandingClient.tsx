"use client";

import { useState, useCallback } from "react";
import WaitlistModal from "./WaitlistModal";
import MarketingEffects from "./MarketingEffects";

/**
 * Client island for the landing page.
 * Manages the waitlist modal open/close state and provides
 * scroll-reveal + smooth-scroll via MarketingEffects.
 */
export default function LandingClient() {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <>
      <MarketingEffects onWaitlistClick={openModal} />
      <WaitlistModal isOpen={modalOpen} onClose={closeModal} />
    </>
  );
}
