import { Link } from "react-router";
import { Newspaper, Archive, Headphones, Map, TrendingUp, Eye, Users, ArrowUpRight, Clock, Leaf } from "lucide-react";
import { newsData, arsipData, podcastData, proklimData, umkmData, kesenianData } from "../../data/mockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const visitData = [
  { hari: "Sen", kunjungan: 42 },
  { hari: "Sel", kunjungan: 68 },
  { hari: "Rab", kunjungan: 55 },
  { hari: "Kam", kunjungan: 91 },
  { hari: "Jum", kunjungan: 78 },
  { hari: "Sab", kunjungan: 113 },
  { hari: "Min", kunjungan: 96 },
];

const STAT_CARDS = [
  { label: "Total Berita",  value: newsData.length,   icon: Newspaper, color: "bg-green-100 text-green-700", link: "/admin/berita" },
  { label: "Arsip Proklim", value: arsipData.length,  icon: Archive,   color: "bg-red-100 text-red-600",    link: "/admin/arsip" },
  { label: "Episode Podcast",value: podcastData.length,icon: Headphones,color: "bg-amber-100 text-amber-700",link: "/admin/podcast" },
  { label: "Lokasi di Peta", value: proklimData.length + umkmData.length + kesenianData.length, icon: Map, color: "bg-blue-100 text-blue-700", link: "/admin/peta" },
];

const recentNews = newsData.slice(0, 4);

const QUICK_ACTIONS = [
  { to: "/admin/berita",    label: "Tulis Berita Baru",   icon: Newspaper, bg: "bg-green-600 hover:bg-green-700" },
  { to: "/admin/arsip",     label: "Tambah Arsip",        icon: Archive,   bg: "bg-red-500 hover:bg-red-600" },
  { to: "/admin/podcast",   label: "Tambah Episode",      icon: Headphones,bg: "bg-amber-500 hover:bg-amber-600" },
  { to: "/admin/peta",      label: "Tambah Lokasi",       icon: Map,       bg: "bg-gray-700 hover:bg-gray-800" },
];

export default function AdminDashboard() {
  return (
    <div className="p-6 sm:p-8 space-y-8">

      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-serif)" }}>
            Selamat datang, Admin! 👋
          </h1>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-2 rounded-xl">
          <Leaf className="w-3.5 h-3.5" />
          Website RW 18 — Online
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, link }) => (
          <Link
            key={label}
            to={link}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-serif)" }}>{value}</div>
            <div className="text-xs text-gray-500 font-medium">{label}</div>
          </Link>
        ))}
      </div>

      {/* Chart + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Visit chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-900 text-sm" style={{ fontFamily: "var(--font-serif)" }}>Kunjungan Website</h3>
              <p className="text-xs text-gray-400 mt-0.5">7 hari terakhir (estimasi)</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold bg-green-50 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" /> +18%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={visitData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="hari" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #e5ddd0", borderRadius: 10, fontSize: 12 }}
                itemStyle={{ color: "#506535" }}
              />
              <Line type="monotone" dataKey="kunjungan" stroke="#506535" strokeWidth={2.5} dot={{ r: 4, fill: "#506535", strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
            {[
              { icon: Eye,   label: "Total Minggu Ini", value: "543" },
              { icon: Users, label: "Pengunjung Unik",  value: "312" },
              { icon: Clock, label: "Rata-rata / Hari", value: "77" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <Icon className="w-4 h-4 text-gray-300 mx-auto mb-1" />
                <div className="font-bold text-gray-900 text-lg">{value}</div>
                <div className="text-xs text-gray-400">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm mb-5" style={{ fontFamily: "var(--font-serif)" }}>Aksi Cepat</h3>
          <div className="space-y-2.5">
            {QUICK_ACTIONS.map(({ to, label, icon: Icon, bg }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white text-sm font-semibold transition-all ${bg}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent news */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm" style={{ fontFamily: "var(--font-serif)" }}>Berita Terbaru</h3>
          <Link to="/admin/berita" className="text-xs text-green-700 hover:text-green-800 font-semibold flex items-center gap-1">
            Kelola <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentNews.map(news => (
            <div key={news.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{news.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full font-medium">{news.category}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(news.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
              <span className="flex-shrink-0 w-2 h-2 rounded-full bg-green-400" title="Dipublikasikan" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
