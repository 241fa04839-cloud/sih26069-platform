"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";

interface Incident {
  id: string;
  title: string;
  hazardType: string;
  verificationStatus: "verified" | "pending" | "fake";
  credibilityScore: number;
  coordinates: { latitude: number; longitude: number };
  location: string;
  description: string;
  source: string;
  timestamp: string;
}

interface NormalMapViewerProps {
  incidents: Incident[];
  onIncidentClick: (incident: Incident) => void;
}

const statusColors: Record<string, string> = {
  verified: "#10B981",
  pending: "#F59E0B",
  fake: "#EF4444",
};

const hazardLabels: Record<string, string> = {
  flooding: "FLOOD",
  heatwave: "HEAT",
  cyclone: "CYC",
  landslide: "LAND",
  drought: "DRY",
  storm: "STRM",
};

export function NormalMapViewer({ incidents, onIncidentClick }: NormalMapViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  // Init map once.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!containerRef.current || mapRef.current) return;
      try {
        const L = await import("leaflet");
        await import("leaflet/dist/leaflet.css");
        if (cancelled || !containerRef.current) return;

        const map = L.map(containerRef.current, {
          center: [22, 80],
          zoom: 5,
          zoomControl: false,
          attributionControl: true,
        });
        L.control.zoom({ position: "topright" }).addTo(map);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        mapRef.current = map;
        leafletRef.current = L;
        if (!cancelled) setStatus("ready");
      } catch (err) {
        console.error("Failed to initialize the normal map view:", err);
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync markers whenever incidents change.
  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L || status !== "ready") return;

    const existingIds = new Set(markersRef.current.keys());
    const newIds = new Set(incidents.map((i) => i.id));

    for (const id of existingIds) {
      if (!newIds.has(id)) {
        const marker = markersRef.current.get(id);
        if (marker) map.removeLayer(marker);
        markersRef.current.delete(id);
      }
    }

    for (const incident of incidents) {
      if (markersRef.current.has(incident.id)) continue;

      const color = statusColors[incident.verificationStatus] || "#F59E0B";
      const icon = L.divIcon({
        className: "",
        html: `<div style="
          width: 16px; height: 16px; border-radius: 9999px;
          background: ${color}; border: 2px solid white;
          box-shadow: 0 0 6px rgba(0,0,0,0.6);
        "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const marker = L.marker(
        [incident.coordinates.latitude, incident.coordinates.longitude],
        { icon }
      ).addTo(map);

      const label = hazardLabels[incident.hazardType] || incident.hazardType.toUpperCase();
      const aiTag =
        incident.verificationStatus === "fake"
          ? `<div style="color:#EF4444; margin-top:4px;">🤖 AI-FLAGGED AS FAKE</div>`
          : "";
      marker.bindPopup(
        `<div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;">
          <strong>${label}</strong> — ${incident.title}<br/>
          <span style="color:#888">${incident.verificationStatus.toUpperCase()} • cred ${incident.credibilityScore.toFixed(2)}</span>
          ${aiTag}
        </div>`
      );

      marker.on("click", () => onIncidentClick(incident));
      markersRef.current.set(incident.id, marker);
    }
  }, [incidents, status, onIncidentClick]);

  return (
    <div className="relative h-full w-full">
      {status === "loading" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-tactical-canvas font-mono text-sm text-tactical-cyan">
          Loading map...
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-tactical-canvas p-6 text-center">
          <p className="font-mono text-sm text-tactical-crimson">MAP FAILED TO LOAD</p>
          <p className="max-w-md font-mono text-[11px] text-gray-500">
            Check your network connection and reload the page.
          </p>
        </div>
      )}
      <div ref={containerRef} className="h-full w-full" />
      <div className="absolute bottom-4 left-4 z-[500] rounded border border-tactical-border bg-tactical-panel/95 p-3">
        <h4 className="mb-2 font-mono text-[10px] uppercase tracking-wider text-tactical-amber">
          INCIDENT LEGEND
        </h4>
        <div className="space-y-1">
          {[
            { color: "#10B981", label: "Verified" },
            { color: "#F59E0B", label: "Pending" },
            { color: "#EF4444", label: "Fake" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-mono text-[10px] text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute top-4 left-4 z-[500] rounded border border-tactical-border bg-tactical-panel/95 px-3 py-2">
        <p className="font-mono text-[10px] text-gray-400">NORMAL MAP • OpenStreetMap</p>
        <p className="font-mono text-[10px] text-gray-600">{incidents.length} incidents loaded</p>
      </div>
    </div>
  );
}
