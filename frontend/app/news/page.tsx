"use client";

import Link from "next/link";
import { Calendar, User, Tag, Search, X, ArrowUpDown } from "lucide-react";
import { api, type NewsItem } from "@/lib/api";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { useState, useEffect } from "react";

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<string[]>(["Semua"]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"created" | "date">("created");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [catsRes, newsRes] = await Promise.all([
          api.getNewsCategories(),
          api.getNews({ limit: 100 })
        ]);

        const catsData = Array.isArray(catsRes) ? catsRes : (catsRes?.data || []);
        setCategories(["Semua", ...catsData.map((c: any) => c.name)]);

        const newsData = newsRes?.data || [];
        setNews(newsData);
      } catch (err) {
        console.error("Gagal memuat data berita:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredNews = news
    .filter(item => {
      const matchCategory = selectedCategory === "Semua" || item.category === selectedCategory;
      const matchSearch = !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (dateDiff !== 0) return dateDiff;
      }
      // Default (and tiebreaker for date mode): newest created first
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Berita &amp; Informasi
          </h1>
          <p className="text-gray-600">
            Informasi terkini seputar kegiatan dan perkembangan RW 18 Nambangan
          </p>
        </div>

        {/* Search, Sort & Category Filter */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8 space-y-4">
          {/* Top row: search + sort toggle */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berita berdasarkan judul atau konten..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all placeholder:text-gray-400 text-gray-900"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort toggle */}
            <button
              onClick={() => setSortBy(s => s === "created" ? "date" : "created")}
              title={sortBy === "created" ? "Urutkan berdasarkan tanggal terbit" : "Urutkan berdasarkan terbaru ditambahkan"}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all whitespace-nowrap ${
                sortBy === "date"
                  ? "bg-green-700 text-white border-green-700 shadow-sm"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <ArrowUpDown className="w-4 h-4 flex-shrink-0" />
              {sortBy === "date" ? "Tanggal Terbit" : "Terbaru"}
            </button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  selectedCategory === category
                    ? "bg-green-700 text-white shadow-sm shadow-green-700/20"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse border border-gray-100 h-[380px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-video relative overflow-hidden">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full mb-3">
                    {item.category}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {item.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(item.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {item.author}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredNews.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Tidak ada berita yang cocok</p>
            {(searchQuery || selectedCategory !== "Semua") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Semua");
                }}
                className="mt-4 inline-flex items-center gap-2 text-sm text-green-700 hover:text-green-600 font-semibold transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" /> Reset filter &amp; pencarian
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}