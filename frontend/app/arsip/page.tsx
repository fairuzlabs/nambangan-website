"use client";

import { useState } from "react";
import { Archive, FileText, Image, BookOpen, Download, Filter, X, ChevronLeft, ChevronRight, Search, Calendar, Tag } from "lucide-react";
import { arsipData, type ArsipItem } from "@/data/mockData";

const TYPE_LABELS: Record<ArsipItem["type"], string> = {
  foto: "Foto Dokumentasi",
  laporan: "Laporan PDF",
  catatan: "Catatan Kegiatan",
};

const TYPE_ICONS: Record<ArsipItem["type"], typeof Image> = {
  foto: Image,
  laporan: FileText,
  catatan: BookOpen,
};

const TYPE_COLORS: Record<ArsipItem["type"], string> = {
  foto: "bg-green-100 text-green-700",
  laporan: "bg-red-100 text-red-700",
  catatan: "bg-gray-200 text-gray-700",
};

const CATEGORY_COLORS: Record<string, string> = {
  Adaptasi: "bg-teal-100 text-teal-700",
  Mitigasi: "bg-red-100 text-red-700",
};

function PhotoGallery({ images, title }: { images: string[]; title: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const prev = () => setLightboxIndex(i => (i !== null ? (i - 1 + images.length) % images.length : 0));
  const next = () => setLightboxIndex(i => (i !== null ? (i + 1) % images.length : 0));

  return (
    <>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setLightboxIndex(i)}
            className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 group"
          >
            <img src={src} alt={`${title} ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <img
            src={images[lightboxIndex]}
            alt={`${title} ${lightboxIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 text-white/60 text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}

function ArsipCard({ item }: { item: ArsipItem }) {
  const [expanded, setExpanded] = useState(false);
  const TypeIcon = TYPE_ICONS[item.type];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-green-200 transition-colors overflow-hidden">
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${TYPE_COLORS[item.type].replace("text-", "bg-").replace("-700", "-100")}`}>
            <TypeIcon className={`w-6 h-6 ${TYPE_COLORS[item.type].split(" ")[1]}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${TYPE_COLORS[item.type]}`}>
                {TYPE_LABELS[item.type]}
              </span>
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${CATEGORY_COLORS[item.category] ?? "bg-gray-100 text-gray-600"}`}>
                {item.category}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 leading-snug mb-1">{item.title}</h3>
            <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(item.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" /> {item.kegiatan}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          {item.type === "foto" && item.images && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-sm bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-lg transition-colors font-medium"
            >
              <Image className="w-4 h-4" />
              {expanded ? "Tutup Galeri" : `Lihat ${item.images.length} Foto`}
            </button>
          )}
          {(item.type === "laporan" || item.type === "catatan") && item.fileUrl && (
            <a
              href={item.fileUrl}
              download={item.fileName}
              className="flex items-center gap-2 text-sm bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors font-medium"
            >
              <Download className="w-4 h-4" />
              Unduh {item.fileName}
              {item.fileSize && <span className="text-green-500 font-normal">({item.fileSize})</span>}
            </a>
          )}
        </div>

        {/* Photo gallery */}
        {expanded && item.images && (
          <PhotoGallery images={item.images} title={item.title} />
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {item.tags.map(tag => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Arsip() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<ArsipItem["type"] | "Semua">("Semua");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const types: Array<ArsipItem["type"] | "Semua"> = ["Semua", "foto", "laporan", "catatan"];
  const categories = ["Semua", ...Array.from(new Set(arsipData.map(a => a.category)))];

  const filtered = arsipData.filter(item => {
    const matchType = activeType === "Semua" || item.type === activeType;
    const matchCategory = activeCategory === "Semua" || item.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || item.title.toLowerCase().includes(q) || item.kegiatan.toLowerCase().includes(q) || item.tags.some(t => t.toLowerCase().includes(q));
    return matchType && matchCategory && matchSearch;
  });

  const counts = {
    foto: arsipData.filter(a => a.type === "foto").length,
    laporan: arsipData.filter(a => a.type === "laporan").length,
    catatan: arsipData.filter(a => a.type === "catatan").length,
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
              <Archive className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Arsip Digital Proklim</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Dokumentasi lengkap kegiatan Program Kampung Iklim RW 18 Nambangan — foto, laporan PDF, dan
            catatan kegiatan adaptasi maupun mitigasi yang dapat diakses publik dan diunduh oleh penilai DLH.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Foto Dokumentasi", value: counts.foto, icon: Image, color: "text-blue-600" },
            { label: "Laporan PDF", value: counts.laporan, icon: FileText, color: "text-orange-600" },
            { label: "Catatan Kegiatan", value: counts.catatan, icon: BookOpen, color: "text-purple-600" },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl p-4 text-center shadow-sm">
                <Icon className={`w-6 h-6 mx-auto mb-1 ${stat.color}`} />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari dokumen, kegiatan, atau tag..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Type filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-gray-500 font-medium"><Filter className="w-3 h-3" /> Jenis:</span>
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    activeType === type ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {type === "Semua" ? "Semua Jenis" : TYPE_LABELS[type]}
                </button>
              ))}
            </div>

            {/* Category filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500 font-medium">Program:</span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    activeCategory === cat ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            Menampilkan <span className="font-semibold text-gray-900">{filtered.length}</span> dari {arsipData.length} dokumen
          </p>
          {(searchQuery || activeType !== "Semua" || activeCategory !== "Semua") && (
            <button
              onClick={() => { setSearchQuery(""); setActiveType("Semua"); setActiveCategory("Semua"); }}
              className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Reset filter
            </button>
          )}
        </div>

        {/* Archive list */}
        <div className="space-y-4 mb-12">
          {filtered.map(item => (
            <ArsipCard key={item.id} item={item} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Archive className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">Dokumen tidak ditemukan</p>
              <p className="text-sm mt-1">Coba ubah kata kunci atau filter pencarian.</p>
            </div>
          )}
        </div>

        {/* DLH Download CTA */}
        <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-2xl p-8 text-white">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Download className="w-8 h-8 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold mb-1">Penilai DLH & Pemangku Kepentingan</h3>
              <p className="text-green-100 text-sm mb-4">
                Seluruh laporan dan dokumentasi tersedia untuk diunduh secara gratis. Hubungi pengurus
                RW 18 untuk mendapatkan akses paket dokumen lengkap penilaian Proklim.
              </p>
              <a
                href="/about"
                className="inline-flex items-center gap-2 bg-white text-green-800 font-semibold px-5 py-2.5 rounded-lg hover:bg-green-50 transition-colors text-sm"
              >
                <FileText className="w-4 h-4" />
                Hubungi Pengurus RW
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
