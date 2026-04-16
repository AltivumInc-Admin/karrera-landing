"use client";

import { useEffect, useState, useRef } from "react";
import { X, Download } from "lucide-react";

export default function ResumePreviewModal({
  s3Key,
  onClose,
}: {
  s3Key: string;
  onClose: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState(false);
  const [loading, setLoading] = useState(true);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchUrl() {
      try {
        const res = await fetch("/api/resume/preview");
        const data = await res.json();
        setUrl(data.url);
        setIsPdf(data.isPdf);
      } catch {
        // ignore
      }
      setLoading(false);
    }
    fetchUrl();
  }, []);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onClose();
  }

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden mx-4">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-700">Original Resume</span>
          <div className="flex items-center gap-2">
            {url && (
              <a
                href={url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download size={12} />
                Download
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="overflow-auto" style={{ height: "calc(85vh - 56px)" }}>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-sm text-gray-400">Loading preview...</div>
            </div>
          ) : url && isPdf ? (
            <iframe src={url} className="w-full h-full" title="Resume Preview" />
          ) : url ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <p className="text-sm text-gray-500">DOCX files cannot be previewed in the browser.</p>
              <a
                href={url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors"
              >
                Download Original
              </a>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-sm text-gray-400">Failed to load preview.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
