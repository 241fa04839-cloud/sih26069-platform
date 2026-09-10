"use client";

import { useEffect, useRef, useState } from "react";
import type { Viewer as CesiumViewer } from "cesium";

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

interface GlobeViewerProps {
  incidents: Incident[];
  onIncidentClick: (incident: Incident) => void;
  onFallback?: () => void;
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

export function GlobeViewer({ incidents, onIncidentClick, onFallback }: GlobeViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<CesiumViewer | null>(null);
  const entitiesRef = useRef<Map<string, any>>(new Map());
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!containerRef.current || viewerRef.current) return;

      try {
        // Loaded dynamically (not at module scope) so the ~2.5MB Cesium bundle is
        // only ever fetched when someone actually opens the God's Eye view.
        const Cesium = await import("cesium");
        await import("cesium/Build/Cesium/Widgets/widgets.css");

        if (cancelled || !containerRef.current) return;

        const ionToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;
        let terrainProvider: any = new Cesium.EllipsoidTerrainProvider();
        let imageryProvider: any = new Cesium.OpenStreetMapImageryProvider({
          url: "https://tile.openstreetmap.org/",
        });

        if (ionToken) {
          // If an ion token is configured, upgrade to real-world terrain + imagery.
          Cesium.Ion.defaultAccessToken = ionToken;
          try {
            terrainProvider = await Cesium.createWorldTerrainAsync();
            imageryProvider = await Cesium.createWorldImageryAsync();
          } catch (ionErr) {
            console.warn("Cesium ion assets unavailable, falling back to OSM imagery.", ionErr);
          }
        }

        if (cancelled || !containerRef.current) return;

        const viewer = new Cesium.Viewer(containerRef.current, {
          terrainProvider,
          baseLayer: Cesium.ImageryLayer.fromProviderAsync(Promise.resolve(imageryProvider), {}),
          shouldAnimate: true,
          fullscreenButton: false,
          geocoder: false,
          homeButton: false,
          infoBox: false,
          selectionIndicator: false,
          timeline: false,
          animation: false,
          baseLayerPicker: false,
          navigationHelpButton: false,
          sceneMode: Cesium.SceneMode.SCENE3D,
          orderIndependentTranslucency: false,
        });

        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(80, 22, 2000000),
          orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-20),
            roll: 0,
          },
        });

        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction((movement: any) => {
          const picked = viewer.scene.pick(movement.position);
          if (picked && (picked as any).id && (picked as any).id._incident) {
            onIncidentClick((picked as any).id._incident);
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        viewerRef.current = viewer;
        (viewer as any)._clickHandler = handler;
        (viewer as any)._CesiumModule = Cesium;

        if (!cancelled) setStatus("ready");
      } catch (err) {
        console.error("Failed to initialize the 3D globe (God's Eye view):", err);
        if (!cancelled) {
          setErrorMessage(err instanceof Error ? err.message : "Unknown error");
          setStatus("error");
        }
      }
    })();

    return () => {
      cancelled = true;
      const viewer = viewerRef.current as any;
      if (viewer) {
        if (viewer._clickHandler) viewer._clickHandler.destroy();
        if (!viewer.isDestroyed()) viewer.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current as any;
    if (!viewer || status !== "ready") return;
    const Cesium = viewer._CesiumModule;
    if (!Cesium) return;

    const existingIds = new Set(entitiesRef.current.keys());
    const newIncidentIds = new Set(incidents.map((i) => i.id));

    for (const id of existingIds) {
      if (!newIncidentIds.has(id)) {
        const entity = entitiesRef.current.get(id);
        if (entity) viewer.entities.remove(entity);
        entitiesRef.current.delete(id);
      }
    }

    for (const incident of incidents) {
      if (entitiesRef.current.has(incident.id)) continue;

      const color = statusColors[incident.verificationStatus] || "#F59E0B";
      const position = Cesium.Cartesian3.fromDegrees(
        incident.coordinates.longitude,
        incident.coordinates.latitude
      );

      const entity = viewer.entities.add({
        position,
        point: {
          pixelSize: 12 + incident.credibilityScore * 8,
          color: Cesium.Color.fromCssColorString(color),
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        label: {
          text:
            (hazardLabels[incident.hazardType] || incident.hazardType.toUpperCase()) +
            (incident.verificationStatus === "fake" ? " ⚠ AI-FAKE" : ""),
          font: "10px 'JetBrains Mono', monospace",
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, 16),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      });

      (entity as any)._incident = incident;
      entitiesRef.current.set(incident.id, entity);
    }
  }, [incidents, status]);

  if (status === "error") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-tactical-canvas p-6 text-center">
        <p className="font-mono text-sm text-tactical-crimson">
          GOD&apos;S EYE VIEW FAILED TO LOAD
        </p>
        <p className="max-w-md font-mono text-[11px] text-gray-500">
          {errorMessage || "The 3D globe engine could not initialize."} You can keep working on the
          normal 2D map instead.
        </p>
        {onFallback && (
          <button
            onClick={onFallback}
            className="rounded border border-tactical-cyan px-3 py-1.5 font-mono text-[11px] text-tactical-cyan hover:bg-tactical-cyan/10"
          >
            SWITCH TO NORMAL MAP
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {status === "loading" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-tactical-canvas font-mono text-sm text-tactical-cyan">
          Loading 3D Globe...
        </div>
      )}
      <div ref={containerRef} className="h-full w-full" />
      <div className="absolute bottom-4 left-4 z-10 rounded border border-tactical-border bg-tactical-panel/95 p-3">
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
      <div className="absolute top-4 left-4 z-10 rounded border border-tactical-border bg-tactical-panel/95 px-3 py-2">
        <p className="font-mono text-[10px] text-gray-400">
          GOD&apos;S EYE VIEW • CesiumJS 3D Globe
        </p>
        <p className="font-mono text-[10px] text-gray-600">
          {incidents.length} incidents loaded
        </p>
      </div>
    </div>
  );
}
