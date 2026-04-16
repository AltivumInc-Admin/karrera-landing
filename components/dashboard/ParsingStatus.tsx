"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ParsingStatus() {
  const router = useRouter();
  const [dots, setDots] = useState("");

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 500);

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch("/api/resume/status");
        const data = await res.json();
        if (data.status === "parsed" || data.status === "error") {
          router.refresh();
        }
      } catch {
        // ignore
      }
    }, 3000);

    return () => {
      clearInterval(dotInterval);
      clearInterval(pollInterval);
    };
  }, [router]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-50 mb-4">
        <svg className="w-8 h-8 text-teal-600 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Parsing your resume{dots}</h3>
      <p className="text-sm text-gray-500">
        Our AI is analyzing your resume and extracting structured data. This usually takes 30-60 seconds.
      </p>
    </div>
  );
}
