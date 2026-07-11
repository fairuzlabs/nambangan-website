"use client";

import Link from "next/link";
import { Phone, Tag } from "lucide-react";
import { umkmData } from "@/data/mockData";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { useState } from "react";

export default function UMKM() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  
  const categories = ["Semua", ...Array.from(new Set(umkmData.map(u => u.category)))];
  
  const filteredProducts = selectedCategory === "Semua" 
    ? umkmData 
    : umkmData.filter(u => u.category === selectedCategory);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Katalog Produk UMKM
          </h1>
          <p className="text-gray-600">
            Produk unggulan dari pelaku UMKM lokal RW 18 Nambangan
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
          <div className="flex gap-3">
            <Tag className="w-5 h-5 text-orange-700 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-900 mb-1">
                Pasar UMKM Setiap Sabtu
              </h3>
              <p className="text-sm text-orange-800">
                Kunjungi Pasar UMKM RW 18 setiap hari Sabtu pukul 15.00-18.00 WIB di halaman Balai RW. 
                Dukung produk lokal dan ekonomi kreatif warga!
              </p>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? "bg-orange-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/umkm/${product.id}`}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square relative overflow-hidden">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full mb-3">
                  {product.category}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">
                    {product.price}
                  </span>
                  <div className="text-sm text-gray-500">
                    {product.seller}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Tidak ada produk untuk kategori ini</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Ingin Bergabung Sebagai Seller?</h2>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            Daftarkan produk UMKM Anda di katalog kami dan jangkau lebih banyak pelanggan. 
            Tanpa biaya administrasi!
          </p>
          <a
            href="tel:02931234567"
            className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <Phone className="w-5 h-5" />
            Hubungi Pengurus RW
          </a>
        </div>
      </div>
    </div>
  );
}
