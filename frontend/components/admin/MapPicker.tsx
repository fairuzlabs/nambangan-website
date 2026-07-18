"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

interface MapPickerProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

export default function MapPicker({ lat, lng, onChange }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [LInstance, setLInstance] = useState<any>(null);

  // Load Leaflet dynamically on client-side
  useEffect(() => {
    let active = true;
    import("leaflet").then((L) => {
      if (!active) return;
      setLInstance(L);
    });
    return () => {
      active = false;
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!LInstance || !mapRef.current || mapInstanceRef.current) return;

    // Delete default icon prototype URLs to prevent mapping issues in Next.js
    // @ts-ignore
    delete LInstance.Icon.Default.prototype._getIconUrl;

    const initialLat = typeof lat === "number" && !isNaN(lat) ? lat : -7.48333288952336;
    const initialLng = typeof lng === "number" && !isNaN(lng) ? lng : 110.23033883249016;

    const map = LInstance.map(mapRef.current).setView([initialLat, initialLng], 18);
    mapInstanceRef.current = map;

    LInstance.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Create DivIcon matching the website styles
    const divIconOpts = {
      className: "",
      html: `<div style="
        width: 24px; height: 24px;
        background: #166534;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      "></div>`,
      iconSize: [24, 24] as [number, number],
      iconAnchor: [12, 12] as [number, number],
    };

    const marker = LInstance.marker([initialLat, initialLng], {
      icon: LInstance.divIcon(divIconOpts),
      draggable: true,
    }).addTo(map);
    markerRef.current = marker;

    // Handle marker drag
    marker.on("dragend", (e: any) => {
      const position = marker.getLatLng();
      onChange(position.lat, position.lng);
    });

    // Handle map click
    map.on("click", (e: any) => {
      const { lat: clickLat, lng: clickLng } = e.latlng;
      marker.setLatLng([clickLat, clickLng]);
      onChange(clickLat, clickLng);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markerRef.current = null;
    };
  }, [LInstance]);

  // Sync marker position when props change from manual input
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current || !LInstance) return;

    const validLat = typeof lat === "number" && !isNaN(lat) && lat >= -90 && lat <= 90;
    const validLng = typeof lng === "number" && !isNaN(lng) && lng >= -180 && lng <= 180;

    if (validLat && validLng) {
      const markerLatLng = markerRef.current.getLatLng();
      if (markerLatLng.lat !== lat || markerLatLng.lng !== lng) {
        markerRef.current.setLatLng([lat, lng]);
        // Pan the map to the new coordinate to keep it visible
        mapInstanceRef.current.panTo([lat, lng]);
      }
    }
  }, [lat, lng, LInstance]);

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-gray-600">Klik/Geser Titik di Peta</label>
      <div
        ref={mapRef}
        className="w-full h-48 rounded-xl border border-gray-200 z-10"
        style={{ minHeight: "192px" }}
      />
    </div>
  );
}
