"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, X, Calendar, Tag, User, Eye } from "lucide-react";
import { api, type NewsItem } from "@/lib/api";

function Modal({ item, onClose, onSave, categories }: {
  item: Partial<NewsItem> | null;
  onClose: () => void;
  onSave: (item: NewsItem) => void;
  categories: any[];
}) {
  const [form, setForm] = useState<Partial<NewsItem>>(item ?? {
    title: "", excerpt: "", content: "", category: categories[0]?.name || "Kegiatan",
    author: "Admin RW 18", date: new Date().toISOString().split("T")[0], image: ""
  });

  const set = (k: keyof NewsItem, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.title || !form.content) return;
    onSave({
      id: form.id ?? String(Date.now()),
      title: form.title!,
      slug: form.slug || form.title!.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      excerpt: form.excerpt || form.content!.slice(0, 120) + "…",
      content: form.content!,
      category: form.category || categories[0]?.name || "Kegiatan",
      author: form.author!,
      date: form.date!,
      image: form.image || "https://images.unsplash.com/photo-1533734635438-fa92e72a1f0e?w=800&q=80",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900" style={{ fontFamily: "var(--font-serif)" }}>
            {form.id ? "Edit Berita" : "Tulis Berita Baru"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Judul Berita *</label>
            <input
              value={form.title || ""}
              onChange={e => set("title", e.target.value)}
              placeholder="Masukkan judul berita…"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Kategori</label>
              <select
                value={form.category || categories[0]?.name || "Kegiatan"}
                onChange={e => set("category", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white cursor-pointer"
              >
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tanggal Terbit</label>
              <input
                type="date"
                value={form.date || ""}
                onChange={e => set("date", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Penulis</label>
            <input
              value={form.author || ""}
              onChange={e => set("author", e.target.value)}
              placeholder="Nama penulis"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">URL Gambar</label>
            <input
              value={form.image || ""}
              onChange={e => set("image", e.target.value)}
              placeholder="https://images.unsplash.com/…"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Konten Berita *</label>
            <textarea
              value={form.content || ""}
              onChange={e => set("content", e.target.value)}
              rows={8}
              placeholder="Tulis isi berita di sini…"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400 resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition-colors">
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={!form.title || !form.content}
            className="px-5 py-2 text-sm font-semibold bg-green-700 hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl transition-colors"
          >
            {form.id ? "Simpan Perubahan" : "Publikasikan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminBerita() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [newsCategories, setNewsCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("Semua");
  const [modal, setModal] = useState<Partial<NewsItem> | null | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [newsRes, catsRes] = await Promise.all([
          api.admin.getNews({ limit: 100 }),
          api.getNewsCategories()
        ]);
        setItems(newsRes.data);
        setNewsCategories(catsRes);
      } catch (err) {
        console.error("Gagal memuat berita:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = ["Semua", ...newsCategories.map(c => c.name)];

  const filtered = items.filter(i => {
    const matchQ = !search || i.title.toLowerCase().includes(search.toLowerCase());
    const matchC = filterCat === "Semua" || i.category === filterCat;
    return matchQ && matchC;
  });

  const handleSave = async (item: NewsItem) => {
    try {
      const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const catObj = newsCategories.find(c => c.name === item.category);
      const payload = {
        title: item.title,
        slug,
        excerpt: item.excerpt,
        content: item.content,
        image_url: item.image,
        category_id: catObj?.id,
        status: "published"
      };

      const exists = items.some(i => i.id === item.id);
      if (exists) {
        const updated = await api.admin.updateNews(item.id, payload);
        setItems(prev => prev.map(i => i.id === item.id ? updated : i));
      } else {
        const created = await api.admin.createNews(payload);
        setItems(prev => [created, ...prev]);
      }
      setModal(undefined);
    } catch (err) {
      console.error("Gagal menyimpan berita:", err);
      alert("Gagal menyimpan berita. Silakan coba lagi.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.admin.deleteNews(id);
      setItems(prev => prev.filter(i => i.id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error("Gagal menghapus berita:", err);
      alert("Gagal menghapus berita.");
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-serif)" }}>Berita & Info</h1>
          <p className="text-sm text-gray-500 mt-0.5">{items.length} artikel tersimpan</p>
        </div>
        <button
          onClick={() => setModal(null)}
          className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Tulis Berita
        </button>
      </div>

      {/* Search & filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari berita…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setFilterCat(c)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${filterCat === c ? "bg-green-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_140px_140px_80px_100px] gap-4 px-6 py-3 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
          <span>Judul</span><span>Kategori</span><span>Tanggal</span><span>Penulis</span><span className="text-right">Aksi</span>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="px-6 py-12 text-center text-gray-400">
              <p className="text-sm animate-pulse">Memuat data berita...</p>
            </div>
          ) : (
            <>
              {filtered.map(item => (
                <div key={item.id} className="grid grid-cols-1 sm:grid-cols-[1fr_140px_140px_80px_100px] gap-3 sm:gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors items-center">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{item.excerpt}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-medium bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5 text-gray-300" />
                    {new Date(item.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <User className="w-3.5 h-3.5 text-gray-300" />
                    <span className="truncate">{item.author.split(" ").slice(-1)[0]}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <a
                      href={`/news/${item.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Lihat"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => setModal(item)}
                      title="Edit"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      title="Hapus"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="px-6 py-12 text-center text-gray-400">
                  <Tag className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Tidak ada berita ditemukan.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add/Edit modal */}
      {modal !== undefined && (
        <Modal item={modal} onClose={() => setModal(undefined)} onSave={handleSave} categories={newsCategories} />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-serif)" }}>Hapus Berita?</h3>
            <p className="text-sm text-gray-500 mb-6">Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
