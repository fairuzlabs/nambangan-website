"use client";

import Link from "next/link";
import { Calendar, User, Tag } from "lucide-react";
import { api, type NewsItem } from "@/lib/api";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { useState, useEffect } from "react";

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<string[]>(["Semua"]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [catsRes, newsRes] = await Promise.all([
          api.getNewsCategories(),
          api.getNews({ limit: 100 })
        ]);

        const catsData = catsRes?.data || [];
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

  const filteredNews = selectedCategory === "Semua"
    ? news
    : news.filter(item => item.category === selectedCategory);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Berita & Informasi
          </h1>
          <p className="text-gray-600">
            Informasi terkini seputar kegiatan dan perkembangan RW 18 Nambangan
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
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
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Tidak ada berita untuk kategori ini</p>
          </div>
        )}
      </div>
    </div>
  );
}