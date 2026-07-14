"use client";

import { useState } from "react";
import { Headphones, PlayCircle, Clock, User, Calendar, Tag, ChevronDown, ChevronUp } from "lucide-react";
import { api, type PodcastEpisode } from "@/lib/api";
import { useEffect } from "react";

function YouTubeEmbed({ embedId, title }: { embedId: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  const thumbnail = `https://img.youtube.com/vi/${embedId}/hqdefault.jpg`;

  if (!loaded) {
    return (
      <button
        onClick={() => setLoaded(true)}
        className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group"
        aria-label={`Putar: ${title}`}
      >
        <img src={thumbnail} alt={title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
            <PlayCircle className="w-10 h-10 text-white fill-white" />
          </div>
        </div>
        <div className="absolute bottom-2 left-3 text-white text-xs font-medium bg-black/50 px-2 py-0.5 rounded">
          YouTube
        </div>
      </button>
    );
  }

  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${embedId}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}

function EpisodeCard({ episode, featured = false }: { episode: PodcastEpisode; featured?: boolean }) {
  const [expanded, setExpanded] = useState(false);

  if (featured) {
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-green-100">
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Episode Terbaru</span>
            <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">{episode.category}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{episode.title}</h2>
          <p className="text-gray-600 mb-6">{episode.description}</p>
          <YouTubeEmbed embedId={episode.embedId} title={episode.title} />
          <div className="flex flex-wrap gap-4 mt-5 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {episode.host}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {episode.duration}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />
              {new Date(episode.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {episode.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
                <Tag className="w-3 h-3" /> {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-green-200 transition-colors overflow-hidden">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden bg-gray-100">
            <img src={episode.thumbnail} alt={episode.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <PlayCircle className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{episode.category}</span>
            </div>
            <h3 className="font-semibold text-gray-900 leading-snug mb-1 line-clamp-2">{episode.title}</h3>
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {episode.duration}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />
                {new Date(episode.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium"
        >
          {expanded ? <><ChevronUp className="w-4 h-4" /> Tutup</> : <><ChevronDown className="w-4 h-4" /> Putar Episode</>}
        </button>

        {expanded && (
          <div className="mt-4 space-y-4">
            <YouTubeEmbed embedId={episode.embedId} title={episode.title} />
            <p className="text-sm text-gray-600">{episode.description}</p>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <User className="w-4 h-4" /> <span>{episode.host}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {episode.tags.map(tag => (
                <span key={tag} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Podcast() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [categories, setCategories] = useState<string[]>(["Semua"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [catsRes, epRes] = await Promise.all([
          api.getPodcastCategories(),
          api.getPodcasts()
        ]);
        setCategories(["Semua", ...catsRes.map((c: any) => c.name)]);
        setEpisodes(epRes);
      } catch (err) {
        console.error("Gagal memuat podcast:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const featured = episodes[0];
  const rest = episodes.slice(1);

  const filtered = activeCategory === "Semua"
    ? rest
    : rest.filter(e => e.category === activeCategory);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Podcast Edukasi Lingkungan</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Dengarkan obrolan edukatif seputar lingkungan hidup dan Program Kampung Iklim bersama warga
            dan kader RW 18 Nambangan. Ditayangkan melalui YouTube dan dapat diakses gratis.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Episode", value: episodes.length },
            { label: "Kategori Topik", value: Math.max(0, categories.length - 1) },
            { label: "Mitra Narasumber", value: "4+" },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-green-700">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Featured episode */}
        <div className="mb-10">
          {loading ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 animate-pulse h-60" />
          ) : featured ? (
            <EpisodeCard episode={featured} featured />
          ) : null}
        </div>

        {/* Filter */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="text-xl font-bold text-gray-900">Episode Lainnya</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Episode list */}
        <div className="space-y-4 mb-12">
          {loading ? (
            [1, 2].map(n => (
              <div key={n} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse h-28" />
            ))
          ) : (
            <>
              {filtered.map(episode => (
                <EpisodeCard key={episode.id} episode={episode} />
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Headphones className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p>Belum ada episode di kategori ini.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Collaboration CTA */}
        <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-2xl p-8 text-white text-center">
          <Headphones className="w-10 h-10 mx-auto mb-4 opacity-80" />
          <h3 className="text-xl font-bold mb-2">Ingin Jadi Narasumber?</h3>
          <p className="text-green-100 mb-6 max-w-md mx-auto text-sm">
            Punya cerita inspiratif seputar lingkungan atau pengalaman menjalankan Proklim?
            Kami mengundang warga dan kader untuk berbagi melalui podcast komunitas ini.
          </p>
          <a
            href="/about"
            className="inline-block bg-white text-green-800 font-semibold px-6 py-2.5 rounded-lg hover:bg-green-50 transition-colors"
          >
            Hubungi Pengurus RW
          </a>
        </div>
      </div>
    </div>
  );
}
