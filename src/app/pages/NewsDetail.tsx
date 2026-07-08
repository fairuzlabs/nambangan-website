import { useParams, Link } from "react-router";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import { newsData } from "../data/mockData";
import { ImageWithFallback } from "../components/ui/ImageWithFallback";

export default function NewsDetail() {
  const { id } = useParams();
  const news = newsData.find((n) => n.id === id);

  if (!news) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Berita tidak ditemukan</h2>
          <Link to="/news" className="text-green-600 hover:text-green-700">
            Kembali ke halaman berita
          </Link>
        </div>
      </div>
    );
  }

  const relatedNews = newsData
    .filter((n) => n.id !== news.id && n.category === news.category)
    .slice(0, 3);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Berita
        </Link>

        {/* Article */}
        <article className="bg-white rounded-xl overflow-hidden shadow-sm">
          {/* Featured Image */}
          <div className="aspect-video relative overflow-hidden">
            <ImageWithFallback
              src={news.image}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 sm:p-8">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                {news.category}
              </span>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                {new Date(news.date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <User className="w-4 h-4" />
                {news.author}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {news.title}
            </h1>

            {/* Content */}
            <div className="prose max-w-none">
              {news.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Berita Terkait</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map((relatedItem) => (
                <Link
                  key={relatedItem.id}
                  to={`/news/${relatedItem.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <ImageWithFallback
                      src={relatedItem.image}
                      alt={relatedItem.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full mb-2">
                      {relatedItem.category}
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">
                      {relatedItem.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(relatedItem.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short'
                      })}
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
