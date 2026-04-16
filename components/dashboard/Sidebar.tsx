"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, Settings, LogOut } from "lucide-react";

const navItems = [
  { label: "Resume", href: "/dashboard/resume", icon: FileText },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <aside className="w-56 bg-[#0f1729] text-white flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 pt-6 pb-8">
        <Link href="/" className="flex items-center gap-2">
          <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="#0d9488" />
            <path d="M10 8v16M10 16l8-8M10 16l8 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="24" cy="8" r="2.5" fill="#34d399" />
          </svg>
          <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
            Karrera
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <div className="space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-white/10 text-white font-medium"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User info + Logout */}
      <div className="px-3 pb-4 mt-auto border-t border-white/10 pt-4">
        <div className="px-3 mb-3">
          <div className="text-sm font-medium text-white/90 truncate">{userName || "User"}</div>
          <div className="text-xs text-white/40 truncate">{userEmail}</div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors w-full"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
