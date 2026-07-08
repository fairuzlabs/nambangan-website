import { useState, useEffect, useRef } from "react";
import { MapPin, ShoppingBag, Leaf, Music, X, Phone, Clock, Tag, ArrowRight, ChevronDown } from "lucide-react";
import { proklimData, umkmData, kesenianData } from "../data/mockData";
import type { ProklimLocation, UMKMProduct, KesenianLocation } from "../data/mockData";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link } from "react-router";
import "leaflet/dist/leaflet.css";

type FilterType = "semua" | "proklim" | "umkm" | "kesenian";

type SelectedPoint =
  | { type: "proklim"; data: ProklimLocation }
  | { type: "umkm"; data: UMKMProduct }
  | { type: "kesenian"; data: KesenianLocation };

const TYPE_META = {
  proklim: { label: "Proklim", color: "#506535", bg: "bg-green-600", light: "bg-green-100 text-green-800", icon: Leaf },
  umkm: { label: "UMKM", color: "#b86878", bg: "bg-red-500", light: "bg-red-100 text-red-800", icon: ShoppingBag },
  kesenian: { label: "Kesenian", color: "#c8953a", bg: "bg-amber-500", light: "bg-amber-100 text-amber-800", icon: Music },
};

function createDivIcon(type: keyof typeof TYPE_META, selected = false) {
  const color = TYPE_META[type].color;
  const size = selected ? 38 : 30;
  const border = selected ? 4 : 3;
  return {
    className: "",
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${color};
      border:${border}px solid white;
      border-radius:50%;
      box-shadow:0 3px 10px rgba(0,0,0,0.4);
      transition:all .2s;
      display:flex;align-items:center;justify-content:center;
    "></div>`,
    iconSize: [size, size] as [number, number],
    iconAnchor: [size / 2, size] as [number, number],
    popupAnchor: [0, -size] as [number, number],
  };
}

