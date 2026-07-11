import Link from "next/link";
import { MapPin, Phone, Mail, Leaf, ArrowRight } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const QUICK_LINKS = [
  { to: "/news",    label: "Berita Terkini" },
  { to: "/peta",    label: "Peta Wilayah" },
  { to: "/podcast", label: "Podcast" },
  { to: "/arsip",   label: "Arsip Proklim" },
  { to: "/about",   label: "Tentang RW 18" },
];

const PROKLIM_LINKS = [
  "Bank Sampah Mandiri",
  "Taman Hidroponik",
  "Biopori & Sumur Resapan",
  "Taman TOGA",
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">

      {/* CTA strip */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: "var(--font-serif)" }}>
              Warga RW 18 Nambangan?
            </h3>
            <p className="text-gray-400 text-sm">Sampaikan aspirasi atau kontribusi konten melalui pengurus RW.</p>
          </div>
          <a
            href="tel:02931234567"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors flex-shrink-0 group"
          >
            Hubungi Pengurus
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-white text-sm" style={{ fontFamily: "var(--font-serif)" }}>RW 18 Nambangan</div>
                <div className="text-xs text-gray-500">Rejowinangun Utara</div>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Kampung iklim mandiri di Kota Magelang — bergerak bersama warga untuk lingkungan yang lebih sehat dan sejahtera.
            </p>
            <div className="flex gap-2.5">
              {[
                { icon: FaFacebook,  href: "#", label: "Facebook" },
                { icon: FaInstagram, href: "#", label: "Instagram" },
                { icon: FaYoutube,   href: "#", label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-gray-800 hover:bg-green-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Menu</h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link href={to} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Proklim */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Program Proklim</h4>
            <ul className="space-y-3">
              {PROKLIM_LINKS.map(item => (
                <li key={item}>
                  <Link href="/peta" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600 group-hover:bg-green-400 transition-colors flex-shrink-0" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Kontak</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">
                  Nambangan, Rejowinangun Utara,<br />Kota Magelang, Jawa Tengah
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                <a href="tel:02931234567" className="text-sm text-gray-400 hover:text-white transition-colors">
                  (0293) 123-4567
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-green-500 flex-shrink-0" />
                <a href="mailto:rw18nambangan@gmail.com" className="text-sm text-gray-400 hover:text-white transition-colors">
                  rw18nambangan@gmail.com
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© 2026 RW 18 Nambangan Rejowinangun Utara. Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1.5">
            <Leaf className="w-3 h-3 text-green-600" />
            Program Kampung Iklim · Kota Magelang
          </p>
        </div>
      </div>
    </footer>
  );
}
