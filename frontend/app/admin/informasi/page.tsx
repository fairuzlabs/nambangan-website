"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Leaf,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  Loader2
} from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { api } from "@/lib/api";
import { toast } from "sonner";

const INITIAL = {
  namaRW: "RW 18 Nambangan",
  kelurahan: "Rejowinangun Utara",
  kecamatan: "Magelang Tengah",
  kota: "Kota Magelang",
  provinsi: "Jawa Tengah",
  ketua: "Bapak Suryanto",
  phone: "(0293) 123-4567",
  email: "rw18nambangan@gmail.com",
  alamat: "Nambangan, Rejowinangun Utara, Kota Magelang, Jawa Tengah",
  visi: "Mewujudkan RW 18 Nambangan sebagai kawasan yang bersih, hijau, dan sejahtera melalui semangat gotong royong dan program lingkungan berkelanjutan.",
  misi: "Mengelola lingkungan berbasis masyarakat\nMengembangkan ekonomi warga melalui UMKM\nMelestarikan budaya dan kesenian lokal\nMewujudkan Kampung Iklim mandiri",
  facebook: "#",
  instagram: "#",
  youtube: "#",
  proklimStatus: "Aktif",
  proklimTahun: "2024",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-900 text-sm" style={{ fontFamily: "var(--font-serif)" }}>{title}</h2>
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export default function AdminInformasi() {
  const [form, setForm] = useState(INITIAL);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [members, setMembers] = useState({
    ketuaRW: "",
    ketuaProklim: "",
    ketuaKarangTaruna: ""
  });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getOrganizationMembers();
        const rw = res.find((m: any) => m.position === "Ketua RW")?.name || "";
        const proklim = res.find((m: any) => m.position === "Ketua Proklim")?.name || "";
        const kt = res.find((m: any) => m.position === "Ketua Karang Taruna")?.name || "";
        setMembers({ ketuaRW: rw, ketuaProklim: proklim, ketuaKarangTaruna: kt });
      } catch (err) {
        console.error("Gagal mengambil struktur organisasi:", err);
        toast.error("Gagal mengambil data struktur organisasi");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const set = (k: keyof typeof INITIAL, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.admin.updateOrganizationMembers([
        { position: "Ketua RW", name: members.ketuaRW },
        { position: "Ketua Proklim", name: members.ketuaProklim },
        { position: "Ketua Karang Taruna", name: members.ketuaKarangTaruna }
      ]);
      setSaved(true);
      toast.success("Perubahan berhasil disimpan!");
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400 bg-white";

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-green-700 animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Memuat informasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-serif)" }}>Informasi RW</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kelola informasi umum dan kontak RW 18</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading || saving}
          className={`inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm ${saved ? "bg-green-500" : "bg-green-700 hover:bg-green-600"} disabled:opacity-50`}
        >
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : saved ? <><CheckCircle className="w-4 h-4" /> Tersimpan!</> : <><Save className="w-4 h-4" /> Simpan Perubahan</>}
        </button>
      </div>

      {/* Identitas RW */}
      <Section title="Identitas RW">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nama RW">
            <input value={form.namaRW} onChange={e => set("namaRW", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Ketua RW">
            <input value={form.ketua} onChange={e => set("ketua", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Kelurahan">
            <input value={form.kelurahan} onChange={e => set("kelurahan", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Kecamatan">
            <input value={form.kecamatan} onChange={e => set("kecamatan", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Kota">
            <input value={form.kota} onChange={e => set("kota", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Provinsi">
            <input value={form.provinsi} onChange={e => set("provinsi", e.target.value)} className={inputCls} />
          </Field>
        </div>
        <Field label="Alamat Lengkap">
          <textarea value={form.alamat} onChange={e => set("alamat", e.target.value)} rows={2} className={`${inputCls} resize-none`} />
        </Field>
      </Section>

      {/* Struktur Organisasi */}
      <Section title="Struktur Organisasi">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Ketua RW">
            <input
              value={members.ketuaRW}
              onChange={e => setMembers(prev => ({ ...prev, ketuaRW: e.target.value }))}
              className={inputCls}
              placeholder="Nama Ketua RW"
            />
          </Field>
          <Field label="Ketua Proklim">
            <input
              value={members.ketuaProklim}
              onChange={e => setMembers(prev => ({ ...prev, ketuaProklim: e.target.value }))}
              className={inputCls}
              placeholder="Nama Ketua Proklim"
            />
          </Field>
          <Field label="Ketua Karang Taruna">
            <input
              value={members.ketuaKarangTaruna}
              onChange={e => setMembers(prev => ({ ...prev, ketuaKarangTaruna: e.target.value }))}
              className={inputCls}
              placeholder="Nama Ketua Karang Taruna"
            />
          </Field>
        </div>
      </Section>

      {/* Visi & Misi */}
      <Section title="Visi & Misi">
        <Field label="Visi">
          <textarea value={form.visi} onChange={e => set("visi", e.target.value)} rows={3} className={`${inputCls} resize-none`} />
        </Field>
        <Field label="Misi (satu per baris)">
          <textarea value={form.misi} onChange={e => set("misi", e.target.value)} rows={5} className={`${inputCls} resize-none`} />
        </Field>
      </Section>

      {/* Proklim */}
      <Section title="Status Program Kampung Iklim">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Status Proklim">
            <select value={form.proklimStatus} onChange={e => set("proklimStatus", e.target.value)} className={inputCls}>
              <option>Aktif</option>
              <option>Penilaian</option>
              <option>Tidak Aktif</option>
            </select>
          </Field>
          <Field label="Tahun Mulai">
            <input value={form.proklimTahun} onChange={e => set("proklimTahun", e.target.value)} className={inputCls} />
          </Field>
        </div>
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mt-2">
          <Leaf className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div className="text-sm text-green-800">
            <span className="font-semibold">Proklim {form.proklimStatus}</span> — Program dimulai sejak tahun {form.proklimTahun}
          </div>
        </div>
      </Section>

      {/* Kontak */}
      <Section title="Kontak">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nomor Telepon">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={form.phone} onChange={e => set("phone", e.target.value)} className={`${inputCls} pl-9`} />
            </div>
          </Field>
          <Field label="Email">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={form.email} onChange={e => set("email", e.target.value)} className={`${inputCls} pl-9`} />
            </div>
          </Field>
        </div>
      </Section>

      {/* Media Sosial */}
      <Section title="Media Sosial">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Facebook">
            <div className="relative">
              <FaFacebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={form.facebook} onChange={e => set("facebook", e.target.value)} placeholder="URL Facebook" className={`${inputCls} pl-9`} />
            </div>
          </Field>
          <Field label="Instagram">
            <div className="relative">
              <FaInstagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={form.instagram} onChange={e => set("instagram", e.target.value)} placeholder="URL Instagram" className={`${inputCls} pl-9`} />
            </div>
          </Field>
          <Field label="YouTube">
            <div className="relative">
              <FaYoutube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={form.youtube} onChange={e => set("youtube", e.target.value)} placeholder="URL YouTube" className={`${inputCls} pl-9`} />
            </div>
          </Field>
        </div>
      </Section>

      {/* Save bottom */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading || saving}
          className={`inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all ${saved ? "bg-green-500" : "bg-green-700 hover:bg-green-600"} disabled:opacity-50`}
        >
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : saved ? <><CheckCircle className="w-4 h-4" /> Tersimpan!</> : <><Save className="w-4 h-4" /> Simpan Semua Perubahan</>}
        </button>
      </div>
    </div>
  );
}
