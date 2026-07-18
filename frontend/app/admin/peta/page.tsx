"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Search, Pencil, Trash2, X, Leaf, ShoppingBag, Music, MapPin, Phone, Upload } from "lucide-react";
import { api, type ProklimLocation, type UMKMProduct, type KesenianLocation } from "@/lib/api";
import { toast } from "sonner";
import ImageUploadCrop from "@/components/admin/ImageUploadCrop";
import MapPicker from "@/components/admin/MapPicker";

type LocType = "proklim" | "umkm" | "kesenian";

const TYPE_META: Record<LocType, { label: string; color: string; bg: string; icon: typeof Leaf }> = {
  proklim:  { label: "Proklim",  color: "bg-green-100 text-green-700", bg: "bg-green-700", icon: Leaf },
  umkm:     { label: "UMKM",     color: "bg-red-100 text-red-700",     bg: "bg-red-500",   icon: ShoppingBag },
  kesenian: { label: "Kesenian", color: "bg-amber-100 text-amber-700", bg: "bg-amber-500", icon: Music },
};

type AnyLoc = (ProklimLocation & { locType: "proklim" }) | (UMKMProduct & { locType: "umkm" }) | (KesenianLocation & { locType: "kesenian" });

function EditModal({
  item,
  categoriesList,
  onClose,
  onSave
}: {
  item: AnyLoc;
  categoriesList: any[];
  onClose: () => void;
  onSave: (item: AnyLoc) => void;
}) {
  const [form, setForm] = useState<AnyLoc>({ ...item });
  const [pendingImage, setPendingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const uploadTriggerRef = useRef<(() => Promise<string | null>) | null>(null);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name) {
      toast.error("Nama lokasi harus diisi.");
      return;
    }
    setSaving(true);
    try {
      let finalImage = form.image || "";
      if (pendingImage && uploadTriggerRef.current) {
        const uploadedUrl = await uploadTriggerRef.current();
        if (uploadedUrl) {
          finalImage = uploadedUrl;
        }
      }
      onSave({
        ...form,
        image: finalImage,
      });
    } catch (err: any) {
      console.error("Gagal mengupload gambar:", err);
      toast.error("Gagal mengunggah gambar. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-bold text-gray-900" style={{ fontFamily: "var(--font-serif)" }}>
            {item.id ? "Edit Lokasi" : "Tambah Lokasi Baru"}
          </h2>
          <button onClick={onClose} disabled={saving} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-5 h-5" /></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nama Lokasi</label>
            <input
              value={form.name || ""}
              onChange={e => set("name", e.target.value)}
              placeholder="Masukkan nama lokasi…"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Kategori Utama</label>
            <select
              value={form.locType}
              onChange={e => {
                const type = e.target.value as LocType;
                const matchingCat = categoriesList.find(c => c.slug === type);
                setForm(f => ({
                  ...f,
                  locType: type,
                  category: matchingCat ? matchingCat.name : type === "proklim" ? "Proklim" : type === "umkm" ? "UMKM" : "Kesenian",
                } as any));
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white cursor-pointer"
            >
              <option value="umkm">UMKM</option>
              <option value="proklim">Proklim (Program Kampung Iklim)</option>
              <option value="kesenian">Kesenian & Budaya</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Deskripsi</label>
            <textarea
              value={form.description || ""}
              onChange={e => set("description", e.target.value)}
              rows={3}
              placeholder="Deskripsi singkat lokasi..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          {/* Conditional fields based on Category */}
          {form.locType === "umkm" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Range Harga (e.g. Rp 10.000 - Rp 50.000)</label>
                <input
                  value={(form as any).price || ""}
                  onChange={e => set("price", e.target.value)}
                  placeholder="e.g. Rp 15.000 atau Rp 10.000 - Rp 50.000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nama Penjual</label>
                  <input
                    value={(form as any).seller || ""}
                    onChange={e => set("seller", e.target.value)}
                    placeholder="Nama pemilik UMKM"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nomor Kontak Penjual</label>
                  <input
                    value={(form as any).contact || ""}
                    onChange={e => set("contact", e.target.value)}
                    placeholder="e.g. 08123456789"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </>
          )}

          {form.locType === "kesenian" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Jadwal Latihan/Pertunjukan</label>
                <input
                  value={(form as any).schedule || ""}
                  onChange={e => set("schedule", e.target.value)}
                  placeholder="e.g. Setiap Sabtu 19:00"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nomor Kontak Pengurus</label>
                <input
                  value={(form as any).contact || ""}
                  onChange={e => set("contact", e.target.value)}
                  placeholder="e.g. 08123456789"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          )}

          {form.locType === "proklim" && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Kegiatan (Pisahkan dengan koma)</label>
              <input
                value={(form as any).activities ? (form as any).activities.join(", ") : ""}
                onChange={e => set("activities", e.target.value.split(",").map((s: string) => s.trim()))}
                placeholder="e.g. Pengelolaan Sampah, Penghijauan Mandiri"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          {/* Image cropper component */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Gambar Lokasi</label>
            {pendingImage && (
              <div className="mb-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
                <Upload className="w-3.5 h-3.5 flex-shrink-0" />
                Gambar belum diunggah. Klik &quot;Potong &amp; Unggah&quot; atau akan otomatis diunggah saat menyimpan.
              </div>
            )}
            <ImageUploadCrop
              value={form.image || ""}
              onChange={url => set("image", url)}
              onPendingChange={setPendingImage}
              onRegisterUpload={fn => { uploadTriggerRef.current = fn; }}
            />
          </div>

          {/* Coordinates inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Latitude</label>
              <input
                type="number"
                step="any"
                value={form.lat || ""}
                onChange={e => set("lat", parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Longitude</label>
              <input
                type="number"
                step="any"
                value={form.lng || ""}
                onChange={e => set("lng", parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* SSR-safe leaflet coordinates picker */}
          <MapPicker
            lat={Number(form.lat) || -7.4705}
            lng={Number(form.lng) || 110.2180}
            onChange={(lat, lng) => {
              set("lat", lat);
              set("lng", lng);
            }}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose} disabled={saving} className="px-4 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 disabled:opacity-50">Batal</button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2 text-sm font-semibold bg-green-700 hover:bg-green-600 text-white rounded-xl disabled:opacity-50">
            {saving ? (pendingImage ? "Mengunggah gambar…" : "Menyimpan…") : (item.id ? "Simpan Perubahan" : "Tambah Lokasi")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPeta() {
  const [items, setItems] = useState<AnyLoc[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<LocType | "semua">("semua");
  const [editing, setEditing] = useState<AnyLoc | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: LocType } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [pts, cats] = await Promise.all([
          api.admin.getMapPoints(),
          api.getMapCategories()
        ]);
        setItems(pts);
        setCategoriesList(cats);
      } catch (err) {
        console.error("Gagal memuat peta:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const countProklim = items.filter(i => i.locType === "proklim").length;
  const countUmkm = items.filter(i => i.locType === "umkm").length;
  const countKesenian = items.filter(i => i.locType === "kesenian").length;

  const allItems = items;

  const filtered = allItems.filter(item => {
    const matchQ = !search || (item as any).name.toLowerCase().includes(search.toLowerCase());
    const matchT = filterType === "semua" || item.locType === filterType;
    return matchQ && matchT;
  });

  const handleSave = async (updated: AnyLoc) => {
    try {
      const catObj = categoriesList.find(c => c.slug === updated.locType);
      
      const payload: any = {
        name: updated.name,
        category_id: catObj?.id || updated.category,
        description: updated.description,
        latitude: updated.lat,
        longitude: updated.lng,
        address: "RW 18 Nambangan",
        image_url: updated.image || "",
        is_active: true
      };

      if (updated.locType === "umkm") {
        // Parse minimum price from the range input for the numeric decimal column
        const priceStr = String((updated as any).price || "");
        const firstPart = priceStr.split("-")[0].trim();
        const numericOnly = firstPart.replace(/[^0-9]/g, "");
        payload.price = parseFloat(numericOnly) || 0;

        payload.subtitle = (updated as any).price || "";
        payload.contact_phone = (updated as any).contact || "";
        payload.owner_name = (updated as any).seller || "";
      } else if (updated.locType === "kesenian") {
        payload.subtitle = (updated as any).schedule || "";
        payload.contact_phone = (updated as any).contact || "";
      } else if (updated.locType === "proklim") {
        payload.subtitle = (updated as any).activities ? (updated as any).activities.join(", ") : "";
      }

      const exists = items.some(i => i.id === updated.id);
      if (exists) {
        const saved = await api.admin.updateMapPoint(updated.id, payload);
        setItems(prev => prev.map(i => i.id === updated.id ? saved : i));
        toast.success("Lokasi peta berhasil diperbarui!");
      } else {
        const saved = await api.admin.createMapPoint(payload);
        setItems(prev => [saved, ...prev]);
        toast.success("Lokasi peta baru berhasil ditambahkan!");
      }
      setEditing(null);
    } catch (err) {
      console.error("Gagal menyimpan lokasi:", err);
      toast.error("Gagal menyimpan lokasi.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.admin.deleteMapPoint(deleteTarget.id);
      setItems(prev => prev.filter(i => i.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("Lokasi peta berhasil dihapus!");
    } catch (err) {
      console.error("Gagal menghapus lokasi:", err);
      toast.error("Gagal menghapus lokasi.");
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-serif)" }}>Peta & Lokasi</h1>
          <p className="text-sm text-gray-500 mt-0.5">{allItems.length} lokasi terdaftar</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditing({
              id: "",
              name: "",
              description: "",
              category: "UMKM",
              locType: "umkm",
              lat: -7.48333288952336,
              lng: 110.23033883249016,
              image: "",
              price: "",
              seller: "",
              contact: ""
            } as any)}
            className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Tambah Lokasi
          </button>
          <a href="/peta" target="_blank" className="inline-flex items-center gap-2 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
            <MapPin className="w-4 h-4" /> Lihat Peta
          </a>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {(["proklim","umkm","kesenian"] as LocType[]).map(t => {
          const meta = TYPE_META[t];
          const Icon = meta.icon;
          const count = t === "proklim" ? countProklim : t === "umkm" ? countUmkm : countKesenian;
          return (
            <button key={t} onClick={() => setFilterType(filterType === t ? "semua" : t)} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${filterType === t ? "border-gray-900 bg-white shadow-md" : "border-gray-100 bg-white hover:border-gray-200"}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${meta.bg}`}><Icon className="w-4.5 h-4.5 text-white" /></div>
              <div className="text-left">
                <div className="font-bold text-gray-900 text-xl">{loading ? "..." : count}</div>
                <div className="text-xs text-gray-500">{meta.label}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama lokasi…" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="px-6 py-12 text-center text-gray-400">
              <p className="text-sm animate-pulse">Memuat data lokasi...</p>
            </div>
          ) : (
            <>
              {filtered.map(item => {
                const meta = TYPE_META[item.locType];
                const Icon = meta.icon;
                return (
                  <div key={`${item.locType}-${item.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.bg}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{(item as any).name}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${meta.color}`}>{meta.label}</span>
                        <span className="text-xs text-gray-400">{(item as any).category}</span>
                        {item.locType === "umkm" && (
                          <span className="text-xs text-green-700 font-medium">{(item as any).price}</span>
                        )}
                        {item.locType === "kesenian" && (item as any).contact && (
                          <span className="text-xs text-gray-400 flex items-center gap-1"><Phone className="w-3 h-3" />{(item as any).contact}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 hidden sm:block tabular-nums">
                      {((item as any).lat as number)?.toFixed(4)}, {((item as any).lng as number)?.toFixed(4)}
                    </div>
                    <button onClick={() => setEditing(item)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteTarget({ id: item.id, type: item.locType })} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="px-6 py-12 text-center text-gray-400">
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-40" /><p className="text-sm">Tidak ada lokasi ditemukan.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {editing && <EditModal item={editing} categoriesList={categoriesList} onClose={() => setEditing(null)} onSave={handleSave} />}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-serif)" }}>Hapus Lokasi?</h3>
            <p className="text-sm text-gray-500 mb-6">Marker akan dihapus dari peta.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Batal</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
