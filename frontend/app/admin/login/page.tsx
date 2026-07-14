"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Leaf, Lock, User, AlertCircle } from "lucide-react";
import { adminLogin } from "@/lib/adminAuth";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const ok = await adminLogin(form.username, form.password);
    setLoading(false);
    if (ok) router.push("/admin/dashboard");
    else setError("Username atau password salah.");
  };

  return (
    <div className="min-h-screen flex">

      {/* Left: brand panel */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between relative overflow-hidden bg-green-950 p-12">
        {/* Background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#506535_0%,_#1a2a14_60%,_#0d1a0a_100%)]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-green-400/5 blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-64 h-64 rounded-full bg-red-400/5 blur-3xl" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
            <Leaf className="w-5 h-5 text-green-300" />
          </div>
          <div>
            <div className="text-white font-bold text-sm" style={{ fontFamily: "var(--font-serif)" }}>RW 18 Nambangan</div>
            <div className="text-green-400/70 text-xs">Rejowinangun Utara</div>
          </div>
        </div>

        {/* Center content */}
        <div className="relative">
          <div className="inline-block bg-green-500/20 text-green-300 text-xs font-semibold px-3 py-1 rounded-full mb-6 tracking-wide">
            Panel Administrasi
          </div>
          <h1
            className="text-4xl xl:text-5xl text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--font-serif)", fontWeight: 700 }}
          >
            Kelola Website<br />
            <span className="text-green-300">RW 18</span> dengan<br />
            Mudah
          </h1>
          <p className="text-green-100/60 text-sm leading-relaxed max-w-sm">
            Publikasikan berita, kelola arsip Proklim, perbarui peta lokasi,
            dan pantau konten website dari satu tempat.
          </p>
        </div>

        {/* Feature dots */}
        <div className="relative grid grid-cols-2 gap-3">
          {[
            "Manajemen Berita",
            "Arsip Proklim",
            "Peta Lokasi",
            "Podcast",
          ].map(f => (
            <div key={f} className="flex items-center gap-2 text-xs text-green-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right: login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center">
              <Leaf className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm" style={{ fontFamily: "var(--font-serif)" }}>RW 18 Nambangan</div>
              <div className="text-xs text-gray-400">Panel Admin</div>
            </div>
          </div>

          <h2
            className="text-3xl font-bold text-gray-900 mb-1"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Masuk ke Admin
          </h2>
          <p className="text-gray-500 text-sm mb-8">Gunakan akun yang diberikan oleh pengurus RW.</p>

          {/* Demo hint */}
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6 text-sm text-green-800">
            <span className="font-semibold">Demo:</span> username <code className="bg-green-100 px-1.5 py-0.5 rounded font-mono text-xs">admin</code> · password <code className="bg-green-100 px-1.5 py-0.5 rounded font-mono text-xs">rw18admin</code>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  placeholder="Masukkan username"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-400 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Masukkan password"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-600 disabled:bg-green-400 text-white font-semibold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-green-200/50 hover:shadow-lg"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              {loading ? "Memverifikasi..." : "Masuk"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            Lupa akses? Hubungi pengurus RW 18 Nambangan.
          </p>

          <div className="mt-6 text-center">
            <a href="/" className="text-xs text-green-700 hover:text-green-800 font-medium">
              ← Kembali ke Website Utama
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
