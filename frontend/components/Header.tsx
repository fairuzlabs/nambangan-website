"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Newspaper, Map, Archive, Headphones, Info, Menu, X, Leaf } from "lucide-react";
import { useState, useEffect } from "react";

const NAV = [
  { path: "/",        label: "Beranda",  icon: Home },
  { path: "/news",    label: "Berita",   icon: Newspaper },
  { path: "/peta",    label: "Peta",     icon: Map },
  { path: "/podcast", label: "Podcast",  icon: Headphones },
  { path: "/arsip",   label: "Arsip",    icon: Archive },
  { path: "/about",   label: "Tentang",  icon: Info },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200"
          : "bg-white border-b border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-green-200 transition-shadow">
              <Leaf className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-gray-900 text-sm leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
                RW 18 Nambangan
              </div>
              <div className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">
                Rejowinangun Utara
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV.map(({ path, label, icon: Icon }) => {
              const active = isActive(path);
              return (
                <Link
                  key={path}
                  href={path}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-green-50 text-green-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                  {active && (
                    <span className="w-1 h-1 rounded-full bg-green-600" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-0.5 shadow-lg">
          {NAV.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                href={path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-green-50 text-green-800"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
