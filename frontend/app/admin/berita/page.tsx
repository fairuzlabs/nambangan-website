"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Search, Pencil, Trash2, X, Calendar, Tag, User, Eye, Upload, ImageIcon, RotateCcw, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { api, type NewsItem } from "@/lib/api";
import { getAdminUser } from "@/lib/adminAuth";
import { toast } from "sonner";
import ImageUploadCrop from "@/components/admin/ImageUploadCrop";

// ─── Modal ───────────────────────────────────────────────────────────────────

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
  const [adminName, setAdminName] = useState("Admin RW 18");
  const [pendingImage, setPendingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const uploadTriggerRef = useRef<(() => Promise<string | null>) | null>(null);

  useEffect(() => {
    const admin = getAdminUser();
    if (admin?.display_name) {
      setAdminName(admin.display_name);
      if (!item) {
        setForm(f => ({ ...f, author: admin.display_name }));
      }
    }
  }, []);

  const set = (k: keyof NewsItem, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title || !form.content) return;
    setSaving(true);
    try {
      // If there's a pending image (selected but not yet uploaded), upload it now
      let finalImage = form.image || "";
      if (pendingImage && uploadTriggerRef.current) {
        const uploadedUrl = await uploadTriggerRef.current();
        if (uploadedUrl) {
          finalImage = uploadedUrl;
        }
      }
      onSave({
        id: form.id ?? String(Date.now()),
        title: form.title!,
        slug: form.slug || form.title!.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        excerpt: form.excerpt || form.content!.slice(0, 120) + "…",
        content: form.content!,
        category: form.category || categories[0]?.name || "Kegiatan",
        author: form.author!,
        date: form.date!,
        image: finalImage,
        createdAt: form.createdAt || new Date().toISOString(),
        updatedAt: form.updatedAt || new Date().toISOString(),
      });
    } finally {
      setSaving(false);
    }
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
            <input value={form.title || ""} onChange={e => set("title", e.target.value)} placeholder="Masukkan judul berita…"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Kategori</label>
              <select value={form.category || categories[0]?.name || "Kegiatan"} onChange={e => set("category", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white cursor-pointer">
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tanggal Terbit</label>
              <input type="date" value={form.date || ""} onChange={e => set("date", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Penulis</label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-500">
              <User className="w-4 h-4 text-gray-300 flex-shrink-0" />
              <span>{form.author || adminName}</span>
              <span className="ml-auto text-xs text-gray-400 italic">Diatur otomatis oleh sistem</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Gambar Berita</label>
            {pendingImage && (
              <div className="mb-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
                <Upload className="w-3.5 h-3.5 flex-shrink-0" />
                Gambar belum diunggah. Klik &quot;Potong &amp; Unggah&quot; atau akan otomatis diunggah saat publikasi.
              </div>
            )}
            <ImageUploadCrop
              value={form.image || ""}
              onChange={url => set("image", url)}
              onPendingChange={setPendingImage}
              onRegisterUpload={fn => { uploadTriggerRef.current = fn; }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Konten Berita *</label>
            <textarea value={form.content || ""} onChange={e => set("content", e.target.value)} rows={8} placeholder="Tulis isi berita di sini…"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400 resize-none" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} disabled={saving} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50">Batal</button>
          <button onClick={handleSave} disabled={!form.title || !form.content || saving}
            className="px-5 py-2 text-sm font-semibold bg-green-700 hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl transition-colors">
            {saving ? (pendingImage ? "Mengunggah gambar…" : "Menyimpan…") : (form.id ? "Simpan Perubahan" : "Publikasikan")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminBerita() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [newsCategories, setNewsCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("Semua");
  const [modal, setModal] = useState<Partial<NewsItem> | null | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"date" | "author" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const handleSort = (col: "date" | "author") => {
    if (sortBy === col) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortDir(col === "date" ? "desc" : "asc");
    }
  };

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [newsRes, catsRes] = await Promise.all([api.admin.getNews({ limit: 100 }), api.getNewsCategories()]);
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
  const filtered = [...items.filter(i => {
    const matchQ = !search || i.title.toLowerCase().includes(search.toLowerCase());
    const matchC = filterCat === "Semua" || i.category === filterCat;
    return matchQ && matchC;
  })].sort((a, b) => {
    if (!sortBy) return 0; // preserve backend order (newest created first)
    if (sortBy === "date") {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      const diff = sortDir === "asc" ? da - db : db - da;
      if (diff !== 0) return diff;
      // Tiebreaker: most recently modified, then created
      const udiff = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (udiff !== 0) return udiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "author") {
      const cmp = a.author.localeCompare(b.author, "id");
      return sortDir === "asc" ? cmp : -cmp;
    }
    return 0;
  });

  const SortIcon = ({ col }: { col: "date" | "author" }) => {
    if (sortBy !== col) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  };

  const handleSave = async (item: NewsItem) => {
    try {
      const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const catObj = newsCategories.find(c => c.name === item.category);
      // Use UTC midnight (Z suffix) to avoid timezone shift — without Z, local WIB (UTC+7)
      // would convert "2026-07-16T00:00:00" → "2026-07-15T17:00:00Z", saving one day behind.
      const publishedAt = item.date ? new Date(item.date + "T00:00:00Z").toISOString() : new Date().toISOString();
      const payload = { title: item.title, slug, excerpt: item.excerpt, content: item.content, image_url: item.image, category_id: catObj?.id, status: "published", published_at: publishedAt };
      const exists = items.some(i => i.id === item.id);
      if (exists) {
        const updated = await api.admin.updateNews(item.id, payload);
        setItems(prev => prev.map(i => i.id === item.id ? updated : i));
        toast.success("Berita berhasil diperbarui!");
      } else {
        const created = await api.admin.createNews(payload);
        setItems(prev => [created, ...prev]);
        toast.success("Berita berhasil dipublikasikan!");
      }
      setModal(undefined);
    } catch (err) {
      console.error("Gagal menyimpan berita:", err);
      toast.error("Gagal menyimpan berita. Silakan coba lagi.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.admin.deleteNews(id);
      setItems(prev => prev.filter(i => i.id !== id));
      setDeleteId(null);
      toast.success("Berita berhasil dihapus!");
    } catch (err) {
      console.error("Gagal menghapus berita:", err);
      toast.error("Gagal menghapus berita.");
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-serif)" }}>Berita &amp; Info</h1>
          <p className="text-sm text-gray-500 mt-0.5">{items.length} artikel tersimpan</p>
        </div>
        <button onClick={() => setModal(null)} className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Tulis Berita
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari berita…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(c => (
              <button key={c} onClick={() => setFilterCat(c)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${filterCat === c ? "bg-green-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_120px_140px_120px_100px] gap-4 px-6 py-3 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
          <span>Judul</span>
          <span>Kategori</span>
          <button onClick={() => handleSort("date")} className={`flex items-center gap-1.5 hover:text-gray-700 transition-colors cursor-pointer ${sortBy === "date" ? "text-green-700" : ""}`}>
            Tanggal <SortIcon col="date" />
          </button>
          <button onClick={() => handleSort("author")} className={`flex items-center gap-1.5 hover:text-gray-700 transition-colors cursor-pointer ${sortBy === "author" ? "text-green-700" : ""}`}>
            Penulis <SortIcon col="author" />
          </button>
          <span className="text-right">Aksi</span>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="px-6 py-12 text-center text-gray-400"><p className="text-sm animate-pulse">Memuat data berita...</p></div>
          ) : (
            <>
              {filtered.map(item => (
                <div key={item.id} className="grid grid-cols-1 sm:grid-cols-[1fr_120px_140px_120px_100px] gap-3 sm:gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors items-center">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-4 h-4 text-gray-300" /></div>}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{item.excerpt}</p>
                    </div>
                  </div>
                  <div><span className="text-xs font-medium bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full">{item.category}</span></div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5 text-gray-300" />
                    {new Date(item.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
                    <User className="w-3.5 h-3.5 text-gray-300" />
                    <span className="truncate">{item.author}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <a href={`/news/${item.slug}`} target="_blank" rel="noopener noreferrer" title="Lihat" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Eye className="w-4 h-4" /></a>
                    <button onClick={() => setModal(item)} title="Edit" className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(item.id)} title="Hapus" className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
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

      {modal !== undefined && <Modal item={modal} onClose={() => setModal(undefined)} onSave={handleSave} categories={newsCategories} />}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-serif)" }}>Hapus Berita?</h3>
            <p className="text-sm text-gray-500 mb-6">Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Batal</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
