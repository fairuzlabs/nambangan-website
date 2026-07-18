"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Newspaper, Archive, Map, Headphones, Info,
  LogOut, ExternalLink, Menu, X, Leaf, ChevronRight, Settings,
} from "lucide-react";
import { isAuthenticated, adminLogout } from "@/lib/adminAuth";
import { Toaster } from "@/components/ui/sonner";

const NAV_GROUPS = [
  {
    label: null,
    items: [{ path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Konten",
    items: [
      { path: "/admin/berita",    label: "Berita & Info",   icon: Newspaper },
      { path: "/admin/arsip",     label: "Arsip Digital",   icon: Archive },
      { path: "/admin/podcast",   label: "Podcast",         icon: Headphones },
    ],
  },
  {
    label: "Wilayah",
    items: [
      { path: "/admin/peta",      label: "Peta & Lokasi",   icon: Map },
    ],
  },
  {
    label: "Pengaturan",
    items: [
      { path: "/admin/informasi", label: "Informasi RW",    icon: Settings },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated() && pathname !== "/admin/login") router.push("/admin/login");
  }, [pathname]);

  useEffect(() => setSidebarOpen(false), [pathname]);

  const handleLogout = () => {
    adminLogout();
    router.push("/admin/login");
  };

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  const currentPageLabel =
    NAV_GROUPS.flatMap(g => g.items).find(i => isActive(i.path))?.label ?? "Admin";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-green-300" />
          </div>
          <div>
            <div className="text-white font-bold text-xs" style={{ fontFamily: "var(--font-serif)" }}>RW 18 Nambangan</div>
            <div className="text-green-400/60 text-[10px] font-medium tracking-wide">Panel Admin</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <p className="text-green-400/50 text-[10px] font-bold uppercase tracking-widest px-3 mb-2">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(({ path, label, icon: Icon }) => {
                const active = isActive(path);
                return (
                  <Link
                    key={path}
                    href={path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      active
                        ? "bg-green-500/20 text-white"
                        : "text-green-200/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-green-400" : "text-green-400/50 group-hover:text-green-400/80"}`} />
                    {label}
                    {active && <ChevronRight className="w-3 h-3 ml-auto text-green-400/60" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-green-200/60 hover:bg-white/5 hover:text-white transition-all"
        >
          <ExternalLink className="w-4 h-4 text-green-400/50" />
          Lihat Website
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/70 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </div>
  );

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex w-60 flex-col flex-shrink-0 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #1a2a14 0%, #111a0d 100%)" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside
            className="relative w-64 flex flex-col"
            style={{ background: "linear-gradient(160deg, #1a2a14 0%, #111a0d 100%)" }}
          >
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 h-14 flex items-center px-4 sm:px-6 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden mr-4 p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400 font-medium">Admin</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-gray-900 font-semibold">{currentPageLabel}</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="w-7 h-7 bg-green-700 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="hidden sm:block text-xs font-medium text-gray-700">Admin RW 18</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
