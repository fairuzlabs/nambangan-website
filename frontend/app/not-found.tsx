"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl font-bold text-green-600 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-gray-600 mb-8">
          Maaf, halaman yang Anda cari tidak dapat ditemukan. 
          Silakan kembali ke halaman utama.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            Kembali ke Beranda
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Halaman Sebelumnya
          </button>
        </div>
      </div>
    </div>
  );
}
