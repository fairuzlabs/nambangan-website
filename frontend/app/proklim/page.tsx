"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Info } from "lucide-react";
import { api, type ProklimLocation } from "@/lib/api";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import "leaflet/dist/leaflet.css";

export default function Proklim() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [locations, setLocations] = useState<ProklimLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const pts = await api.getMapPoints();
        const filtered = pts.filter((p: any) => p.locType === "proklim") as ProklimLocation[];
        setLocations(filtered);
      } catch (err) {
        console.error("Gagal memuat data proklim:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = Array.from(new Set(locations.map(p => p.category)));

  // Initialize Map Once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    let active = true;

    import("leaflet").then((L) => {
      if (!active) return;
      if (mapInstanceRef.current || (mapRef.current as any)?._leaflet_id) return;

      // Fix default icon
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!).setView([-7.479167, 110.217778], 16);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
    });

    return () => {
      active = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync markers when locations change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || locations.length === 0) return;

    import("leaflet").then((L) => {
      locations.forEach((location) => {
        const marker = L.marker([location.lat, location.lng]).addTo(map);
        marker.bindPopup(`
          <div style="min-width:180px">
            <strong style="display:block;margin-bottom:4px">${location.name}</strong>
            <span style="color:#555;font-size:13px">${location.category}</span>
          </div>
        `);
        marker.on("click", () => {
          setSelectedLocation(location.id);
        });
      });
    });
  }, [locations]);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Pemetaan Program Kampung Iklim
          </h1>
          <p className="text-gray-600">
            Lokasi dan informasi kegiatan lingkungan Program Kampung Iklim (Proklim) RW 18
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900 mb-1">
                Tentang Program Kampung Iklim
              </h3>
              <p className="text-sm text-green-800">
                Program Kampung Iklim (Proklim) adalah program adaptasi dan mitigasi perubahan iklim
                berbasis masyarakat. RW 18 berkomitmen untuk menjaga lingkungan melalui berbagai
                kegiatan seperti pengelolaan sampah, konservasi air, dan pertanian urban.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div ref={mapRef} className="h-[500px] w-full" />
            </div>

            {/* Legend */}
            <div className="bg-white rounded-xl p-6 shadow-sm mt-4">
              <h3 className="font-bold text-gray-900 mb-4">Kategori Lokasi</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((category) => {
                  const count = locations.filter(p => p.category === category).length;
                  return (
                    <div key={category} className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full" />
                      <span className="text-sm text-gray-700">
                        {category} <span className="text-gray-500">({count})</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Location Details Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Detail Lokasi</h3>

              {selectedLocation ? (
                (() => {
                  const location = locations.find(p => p.id === selectedLocation);
                  if (!location) return null;
                  return (
                    <div>
                      <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
                        <ImageWithFallback
                          src={location.image}
                          alt={location.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">{location.name}</h4>
                      <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full mb-3">
                        {location.category}
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{location.description}</p>
                      <h5 className="font-semibold text-gray-900 mb-2">Kegiatan:</h5>
                      <ul className="space-y-2">
                        {location.activities.map((activity, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0" />
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    Klik pada marker di peta untuk melihat detail lokasi
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Location Cards */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Semua Lokasi Proklim</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location) => (
              <div
                key={location.id}
                onClick={() => setSelectedLocation(location.id)}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="aspect-video relative overflow-hidden">
                  <ImageWithFallback
                    src={location.image}
                    alt={location.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full mb-3">
                    {location.category}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{location.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {location.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    {location.activities.length} kegiatan
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
