"use client";

import { useState } from "react";

export default function SettingsForm({
  initialData,
}: {
  initialData: { name: string; email: string; phone: string };
}) {
  const [name, setName] = useState(initialData.name);
  const [phone, setPhone] = useState(initialData.phone);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Settings saved successfully." });
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error ?? "Failed to save." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error." });
    }

    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-gray-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={initialData.email}
          readOnly
          className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
        />
        <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-gray-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
          placeholder="+1 (555) 000-0000"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {saving ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
