import Link from "next/link";
import { Newspaper, MapPin, ArrowRight, Calendar, Users, Sprout, ShoppingBag, Headphones, Archive, ChevronDown } from "lucide-react";
import { api } from "@/lib/api";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

export const dynamic = "force-dynamic";

const HERO_IMG = "https://images.unsplash.com/photo-1565583673900-1cd9320f6c8b?w=1920&h=1080&fit=crop&auto=format&q=80";

export default async function Home() {
  let fetchedNews: any[] = [];
  try {
    const res = await api.getNews({ page: 1, limit: 3 });
    fetchedNews = res.data;
  } catch (err) {
    console.error("Gagal mengambil berita di homepage:", err);
  }

  let mapPoints: any[] = [];
  try {
    mapPoints = await api.getMapPoints();
  } catch (err) {
    console.error("Gagal mengambil data peta di homepage:", err);
  }

  let archiveCount = 0;
  try {
    const archives = await api.getArchives();
    archiveCount = archives.length;
  } catch (err) {
    console.error("Gagal mengambil data arsip di homepage:", err);
  }

  const proklimCount = mapPoints.filter((p) => p.locType === "proklim").length;
  const umkmCount = mapPoints.filter((p) => p.locType === "umkm").length;
  const kesenianCount = mapPoints.filter((p) => p.locType === "kesenian").length;

  const stats = [
    { value: `${archiveCount}`, label: "Dokumen Arsip", icon: Archive, color: "text-green-700" },
    { value: `${proklimCount}`, label: "Lokasi Proklim", icon: Sprout, color: "text-red-600" },
    { value: `${umkmCount}`, label: "Pelaku UMKM", icon: ShoppingBag, color: "text-amber-600" },
    { value: `${kesenianCount}`, label: "Spot Kesenian", icon: MapPin, color: "text-green-700" },
  ];

  const featured = fetchedNews[0] || {
    id: "",
    title: "Belum Ada Berita",
    excerpt: "Silakan isi konten berita melalui panel administrasi.",
    image: HERO_IMG,
    date: new Date().toISOString(),
    category: "Info",
    author: "Admin"
  };

  const sideNews = fetchedNews.slice(1, 3);

  return (
    <div className="bg-gray-50">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="Udara kawasan hijau RW 18 Nambangan"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-950/85 via-green-900/70 to-gray-900/60" />
        </div>

        {/* Decorative leaf blur */}
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-green-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-72 h-72 rounded-full bg-red-400/10 blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full mb-7 tracking-wide">
              <Sprout className="w-3.5 h-3.5 text-green-300" />
              Program Kampung Iklim · Kota Magelang
            </div>

            <h1
              className="text-5xl sm:text-6xl lg:text-7xl text-white mb-5 leading-tight"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 700 }}
            >
              RW 18<br />
              <span className="text-green-300">Nambangan</span>
            </h1>

            <p className="text-base sm:text-lg text-white/75 mb-3 font-medium tracking-wide">
              Rejowinangun Utara · Kota Magelang
            </p>

            <p className="text-white/65 text-sm sm:text-base leading-relaxed mb-10 max-w-lg">
              Portal informasi digital warga — berita terkini, peta UMKM &amp; Proklim,
              podcast edukasi lingkungan, dan arsip kegiatan kampung.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/peta"
                className="inline-flex items-center gap-2.5 bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-green-500/30 group"
              >
                <MapPin className="w-4.5 h-4.5" />
                Jelajahi Peta
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/news"
                className="inline-flex items-center gap-2.5 bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white font-semibold px-6 py-3 rounded-xl border border-white/25 transition-all"
              >
                <Newspaper className="w-4.5 h-4.5" />
                Baca Berita
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/40">
          <span className="text-xs tracking-widest uppercase">Gulir</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────────── */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-200">
            {stats.map(({ value, label, icon: Icon, color }) => (
              <div key={label} className="flex flex-col items-center py-7 px-4 gap-2">
                <Icon className={`w-5 h-5 ${color}`} />
                <span className="text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-serif)" }}>{value}</span>
                <span className="text-xs text-gray-500 text-center font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Berita terkini ────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-2">Kabar Warga</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900" style={{ fontFamily: "var(--font-serif)" }}>
                Berita Terkini
              </h2>
            </div>
            <Link href="/news" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800 group">
              Lihat Semua
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Magazine layout: 1 large + 2 side */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Featured */}
            <Link
              href={`/news/${featured.slug}`}
              className="lg:col-span-3 group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100"
            >
              <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 sm:p-8">
                <span className="inline-block text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full mb-3 uppercase tracking-wide">
                  {featured.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-800 transition-colors leading-snug" style={{ fontFamily: "var(--font-serif)" }}>
                  {featured.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">{featured.excerpt}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(featured.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>
            </Link>

            {/* Side stack */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {sideNews.map((news) => (
                <Link
                  key={news.id}
                  href={`/news/${news.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex sm:flex-row lg:flex-col"
                >
                  <div className="w-32 sm:w-40 lg:w-full h-32 sm:h-auto lg:h-40 flex-shrink-0 overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 sm:p-5 flex flex-col justify-center">
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full mb-2 inline-block w-fit uppercase tracking-wide">
                      {news.category}
                    </span>
                    <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 group-hover:text-green-800 transition-colors line-clamp-2" style={{ fontFamily: "var(--font-serif)" }}>
                      {news.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {new Date(news.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 sm:hidden text-center">
            <Link href="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-green-700">
              Lihat Semua Berita <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Peta teaser ───────────────────────────────── */}
      <section className="py-6 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-green-900 min-h-[260px] flex items-center">
            <img
              src="https://images.unsplash.com/photo-1575281340462-65340b91626d?w=1400&h=500&fit=crop&auto=format&q=70"
              alt="Peta wilayah RW 18"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="relative px-8 sm:px-14 py-14 max-w-xl">
              <p className="text-xs font-bold text-green-300 uppercase tracking-widest mb-3">Satu Peta · Semua Ada</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
                Jelajahi Wilayah RW 18
              </h2>
              <p className="text-white/65 text-sm leading-relaxed mb-7">
                Temukan lokasi Proklim, warung &amp; produk UMKM, dan spot budaya kesenian warga — semuanya dalam satu peta interaktif.
              </p>
              <Link
                href="/peta"
                className="inline-flex items-center gap-2.5 bg-white text-green-900 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors group"
              >
                <MapPin className="w-4 h-4" />
                Buka Peta
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── Fitur lain ────────────────────────────────── */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-2">Lebih Banyak</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-serif)" }}>
              Fitur Digital RW 18
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                to: "/podcast",
                icon: Headphones,
                bg: "from-green-50 to-green-100",
                iconBg: "bg-green-700",
                title: "Podcast Lingkungan",
                desc: "Dengarkan obrolan warga dan kader seputar lingkungan, Proklim, dan pertanian urban.",
                linkText: "Dengarkan",
                linkColor: "text-green-700",
              },
              {
                to: "/arsip",
                icon: Archive,
                bg: "from-red-50 to-red-100",
                iconBg: "bg-red-500",
                title: "Arsip Digital",
                desc: "Dokumentasi kegiatan Proklim: foto, laporan PDF, dan catatan yang dapat diunduh.",
                linkText: "Buka Arsip",
                linkColor: "text-red-600",
              },
              {
                to: "/about",
                icon: Users,
                bg: "from-gray-100 to-gray-200",
                iconBg: "bg-gray-700",
                title: "Tentang RW 18",
                desc: "Visi-misi, struktur organisasi, dan informasi lengkap tentang RW 18 Nambangan.",
                linkText: "Selengkapnya",
                linkColor: "text-gray-700",
              },
            ].map(({ to, icon: Icon, bg, iconBg, title, desc, linkText, linkColor }) => (
              <Link
                key={to}
                href={to}
                className={`group bg-gradient-to-br ${bg} rounded-2xl p-7 hover:shadow-lg transition-all border border-white`}
              >
                <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-serif)" }}>{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">{desc}</p>
                <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${linkColor} group-hover:gap-2.5 transition-all`}>
                  {linkText} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
