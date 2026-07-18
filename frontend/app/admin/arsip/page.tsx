"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, X, FileText, Image, BookOpen, Download } from "lucide-react";
import { api, type ArsipItem } from "@/lib/api";
import { toast } from "sonner";

const TYPE_LABELS: Record<ArsipItem["type"], string> = { foto: "Foto", laporan: "Laporan PDF", catatan: "Catatan" };
const TYPE_COLORS: Record<ArsipItem["type"], string> = { foto: "bg-green-100 text-green-700", laporan: "bg-red-100 text-red-700", catatan: "bg-gray-100 text-gray-700" };
const TYPE_ICONS: Record<ArsipItem["type"], typeof Image> = { foto: Image, laporan: FileText, catatan: BookOpen };

function Modal({ item, onClose, onSave }: {
  item: Partial<ArsipItem> | null;
  onClose: () => void;
  onSave: (item: ArsipItem) => void;
}) {
  const [form, setForm] = useState<Partial<ArsipItem>>(item ?? {
    title: "", description: "", date: new Date().toISOString().split("T")[0],
    category: "Adaptasi", type: "foto", kegiatan: "", tags: [],
    images: [], fileName: "", fileSize: "", fileUrl: "#",
  });
  const set = (k: keyof ArsipItem, v: any) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-bold text-gray-900" style={{ fontFamily: "var(--font-serif)" }}>
            {form.id ? "Edit Arsip" : "Tambah Arsip"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Judul Dokumen *</label>
            <input value={form.title || ""} onChange={e => set("title", e.target.value)} placeholder="Masukkan judul…" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Jenis</label>
              <select value={form.type} onChange={e => set("type", e.target.value as ArsipItem["type"])} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                <option value="foto">Foto Dokumentasi</option>
                <option value="laporan">Laporan PDF</option>
                <option value="catatan">Catatan Kegiatan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Program</label>
              <select value={form.category} onChange={e => set("category", e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                <option>Adaptasi</option>
                <option>Mitigasi</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tanggal</label>
              <input type="date" value={form.date || ""} onChange={e => set("date", e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Kegiatan</label>
              <input value={form.kegiatan || ""} onChange={e => set("kegiatan", e.target.value)} placeholder="Nama kegiatan" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Deskripsi</label>
            <textarea value={form.description || ""} onChange={e => set("description", e.target.value)} rows={3} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none placeholder:text-gray-400" placeholder="Deskripsi singkat…" />
          </div>
          {(form.type === "laporan" || form.type === "catatan") && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nama File</label>
              <input value={form.fileName || ""} onChange={e => set("fileName", e.target.value)} placeholder="NamaFile.pdf" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400" />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tags (pisahkan koma)</label>
            <input
              value={(form.tags || []).join(", ")}
              onChange={e => set("tags", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
              placeholder="Proklim, Gotong Royong"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">Batal</button>
          <button
            onClick={() => form.title && onSave({ id: form.id ?? String(Date.now()), title: form.title!, description: form.description || "", date: form.date!, category: form.category!, type: form.type!, kegiatan: form.kegiatan!, tags: form.tags || [], images: form.images, fileName: form.fileName, fileSize: form.fileSize, fileUrl: form.fileUrl })}
            disabled={!form.title}
            className="px-5 py-2 text-sm font-semibold bg-green-700 hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl transition-colors"
          >
            {form.id ? "Simpan" : "Tambah"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminArsip() {
  const [items, setItems] = useState<ArsipItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"Semua" | ArsipItem["type"]>("Semua");
  const [modal, setModal] = useState<Partial<ArsipItem> | null | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await api.getArchives();
        setItems(res);
      } catch (err) {
        console.error("Gagal memuat arsip:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = items.filter(i => {
    const matchQ = !search || i.title.toLowerCase().includes(search.toLowerCase());
    const matchT = filterType === "Semua" || i.type === filterType;
    return matchQ && matchT;
  });

  const handleSave = async (item: ArsipItem) => {
    try {
      const files: any[] = [];
      if (item.fileUrl && item.fileUrl !== "#") {
        files.push({
          file_url: item.fileUrl,
          file_name: item.fileName || "Dokumen Arsip",
          file_type: item.type === "foto" ? "image" : "document"
        });
      }
      if (item.images && item.images.length > 0) {
        item.images.forEach(img => {
          files.push({
            file_url: img,
            file_name: "Gambar Dokumentasi",
            file_type: "image"
          });
        });
      }

      const payload = {
        title: item.title,
        description: item.description,
        doc_type: item.type,
        program_type: item.category,
        activity_date: item.date ? new Date(item.date).toISOString() : new Date().toISOString(),
        files
      };

      const exists = items.some(i => i.id === item.id);
      if (exists) {
        const updated = await api.admin.updateArchive(item.id, payload);
        setItems(prev => prev.map(i => i.id === item.id ? updated : i));
        toast.success("Arsip berhasil diperbarui!");
      } else {
        const created = await api.admin.createArchive(payload);
        setItems(prev => [created, ...prev]);
        toast.success("Arsip berhasil ditambahkan!");
      }
      setModal(undefined);
    } catch (err) {
      console.error("Gagal menyimpan arsip:", err);
      toast.error("Gagal menyimpan arsip.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.admin.deleteArchive(id);
      setItems(prev => prev.filter(i => i.id !== id));
      setDeleteId(null);
      toast.success("Arsip berhasil dihapus!");
    } catch (err) {
      console.error("Gagal menghapus arsip:", err);
      toast.error("Gagal menghapus arsip.");
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-serif)" }}>Arsip Digital</h1>
          <p className="text-sm text-gray-500 mt-0.5">{items.length} dokumen tersimpan</p>
        </div>
        <button onClick={() => setModal(null)} className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Tambah Arsip
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari arsip…" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400" />
        </div>
        <div className="flex gap-2">
          {(["Semua", "foto", "laporan", "catatan"] as const).map(t => (
            <button key={t} onClick={() => setFilterType(t)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${filterType === t ? "bg-green-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {t === "Semua" ? "Semua" : TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="px-6 py-12 text-center text-gray-400">
              <p className="text-sm animate-pulse">Memuat data arsip...</p>
            </div>
          ) : (
            <>
              {filtered.map(item => {
                const TypeIcon = TYPE_ICONS[item.type];
                return (
                  <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${TYPE_COLORS[item.type]}`}>
                      <TypeIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLORS[item.type]}`}>{TYPE_LABELS[item.type]}</span>
                        <span className="text-xs text-gray-400">{item.kegiatan}</span>
                        <span className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                    </div>
                    {item.fileUrl && (
                      <a href={item.fileUrl} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Unduh">
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                    <button onClick={() => setModal(item)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="px-6 py-12 text-center text-gray-400">
                  <Archive className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Tidak ada arsip ditemukan.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {modal !== undefined && <Modal item={modal} onClose={() => setModal(undefined)} onSave={handleSave} />}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-serif)" }}>Hapus Arsip?</h3>
            <p className="text-sm text-gray-500 mb-6">Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Batal</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Archive(props: any) { return <FileText {...props} />; }
