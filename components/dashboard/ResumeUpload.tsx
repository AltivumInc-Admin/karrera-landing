"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

type UploadState = "idle" | "uploading" | "confirming" | "done" | "error";

export default function ResumeUpload() {
  const router = useRouter();
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["pdf", "docx"].includes(ext)) {
      setError("Only PDF and DOCX files are accepted.");
      setState("error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File must be under 10MB.");
      setState("error");
      return;
    }

    setState("uploading");
    setError("");
    setProgress(0);

    try {
      // Get presigned URL
      const presignRes = await fetch("/api/resume/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "application/octet-stream",
        }),
      });

      if (!presignRes.ok) {
        const data = await presignRes.json();
        throw new Error(data.error ?? "Failed to get upload URL");
      }

      const { url, key } = await presignRes.json();

      // Upload to S3 via presigned URL
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        });
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Upload failed: ${xhr.status}`));
        });
        xhr.addEventListener("error", () => reject(new Error("Upload failed")));
        xhr.open("PUT", url);
        xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
        xhr.send(file);
      });

      // Confirm upload
      setState("confirming");
      const confirmRes = await fetch("/api/resume/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      if (!confirmRes.ok) throw new Error("Failed to confirm upload");

      setState("done");
      setTimeout(() => router.refresh(), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setState("error");
    }
  }, [router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    disabled: state === "uploading" || state === "confirming",
  });

  if (state === "done") {
    return (
      <div className="bg-white border border-green-200 rounded-xl p-12 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900">Upload complete!</h3>
        <p className="text-sm text-gray-500 mt-1">Your resume is being parsed...</p>
      </div>
    );
  }

  if (state === "uploading" || state === "confirming") {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <FileText className="w-12 h-12 text-teal-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900">
          {state === "uploading" ? "Uploading..." : "Processing..."}
        </h3>
        <div className="max-w-xs mx-auto mt-4">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${state === "confirming" ? 100 : progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {state === "confirming" ? "Almost done..." : `${progress}%`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-teal-500 bg-teal-50"
            : "border-gray-300 bg-white hover:border-teal-400 hover:bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
        </h3>
        <p className="text-sm text-gray-500">or click to browse</p>
        <p className="text-xs text-gray-400 mt-2">PDF or DOCX, max 10MB</p>
      </div>

      {state === "error" && error && (
        <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
