"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Boxes,
  LayoutDashboard,
  Sun,
  Moon,
  Bell,
  Search,
  Menu,
  PanelLeft,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNotificationStore } from "@/lib/stores/notification-store";

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    setQuery("");
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <div
        className={cn(
          "fixed left-1/2 top-1/4 z-50 w-full max-w-lg -translate-x-1/2 rounded-xl border border-zinc-700/50 bg-zinc-900/95 p-4 shadow-2xl backdrop-blur-xl transition-all duration-200",
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-2 scale-95 opacity-0"
        )}
      >
        <div className="flex items-center gap-3 rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-4 py-2.5">
          <Search className="h-4 w-4 text-zinc-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blocks, workflows, or commands..."
            className="flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
          />
          <kbd className="hidden rounded border border-zinc-600 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 sm:inline">
            ESC
          </kbd>
        </div>
        {query.length > 0 && (
          <div className="mt-2 text-xs text-zinc-500 px-2 py-1">
            No results for &quot;{query}&quot;
          </div>
        )}
      </div>
    </>
  );
}

function NotificationCenter() {
  const { notifications, unreadCount, markRead, markAllRead, clearAll } = useNotificationStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setOpen(!open)}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-zinc-700/50 bg-zinc-900/95 p-2 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-medium text-zinc-200">Notifications</span>
              <div className="flex gap-2">
                <button onClick={markAllRead} className="text-xs text-zinc-400 hover:text-zinc-200">
                  Mark all read
                </button>
                <button onClick={clearAll} className="text-xs text-zinc-400 hover:text-zinc-200">
                  Clear
                </button>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto space-y-1">
              {notifications.length === 0 && (
                <p className="py-6 text-center text-xs text-zinc-500">No notifications</p>
              )}
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={cn(
                    "w-full rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-zinc-800/50",
                    !n.read && "bg-zinc-800/30"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium text-zinc-200">{n.title}</span>
                    {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-400 line-clamp-2">{n.message}</p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const NAV_LINKS = [
  { href: "/canvas", label: "Canvas", icon: PanelLeft },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-zinc-950/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 transition-transform group-hover:scale-105">
                <Boxes className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-zinc-100 hidden sm:block">
                AI Canvas OS
              </span>
            </Link>
            <div className="hidden items-center gap-0.5 md:flex">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-zinc-800/60 text-zinc-100"
                        : "text-zinc-400 hover:bg-zinc-800/30 hover:text-zinc-200"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden items-center gap-1 md:flex">
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-200">
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-200">
              <PanelLeft className="h-4 w-4" />
            </Button>

            <div className="mx-2 h-5 w-px bg-zinc-800" />

            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-300"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Search...</span>
              <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
                Ctrl+K
              </kbd>
            </button>

            <NotificationCenter />

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-zinc-400 hover:text-zinc-200"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            <div className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-[10px] font-bold text-white">
              U
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center rounded-lg p-2 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-white/5 bg-zinc-950/95 backdrop-blur-xl md:hidden">
            <div className="space-y-1 px-4 py-3">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-zinc-800/60 text-zinc-100"
                        : "text-zinc-400 hover:bg-zinc-800/30 hover:text-zinc-200"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
              <hr className="my-2 border-zinc-800" />
              <div className="flex items-center gap-2 px-3 py-2">
                <button
                  onClick={() => { setCommandPaletteOpen(true); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-400"
                >
                  <Search className="h-3.5 w-3.5" />
                  Search
                </button>
                <button
                  onClick={toggleTheme}
                  className="rounded-lg border border-zinc-800 p-1.5 text-zinc-400"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
