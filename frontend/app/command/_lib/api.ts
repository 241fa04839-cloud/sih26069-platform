export interface Incident {
  id: string;
  title: string;
  hazardType: string;
  description: string;
  verificationStatus: "verified" | "pending" | "fake";
  credibilityScore: number;
  coordinates: { latitude: number; longitude: number };
  location: string;
  region?: string;
  source: string;
  timestamp: string;
  /** Human-readable explanation of what the AI verification engine found for this report. */
  aiAnalysis?: string;
}

export interface TelemetryData {
  ingestion_latency_ms: number;
  active_aws_sensors: number;
  posts_per_hour: number;
  ai_accuracy: string;
}

export interface IncidentFilter {
  filter: string;
  event: string;
  location: string;
  status: string;
}

export async function fetchIncidents(filter: IncidentFilter): Promise<Incident[]> {
  const params = new URLSearchParams();
  params.set("filter", filter.filter);
  params.set("event", filter.event);
  params.set("location", filter.location);
  params.set("status", filter.status);

  const res = await fetch(`/api/incidents?${params}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch incidents");
  return res.json();
}

export async function fetchTelemetry(): Promise<TelemetryData> {
  const res = await fetch("/api/telemetry", {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch telemetry");
  return res.json();
}
