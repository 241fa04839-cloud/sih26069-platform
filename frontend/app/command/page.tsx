"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { fetchIncidents, fetchTelemetry, type Incident } from "./_lib/api";

const GlobeViewer = dynamic(
  () => import("./_components/globe-viewer").then((m) => m.GlobeViewer),
  { ssr: false, loading: () => <div className="flex h-full items-center justify-center text-tactical-cyan font-mono text-sm">Loading 3D Globe...</div> }
);

const NormalMapViewer = dynamic(
  () => import("./_components/normal-map-viewer").then((m) => m.NormalMapViewer),
  { ssr: false, loading: () => <div className="flex h-full items-center justify-center text-tactical-cyan font-mono text-sm">Loading map...</div> }
);

type MapMode = "normal" | "godseye";

interface TelemetryData {
  ingestion_latency_ms: number;
  active_aws_sensors: number;
  posts_per_hour: number;
  ai_accuracy: string;
}

export default function CommandPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [verificationStatus, setVerificationStatus] = useState("all");
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showVideoOverlay, setShowVideoOverlay] = useState(false);
  // Default to the normal 2D map. God's Eye (3D globe) is opt-in, since it pulls in
  // a much heavier engine (CesiumJS) and is only loaded once the user asks for it.
  const [mapMode, setMapMode] = useState<MapMode>("normal");

  const { data: incidents, isLoading } = useQuery({
    queryKey: ["incidents", activeFilter, selectedEvent, selectedLocation, verificationStatus],
    queryFn: () => fetchIncidents({ filter: activeFilter, event: selectedEvent, location: selectedLocation, status: verificationStatus }),
    refetchInterval: 5000,
  });

  const { data: telemetry } = useQuery({
    queryKey: ["telemetry"],
    queryFn: fetchTelemetry,
    refetchInterval: 3000,
  });

  const handleCCTVClick = useCallback((incident: Incident) => {
    setSelectedIncident(incident);
    setShowVideoOverlay(true);
  }, []);

  const statusColors = {
    verified: "bg-tactical-green/20 text-tactical-green border-tactical-green",
    pending: "bg-tactical-amber/20 text-tactical-amber border-tactical-amber",
    fake: "bg-tactical-crimson/20 text-tactical-crimson border-tactical-crimson",
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-full border-r border-tactical-border bg-tactical-panel lg:w-72">
          <div className="p-4">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-tactical-amber">
              FILTER ENGINE
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-500">Date Range</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded border border-tactical-border bg-tactical-canvas px-2 py-1.5 text-xs font-mono text-white focus:border-tactical-cyan"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-500">Event Type</label>
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="mt-1 w-full rounded border border-tactical-border bg-tactical-canvas px-2 py-1.5 text-xs font-mono text-white focus:border-tactical-cyan"
                >
                  <option value="all">All Events</option>
                  <option value="flooding">Flooding</option>
                  <option value="heatwave">Heatwave</option>
                  <option value="cyclone">Cyclone</option>
                  <option value="landslide">Landslide</option>
                  <option value="drought">Drought</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-500">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="mt-1 w-full rounded border border-tactical-border bg-tactical-canvas px-2 py-1.5 text-xs font-mono text-white focus:border-tactical-cyan"
                >
                  <option value="all">All Locations</option>
                  <option value="kerala">Kerala</option>
                  <option value="maharashtra">Maharashtra</option>
                  <option value="rajasthan">Rajasthan</option>
                  <option value="tamilnadu">Tamil Nadu</option>
                  <option value="up">Uttar Pradesh</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-500">Verification</label>
                <div className="mt-1 space-y-1">
                  {["all", "verified", "pending", "fake"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setVerificationStatus(status)}
                      className={`w-full rounded border px-2 py-1.5 text-left text-xs font-mono capitalize transition-colors ${
                        verificationStatus === status
                          ? status === "all"
                            ? "border-tactical-cyan bg-tactical-cyan/10 text-tactical-cyan"
                            : statusColors[status as keyof typeof statusColors]
                          : "border-tactical-border text-gray-500 hover:border-tactical-amber"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-tactical-border pt-4">
                <h3 className="mb-2 text-[10px] font-mono uppercase text-gray-500">
                  FILTER SUMMARY
                </h3>
                <p className="font-mono text-xs text-gray-400">
                  Active: <span className="text-tactical-cyan">{activeFilter}</span>
                </p>
                <p className="font-mono text-xs text-gray-400">
                  Showing: <span className="text-white">{incidents?.length ?? 0}</span> incidents
                </p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-4 border-b border-tactical-border bg-tactical-panel/50 px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-tactical-green" />
              <span className="font-mono text-[10px] text-tactical-green">
                {mapMode === "godseye" ? "LIVE 3D SATELLITE VIEW" : "LIVE 2D MAP VIEW"}
              </span>
            </div>

            <div className="flex items-center rounded border border-tactical-border overflow-hidden">
              <button
                onClick={() => setMapMode("normal")}
                className={`px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                  mapMode === "normal"
                    ? "bg-tactical-cyan/20 text-tactical-cyan"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Normal Map
              </button>
              <button
                onClick={() => setMapMode("godseye")}
                className={`px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors border-l border-tactical-border ${
                  mapMode === "godseye"
                    ? "bg-tactical-amber/20 text-tactical-amber"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                God&apos;s Eye View
              </button>
            </div>

            {telemetry && (
              <div className="ml-auto flex items-center gap-4 font-mono text-[10px] text-gray-500">
                <span>LATENCY: {telemetry.ingestion_latency_ms}ms</span>
                <span>SENSORS: {telemetry.active_aws_sensors}</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            {mapMode === "godseye" ? (
              <GlobeViewer
                incidents={incidents ?? []}
                onIncidentClick={handleCCTVClick}
                onFallback={() => setMapMode("normal")}
              />
            ) : (
              <NormalMapViewer
                incidents={incidents ?? []}
                onIncidentClick={handleCCTVClick}
              />
            )}
          </div>
        </main>

        <aside className="w-full border-l border-tactical-border bg-tactical-panel lg:w-80">
          <div className="flex items-center justify-between border-b border-tactical-border px-4 py-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-tactical-amber">
              LIVE TRIAGE TICKER
            </h2>
            <span className="font-mono text-[10px] text-tactical-green">
              {incidents?.length ?? 0} ACTIVE
            </span>
          </div>
          <div className="h-[calc(100%-40px)] overflow-y-auto">
            {isLoading ? (
              <div className="flex h-32 items-center justify-center text-tactical-cyan font-mono text-xs">
                Loading reports...
              </div>
            ) : (
              <ul className="divide-y divide-tactical-border" aria-label="Incident ticker">
                {incidents?.map((incident) => (
                  <li
                    key={incident.id}
                    className="cursor-pointer border-l-2 transition-colors hover:bg-tactical-canvas"
                    style={{
                      borderLeftColor:
                        incident.verificationStatus === "verified"
                          ? "#10B981"
                          : incident.verificationStatus === "fake"
                          ? "#EF4444"
                          : "#F59E0B",
                    }}
                    onClick={() => setSelectedIncident(incident)}
                  >
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase font-bold text-tactical-cyan">
                          {incident.hazardType}
                        </span>
                        <span
                          className={`rounded border px-1.5 py-0.5 font-mono text-[9px] ${statusColors[incident.verificationStatus]}`}
                        >
                          {incident.verificationStatus}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-300">{incident.title}</p>
                      {incident.verificationStatus === "fake" && (
                        <p className="mt-1 font-mono text-[9px] text-tactical-crimson">
                          🤖 AI-FLAGGED AS FAKE
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-mono text-[10px] text-gray-500">
                          {incident.coordinates.latitude.toFixed(4)}, {incident.coordinates.longitude.toFixed(4)}
                        </span>
                        <span className="font-mono text-[10px] text-tactical-amber">
                          Cred: {incident.credibilityScore.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>

      {showVideoOverlay && selectedIncident && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80" role="dialog" aria-label="CCTV Feed">
          <button
            onClick={() => setShowVideoOverlay(false)}
            className="absolute right-4 top-4 rounded border border-tactical-border bg-tactical-panel px-3 py-1 text-xs font-mono text-white hover:border-tactical-crimson"
            aria-label="Close video feed"
          >
            ✕ CLOSE
          </button>
          <div className="w-full max-w-4xl">
            <div className="border-2 border-tactical-amber rounded bg-tactical-canvas p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-mono text-sm font-bold text-tactical-amber">
                  CCTV FEED - {selectedIncident.location}
                </h3>
                <span className="font-mono text-[10px] text-tactical-green animate-pulse">
                  ● LIVE
                </span>
              </div>
              <div className="aspect-video rounded border border-tactical-border bg-black flex items-center justify-center">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-tactical-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 font-mono text-xs text-gray-400">
                    Simulated Live HLS/MP4 Feed
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-gray-600">
                    Stream ID: {selectedIncident.id} | Camera: CCTV-{selectedIncident.id.slice(-4)}
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded border border-tactical-border bg-tactical-panel p-2">
                  <p className="font-mono text-[10px] text-gray-500">QUALITY</p>
                  <p className="font-mono text-xs text-tactical-cyan">1080p</p>
                </div>
                <div className="rounded border border-tactical-border bg-tactical-panel p-2">
                  <p className="font-mono text-[10px] text-gray-500">BITRATE</p>
                  <p className="font-mono text-xs text-tactical-green">4.2 Mbps</p>
                </div>
                <div className="rounded border border-tactical-border bg-tactical-panel p-2">
                  <p className="font-mono text-[10px] text-gray-500">LATENCY</p>
                  <p className="font-mono text-xs text-tactical-amber">2.1s</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedIncident && !showVideoOverlay && (
        <div className="fixed bottom-0 right-0 z-[80] m-4 w-full max-w-sm rounded border border-tactical-cyan bg-tactical-panel p-4 shadow-[0_0_40px_rgba(6,182,212,0.1)]" role="dialog" aria-label="Incident details">
          <button
            onClick={() => setSelectedIncident(null)}
            className="mb-2 rounded border border-tactical-border bg-tactical-canvas px-2 py-1 text-[10px] font-mono text-gray-400"
            aria-label="Close incident details"
          >
            ✕
          </button>
          <h3 className="font-mono text-sm font-bold text-white">{selectedIncident.title}</h3>
          <p className="mt-1 text-xs text-gray-400">{selectedIncident.description}</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <span className="text-gray-500">Coordinates:</span>
              <p className="text-tactical-cyan">
                {selectedIncident.coordinates.latitude.toFixed(4)}, {selectedIncident.coordinates.longitude.toFixed(4)}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Credibility:</span>
              <p className="text-tactical-amber">{selectedIncident.credibilityScore.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <p className="text-tactical-green">{selectedIncident.verificationStatus}</p>
            </div>
            <div>
              <span className="text-gray-500">Source:</span>
              <p className="text-gray-300">{selectedIncident.source}</p>
            </div>
          </div>
          {selectedIncident.aiAnalysis && (
            <div
              className={`mt-3 rounded border p-2 ${
                selectedIncident.verificationStatus === "fake"
                  ? "border-tactical-crimson bg-tactical-crimson/10"
                  : "border-tactical-cyan/40 bg-tactical-cyan/5"
              }`}
            >
              <p
                className={`mb-1 font-mono text-[10px] uppercase tracking-wider ${
                  selectedIncident.verificationStatus === "fake" ? "text-tactical-crimson" : "text-tactical-cyan"
                }`}
              >
                🤖 AI Verification Engine
              </p>
              <p className="text-[11px] leading-relaxed text-gray-300">{selectedIncident.aiAnalysis}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
