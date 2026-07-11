"use client";

import { useState } from "react";
import { Plus, Search, Pencil, Trash2, X, Leaf, ShoppingBag, Music, MapPin, Phone } from "lucide-react";
import { proklimData as initProklim, umkmData as initUmkm, kesenianData as initKesenian } from "@/data/mockData";
import type { ProklimLocation, UMKMProduct, KesenianLocation } from "@/data/mockData";

type LocType = "proklim" | "umkm" | "kesenian";

const TYPE_META: Record<LocType, { label: string; color: string; bg: string; icon: typeof Leaf }> = {
  proklim:  { label: "Proklim",  color: "bg-green-100 text-green-700", bg: "bg-green-700", icon: Leaf },
  umkm:     { label: "UMKM",     color: "bg-red-100 text-red-700",     bg: "bg-red-500",   icon: ShoppingBag },
  kesenian: { label: "Kesenian", color: "bg-amber-100 text-amber-700", bg: "bg-amber-500", icon: Music },
};

type AnyLoc = (ProklimLocation & { locType: "proklim" }) | (UMKMProduct & { locType: "umkm" }) | (KesenianLocation & { locType: "kesenian" });

function EditModal({ item, onClose, onSave }: { item: AnyLoc; onClose: () => void; onSave: (item: AnyLoc) => void }) {
  const [form, setForm] = useState<AnyLoc>({ ...item });
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900" style={{ fontFamily: "var(--font-serif)" }}>Edit Lokasi</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nama Lokasi</label>
            <input value={(form as any).name || ""} onChange={e => set("name", e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Deskripsi</label>
            <textarea value={(form as any).description || ""} onChange={e => set("description", e.target.value)} rows={3} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Latitude</label>
              <input type="number" step="0.0001" value={(form as any).lat || ""} onChange={e => set("lat", parseFloat(e.target.value))} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Longitude</label>
              <input type="number" step="0.0001" value={(form as any).lng || ""} onChange={e => set("lng", parseFloat(e.target.value))} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Kategori</label>
            <input value={(form as any).category || ""} onChange={e => set("category", e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          {form.locType === "umkm" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Harga</label>
                <input value={(form as any).price || ""} onChange={e => set("price", e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Penjual</label>
                <input value={(form as any).seller || ""} onChange={e => set("seller", e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </>
          )}
          {form.locType === "kesenian" && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Jadwal</label>
              <input value={(form as any).schedule || ""} onChange={e => set("schedule", e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100">Batal</button>
          <button onClick={() => onSave(form)} className="px-5 py-2 text-sm font-semibold bg-green-700 hover:bg-green-600 text-white rounded-xl">Simpan</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPeta() {
  const [proklim, setProklim] = useState(initProklim);
  const [umkm, setUmkm] = useState(initUmkm);
  const [kesenian, setKesenian] = useState(initKesenian);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<LocType | "semua">("semua");
  const [editing, setEditing] = useState<AnyLoc | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: LocType } | null>(null);

  const allItems: AnyLoc[] = [
    ...proklim.map(d => ({ ...d, locType: "proklim" as const })),
    ...umkm.map(d => ({ ...d, locType: "umkm" as const })),
    ...kesenian.map(d => ({ ...d, locType: "kesenian" as const })),
  ];

  const filtered = allItems.filter(item => {
    const matchQ = !search || (item as any).name.toLowerCase().includes(search.toLowerCase());
    const matchT = filterType === "semua" || item.locType === filterType;
    return matchQ && matchT;
  });

  const handleSave = (updated: AnyLoc) => {
    if (updated.locType === "proklim") setProklim(p => p.map(i => i.id === updated.id ? (updated as ProklimLocation) : i));
    if (updated.locType === "umkm")    setUmkm(p => p.map(i => i.id === updated.id ? (updated as UMKMProduct) : i));
    if (updated.locType === "kesenian") setKesenian(p => p.map(i => i.id === updated.id ? (updated as KesenianLocation) : i));
    setEditing(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "proklim") setProklim(p => p.filter(i => i.id !== deleteTarget.id));
    if (deleteTarget.type === "umkm")    setUmkm(p => p.filter(i => i.id !== deleteTarget.id));
    if (deleteTarget.type === "kesenian") setKesenian(p => p.filter(i => i.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-serif)" }}>Peta & Lokasi</h1>
          <p className="text-sm text-gray-500 mt-0.5">{allItems.length} lokasi terdaftar</p>
        </div>
        <a href="/peta" target="_blank" className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
          <MapPin className="w-4 h-4" /> Lihat Peta
        </a>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {(["proklim","umkm","kesenian"] as LocType[]).map(t => {
          const meta = TYPE_META[t];
          const Icon = meta.icon;
          const count = t === "proklim" ? proklim.length : t === "umkm" ? umkm.length : kesenian.length;
          return (
            <button key={t} onClick={() => setFilterType(filterType === t ? "semua" : t)} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${filterType === t ? "border-gray-900 bg-white shadow-md" : "border-gray-100 bg-white hover:border-gray-200"}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${meta.bg}`}><Icon className="w-4.5 h-4.5 text-white" /></div>
              <div className="text-left">
                <div className="font-bold text-gray-900 text-xl">{count}</div>
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
        </div>
      </div>

      {editing && <EditModal item={editing} onClose={() => setEditing(null)} onSave={handleSave} />}
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
