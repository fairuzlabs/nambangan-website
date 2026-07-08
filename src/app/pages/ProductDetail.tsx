import { useParams, Link } from "react-router";
import { ArrowLeft, Phone, MapPin, Tag, ShoppingBag } from "lucide-react";
import { umkmData } from "../data/mockData";
import { ImageWithFallback } from "../components/ui/ImageWithFallback";

export default function ProductDetail() {
  const { id } = useParams();
  const product = umkmData.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Produk tidak ditemukan</h2>
          <Link to="/peta" className="text-orange-600 hover:text-orange-700">
            Kembali ke katalog UMKM
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = umkmData
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/peta"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Katalog
        </Link>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="aspect-square relative overflow-hidden">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full mb-4">
              {product.category}
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <div className="text-3xl font-bold text-green-600 mb-6">
              {product.price}
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Deskripsi Produk</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6 space-y-4">
              <h3 className="font-semibold text-gray-900 mb-3">Informasi Penjual</h3>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Penjual</div>
                  <div className="font-medium text-gray-900">{product.seller}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Kontak</div>
                  <a 
                    href={`tel:${product.contact}`}
                    className="font-medium text-green-600 hover:text-green-700"
                  >
                    {product.contact}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Lokasi</div>
                  <div className="font-medium text-gray-900">RW 18 Nambangan</div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <a
                href={`https://wa.me/${product.contact.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Hubungi Penjual via WhatsApp
              </a>
              <p className="text-sm text-gray-500 text-center mt-3">
                Atau kunjungi Pasar UMKM setiap Sabtu pukul 15.00-18.00 WIB
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Produk Sejenis</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/umkm/${relatedProduct.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <ImageWithFallback
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full mb-2">
                      {relatedProduct.category}
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-green-600">
                        {relatedProduct.price}
                      </span>
                      <span className="text-xs text-gray-500">
                        {relatedProduct.seller}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