function DetailPanel({ selected, onClose }: { selected: SelectedPoint; onClose: () => void }) {
  if (selected.type === "proklim") {
    const loc = selected.data;
    return (
      <div className="flex flex-col h-full">
        <div className="relative">
          <div className="h-44 overflow-hidden bg-gray-200">
            <ImageWithFallback src={loc.image} alt={loc.name} className="w-full h-full object-cover" />
          </div>
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
            <X className="w-4 h-4 text-gray-700" />
          </button>
          <span className={`absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${TYPE_META.proklim.light}`}>
            Proklim · {loc.category}
          </span>
        </div>
        <div className="p-5 flex-1 overflow-y-auto">
          <h3 className="font-bold text-gray-900 text-lg mb-3" style={{ fontFamily: "var(--font-serif)" }}>{loc.name}</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">{loc.description}</p>
          <h4 className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-green-600" /> Kegiatan
          </h4>
          <ul className="space-y-2">
            {loc.activities.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (selected.type === "umkm") {
    const p = selected.data;
    return (
      <div className="flex flex-col h-full">
        <div className="relative">
          <div className="h-44 overflow-hidden bg-gray-200">
            <ImageWithFallback src={p.image} alt={p.name} className="w-full h-full object-cover" />
          </div>
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
            <X className="w-4 h-4 text-gray-700" />
          </button>
          <span className={`absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${TYPE_META.umkm.light}`}>
            UMKM · {p.category}
          </span>
        </div>
        <div className="p-5 flex-1 overflow-y-auto">
          <h3 className="font-bold text-gray-900 text-lg mb-1" style={{ fontFamily: "var(--font-serif)" }}>{p.name}</h3>
          <div className="text-2xl font-bold text-green-700 mb-3">{p.price}</div>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">{p.description}</p>
          <div className="space-y-3 mb-5">
            <div className="flex items-center gap-3 text-sm">
              <ShoppingBag className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-700">{p.seller}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <a href={`tel:${p.contact}`} className="text-green-700 hover:underline">{p.contact}</a>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href={`https://wa.me/${p.contact.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
            >
              <Phone className="w-4 h-4" /> Hubungi via WhatsApp
            </a>
            <Link
              to={`/umkm/${p.id}`}
              className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Detail Produk <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const loc = selected.data;
  return (
    <div className="flex flex-col h-full">
      <div className="relative">
        <div className="h-44 overflow-hidden bg-gray-200">
          <ImageWithFallback src={loc.image} alt={loc.name} className="w-full h-full object-cover" />
        </div>
        <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
          <X className="w-4 h-4 text-gray-700" />
        </button>
        <span className={`absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${TYPE_META.kesenian.light}`}>
          Kesenian · {loc.category}
        </span>
      </div>
      <div className="p-5 flex-1 overflow-y-auto">
        <h3 className="font-bold text-gray-900 text-lg mb-3" style={{ fontFamily: "var(--font-serif)" }}>{loc.name}</h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">{loc.description}</p>
        {loc.schedule && (
          <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mb-5">
            <Clock className="w-4 h-4 flex-shrink-0" /> {loc.schedule}
          </div>
        )}
        <h4 className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
          <Music className="w-4 h-4 text-amber-600" /> Kegiatan
        </h4>
        <ul className="space-y-2 mb-5">
          {loc.activities.map((a, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
              {a}
            </li>
          ))}
        </ul>
        {loc.contact && (
          <a
            href={`tel:${loc.contact}`}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors"
          >
            <Phone className="w-4 h-4" /> Hubungi
          </a>
        )}
      </div>
    </div>
  );
}

export default function Peta() {
  const [filter, setFilter] = useState<FilterType>("semua");
  const [selected, setSelected] = useState<SelectedPoint | null>(null);
  const [mobileListOpen, setMobileListOpen] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const allPoints: SelectedPoint[] = [
    ...proklimData.map(d => ({ type: "proklim" as const, data: d })),
    ...umkmData.map(d => ({ type: "umkm" as const, data: d })),
    ...kesenianData.map(d => ({ type: "kesenian" as const, data: d })),
  ];

  const filtered = filter === "semua" ? allPoints : allPoints.filter(p => p.type === filter);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;

      const map = L.map(mapRef.current!).setView([-7.479167, 110.217778], 16);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const addMarkers = () => {
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        allPoints.forEach((point) => {
          const lat = (point.data as any).lat;
          const lng = (point.data as any).lng;
          if (!lat || !lng) return;

          const iconOpts = createDivIcon(point.type);
          const marker = L.marker([lat, lng], { icon: L.divIcon(iconOpts) }).addTo(map);
          marker.on("click", () => setSelected(point));
          markersRef.current.push(marker);
        });
      };

      addMarkers();
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const counts = {
    semua: allPoints.length,
    proklim: proklimData.length,
    umkm: umkmData.length,
    kesenian: kesenianData.length,
  };

  const filterButtons: { key: FilterType; icon: typeof Leaf }[] = [
    { key: "semua", icon: MapPin },
    { key: "proklim", icon: Leaf },
    { key: "umkm", icon: ShoppingBag },
    { key: "kesenian", icon: Music },
  ];

  const filterLabel: Record<FilterType, string> = {
    semua: "Semua Lokasi",
    proklim: "Proklim",
    umkm: "UMKM",
    kesenian: "Kesenian",
  };

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 64px)" }}>

      {/* Mobile filter strip */}
      <div className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border-b border-gray-200 overflow-x-auto flex-shrink-0">
        {filterButtons.map(({ key, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
              filter === key
                ? "bg-green-700 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {key === "semua" ? `Semua (${counts.semua})` : `${filterLabel[key]} (${counts[key]})`}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Desktop sidebar */}
        <aside className="hidden md:flex flex-col w-72 flex-shrink-0 bg-white border-r border-gray-200 overflow-hidden">
          {/* Sidebar header */}
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-lg mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              Peta Wilayah RW 18
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {filterButtons.map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    filter === key
                      ? key === "semua"
                        ? "bg-gray-900 text-white"
                        : `${TYPE_META[key as keyof typeof TYPE_META]?.bg ?? "bg-gray-700"} text-white`
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  } ${key === "semua" ? "col-span-2 justify-center" : ""}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {key === "semua" ? `Semua (${counts.semua})` : `${filterLabel[key]} (${counts[key]})`}
                </button>
              ))}
            </div>
          </div>

          {/* Location list */}
          <div className="flex-1 overflow-y-auto">
            {filtered.map((point) => {
              const name = (point.data as any).name;
              const meta = TYPE_META[point.type];
              const Icon = meta.icon;
              const isActive = selected?.data === point.data;
              return (
                <button
                  key={`${point.type}-${point.data.id}`}
                  onClick={() => setSelected(point)}
                  className={`w-full text-left px-4 py-3.5 border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                    isActive ? "bg-green-50 border-l-4 border-l-green-600" : ""
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ background: meta.color }}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {point.type === "umkm" ? (point.data as UMKMProduct).price : (point.data as any).category}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Legenda</p>
            <div className="space-y-1.5">
              {(["proklim", "umkm", "kesenian"] as const).map(t => {
                const meta = TYPE_META[t];
                const Icon = meta.icon;
                return (
                  <div key={t} className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ background: meta.color }} />
                    <Icon className="w-3 h-3 text-gray-400" />
                    {meta.label}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Map + detail panel wrapper */}
        <div className="flex-1 relative flex overflow-hidden">
          {/* Map */}
          <div
            ref={mapRef}
            className="flex-1"
            style={{ minHeight: 0 }}
          />

          {/* Detail panel — slides in from right */}
          <div
            className={`absolute md:relative top-0 right-0 h-full w-full md:w-[360px] bg-white shadow-2xl md:shadow-none border-l border-gray-200 flex-shrink-0 overflow-hidden transition-transform duration-300 z-20 ${
              selected ? "translate-x-0" : "translate-x-full"
            }`}
            style={{ maxWidth: "100%" }}
          >
            {selected && (
              <DetailPanel selected={selected} onClose={() => setSelected(null)} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile: location list toggle */}
      <div className="md:hidden flex-shrink-0 bg-white border-t border-gray-200">
        <button
          onClick={() => setMobileListOpen(!mobileListOpen)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700"
        >
          <span>Daftar Lokasi ({filtered.length})</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${mobileListOpen ? "rotate-180" : ""}`} />
        </button>
        {mobileListOpen && (
          <div className="max-h-56 overflow-y-auto border-t border-gray-100">
            {filtered.map((point) => {
              const name = (point.data as any).name;
              const meta = TYPE_META[point.type];
              const Icon = meta.icon;
              return (
                <button
                  key={`m-${point.type}-${point.data.id}`}
                  onClick={() => { setSelected(point); setMobileListOpen(false); }}
                  className="w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 flex items-center gap-3"
                >
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: meta.color }}>
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{name}</div>
                    <div className="text-xs text-gray-500">
                      {point.type === "umkm" ? (point.data as UMKMProduct).price : (point.data as any).category}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile detail panel overlay */}
      {selected && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/40">
          <div className="bg-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <div className="flex-1 overflow-y-auto">
              <DetailPanel selected={selected} onClose={() => setSelected(null)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
