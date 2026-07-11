"use client";

import { useState } from "react";
import { Plus, Search, Pencil, Trash2, X, Headphones, Clock, User } from "lucide-react";
import { podcastData as initialData, type PodcastEpisode } from "@/data/mockData";
import { FaYoutube } from "react-icons/fa";

const CATEGORIES = ["Proklim", "Pengelolaan Sampah", "Pertanian Urban", "Konservasi Air", "Kesehatan & Lingkungan", "Edukasi Iklim"];

function Modal({ item, onClose, onSave }: {
  item: Partial<PodcastEpisode> | null;
  onClose: () => void;
  onSave: (item: PodcastEpisode) => void;
}) {
  const [form, setForm] = useState<Partial<PodcastEpisode>>(item ?? {
    title: "", description: "", date: new Date().toISOString().split("T")[0],
    duration: "", host: "", category: "Proklim", platform: "youtube", embedId: "", thumbnail: "", tags: [],
  });
  const set = (k: keyof PodcastEpisode, v: any) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900" style={{ fontFamily: "var(--font-serif)" }}>
            {form.id ? "Edit Episode" : "Tambah Episode"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Judul Episode *</label>
            <input value={form.title || ""} onChange={e => set("title", e.target.value)} placeholder="Judul episode podcast…" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Platform</label>
              <select value={form.platform} onChange={e => set("platform", e.target.value as "youtube" | "spotify")} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                <option value="youtube">YouTube</option>
                <option value="spotify">Spotify</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Kategori</label>
              <select value={form.category} onChange={e => set("category", e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              {form.platform === "youtube" ? "YouTube Video ID" : "Spotify Episode ID"} *
            </label>
            <div className="relative">
              <FaYoutube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={form.embedId || ""} onChange={e => set("embedId", e.target.value)} placeholder={form.platform === "youtube" ? "dQw4w9WgXcQ" : "episode-id"} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400" />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {form.platform === "youtube" ? "ID di URL: youtube.com/watch?v=<ID>" : "ID dari link share Spotify"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Host / Narasumber</label>
              <input value={form.host || ""} onChange={e => set("host", e.target.value)} placeholder="Nama host" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Durasi</label>
              <input value={form.duration || ""} onChange={e => set("duration", e.target.value)} placeholder="32 menit" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tanggal Tayang</label>
            <input type="date" value={form.date || ""} onChange={e => set("date", e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Deskripsi</label>
            <textarea value={form.description || ""} onChange={e => set("description", e.target.value)} rows={3} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none placeholder:text-gray-400" placeholder="Deskripsi singkat episode…" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tags (pisahkan koma)</label>
            <input value={(form.tags || []).join(", ")} onChange={e => set("tags", e.target.value.split(",").map(t => t.trim()).filter(Boolean))} placeholder="Proklim, Lingkungan" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100">Batal</button>
          <button
            onClick={() => form.title && form.embedId && onSave({ id: form.id ?? String(Date.now()), title: form.title!, description: form.description || "", date: form.date!, duration: form.duration || "-", host: form.host || "-", category: form.category!, platform: form.platform!, embedId: form.embedId!, thumbnail: form.thumbnail || `https://img.youtube.com/vi/${form.embedId}/hqdefault.jpg`, tags: form.tags || [] })}
            disabled={!form.title || !form.embedId}
            className="px-5 py-2 text-sm font-semibold bg-green-700 hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl"
          >
            {form.id ? "Simpan" : "Tambah Episode"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPodcast() {
  const [items, setItems] = useState<PodcastEpisode[]>(initialData);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<Partial<PodcastEpisode> | null | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = items.filter(i => !search || i.title.toLowerCase().includes(search.toLowerCase()) || i.host.toLowerCase().includes(search.toLowerCase()));

  const handleSave = (item: PodcastEpisode) => {
    setItems(prev => prev.some(i => i.id === item.id) ? prev.map(i => i.id === item.id ? item : i) : [item, ...prev]);
    setModal(undefined);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-serif)" }}>Podcast</h1>
          <p className="text-sm text-gray-500 mt-0.5">{items.length} episode tersimpan</p>
        </div>
        <button onClick={() => setModal(null)} className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Tambah Episode
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari episode atau host…" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {filtered.map((ep, idx) => (
            <div key={ep.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {idx + 1}
              </div>
              <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={`https://img.youtube.com/vi/${ep.embedId}/default.jpg`} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <FaYoutube className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{ep.title}</p>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{ep.category}</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1"><User className="w-3 h-3" />{ep.host.split("(")[0].trim()}</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{ep.duration}</span>
                  <span className="text-xs text-gray-400">{new Date(ep.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setModal(ep)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => setDeleteId(ep.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-400">
              <Headphones className="w-8 h-8 mx-auto mb-2 opacity-40" /><p className="text-sm">Tidak ada episode ditemukan.</p>
            </div>
          )}
        </div>
      </div>

      {modal !== undefined && <Modal item={modal} onClose={() => setModal(undefined)} onSave={handleSave} />}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-serif)" }}>Hapus Episode?</h3>
            <p className="text-sm text-gray-500 mb-6">Episode akan dihapus permanen.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Batal</button>
              <button onClick={() => { setItems(p => p.filter(i => i.id !== deleteId)); setDeleteId(null); }} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
