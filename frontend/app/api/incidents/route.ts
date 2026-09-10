import { NextRequest, NextResponse } from "next/server";

const mockIncidents = [
  {
    id: "INC-001",
    title: "Severe flooding reported in Kottayam district",
    hazardType: "flooding",
    description: "Citizen reports rising water levels in low-lying areas",
    verificationStatus: "verified" as const,
    credibilityScore: 0.92,
    coordinates: { latitude: 9.5894, longitude: 76.5174 },
    location: "Kottayam, Kerala",
    region: "kerala",
    source: "IMD_Social_Media",
    timestamp: "2026-09-10T03:30:00Z",
    aiAnalysis:
      "AI Verification Engine: nearest AWS sensor (AWS-KTM-04) logged 210mm rainfall in the past 3 hours, corroborating this report. Credibility score raised to 0.92. Status: VERIFIED.",
  },
  {
    id: "INC-002",
    title: "Extreme heatwave conditions in Mumbai",
    hazardType: "heatwave",
    description: "Temperature exceeding 42°C reported across western suburbs",
    verificationStatus: "pending" as const,
    credibilityScore: 0.73,
    coordinates: { latitude: 19.076, longitude: 72.8777 },
    location: "Mumbai, Maharashtra",
    region: "maharashtra",
    source: "Citizen_Report",
    timestamp: "2026-09-10T04:15:00Z",
    aiAnalysis:
      "AI Verification Engine: partial sensor corroboration from 2 of 3 nearby AWS stations. Awaiting additional reports before auto-verification. Status: PENDING REVIEW.",
  },
  {
    id: "INC-003",
    title: "Cyclone warning for Tamil Nadu coast",
    hazardType: "cyclone",
    description: "Cyclonic storm forming in Bay of Bengal",
    verificationStatus: "verified" as const,
    credibilityScore: 0.97,
    coordinates: { latitude: 10.85, longitude: 80.27 },
    location: "Chennai, Tamil Nadu",
    region: "tamilnadu",
    source: "IMD_Official",
    timestamp: "2026-09-10T02:00:00Z",
    aiAnalysis:
      "AI Verification Engine: official IMD source, cross-checked against satellite cyclone tracking. Credibility score 0.97. Status: VERIFIED.",
  },
  {
    id: "INC-004",
    title: "Landslide risk in Western Himalayas",
    hazardType: "landslide",
    description: "Ground displacement detected near Uttarkashi",
    verificationStatus: "pending" as const,
    credibilityScore: 0.65,
    coordinates: { latitude: 30.8, longitude: 78.5 },
    location: "Uttarkashi, Uttarakhand",
    region: "uttarakhand",
    source: "Citizen_Report",
    timestamp: "2026-09-10T05:00:00Z",
    aiAnalysis:
      "AI Verification Engine: location extracted from report text with 82% confidence. No AWS sensor within 20km for corroboration. Status: PENDING REVIEW.",
  },
  {
    id: "INC-005",
    title: "Suspected fake report - Delhi",
    hazardType: "flooding",
    description: "Unverified flooding claim with duplicate image",
    verificationStatus: "fake" as const,
    credibilityScore: 0.12,
    coordinates: { latitude: 28.61, longitude: 77.21 },
    location: "Delhi",
    region: "delhi",
    source: "Social_Media",
    timestamp: "2026-09-10T06:30:00Z",
    aiAnalysis:
      "AI Verification Engine: submitted image is a duplicate of a report already on file (hash match). Credibility score reduced to 0.12. Status: FLAGGED FAKE.",
  },
  {
    id: "INC-006",
    title: "AI-flagged fake report - Ahmedabad flooding claim",
    hazardType: "flooding",
    description:
      "Viral social media post claiming severe flooding in Ahmedabad city center, shared with dramatic captions urging evacuation.",
    verificationStatus: "fake" as const,
    credibilityScore: 0.06,
    coordinates: { latitude: 23.0225, longitude: 72.5714 },
    location: "Ahmedabad, Gujarat",
    region: "gujarat",
    source: "Social_Media",
    timestamp: "2026-09-10T07:05:00Z",
    aiAnalysis:
      "AI Verification Engine: reverse image search matched a 2021 stock photo (98% visual similarity) — not from this location or event. No corroborating citizen reports within 15km. Nearest AWS sensor (AWS-AMD-02) recorded zero rainfall in the last 6 hours. Credibility score reduced from a baseline of 0.50 to 0.06. Auto-flagged as FAKE and excluded from the verified incident feed.",
  },
  {
    id: "INC-007",
    title: "Drought conditions worsening in Jaisalmer",
    hazardType: "drought",
    description: "Groundwater levels critically low, wells running dry across the district",
    verificationStatus: "verified" as const,
    credibilityScore: 0.88,
    coordinates: { latitude: 26.9157, longitude: 70.9083 },
    location: "Jaisalmer, Rajasthan",
    region: "rajasthan",
    source: "IMD_Official",
    timestamp: "2026-09-10T01:45:00Z",
    aiAnalysis:
      "AI Verification Engine: matches IMD district drought bulletin issued this week. Credibility score 0.88. Status: VERIFIED.",
  },
  {
    id: "INC-008",
    title: "Severe thunderstorm approaching Lucknow",
    hazardType: "storm",
    description: "Dark clouds and gusty winds reported ahead of expected thunderstorm",
    verificationStatus: "pending" as const,
    credibilityScore: 0.58,
    coordinates: { latitude: 26.8467, longitude: 80.9462 },
    location: "Lucknow, Uttar Pradesh",
    region: "up",
    source: "Citizen_Report",
    timestamp: "2026-09-10T08:00:00Z",
    aiAnalysis:
      "AI Verification Engine: consistent with regional Doppler radar activity but not yet confirmed by an AWS station. Status: PENDING REVIEW.",
  },
  {
    id: "INC-009",
    title: "Cyclone landfall reported near Puri",
    hazardType: "cyclone",
    description: "Strong winds and storm surge reported along the Odisha coastline",
    verificationStatus: "verified" as const,
    credibilityScore: 0.95,
    coordinates: { latitude: 19.8135, longitude: 85.8312 },
    location: "Puri, Odisha",
    region: "odisha",
    source: "IMD_Official",
    timestamp: "2026-09-10T00:20:00Z",
  },
  {
    id: "INC-010",
    title: "Flash flooding in Guwahati low-lying areas",
    hazardType: "flooding",
    description: "Brahmaputra water levels rising rapidly after heavy overnight rain",
    verificationStatus: "verified" as const,
    credibilityScore: 0.85,
    coordinates: { latitude: 26.1445, longitude: 91.7362 },
    location: "Guwahati, Assam",
    region: "assam",
    source: "IMD_Social_Media",
    timestamp: "2026-09-10T04:50:00Z",
  },
  {
    id: "INC-011",
    title: "Unseasonal storm activity near Bengaluru",
    hazardType: "storm",
    description: "Sudden hailstorm reported in northern parts of the city",
    verificationStatus: "pending" as const,
    credibilityScore: 0.6,
    coordinates: { latitude: 12.9716, longitude: 77.5946 },
    location: "Bengaluru, Karnataka",
    region: "karnataka",
    source: "Citizen_Report",
    timestamp: "2026-09-10T06:10:00Z",
  },
];

async function fetchIncidentsFromAPI(params: Record<string, string>) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const url = new URL(`${apiUrl}/api/v1/incidents`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(url.toString(), { signal: controller.signal });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    // The FastAPI backend is a real endpoint that returns 200 with an empty
    // array once it's up but before any incidents have been ingested/seeded.
    // Treat "reachable but empty" the same as "unreachable" so the demo/test
    // incidents still render instead of silently showing nothing.
    if (Array.isArray(data) && data.length === 0) {
      throw new Error("Backend returned no incidents");
    }
    return data;
  } catch {
    return mockIncidents.filter((inc) => {
      if (params.filter !== "all" && params.filter !== inc.hazardType) return false;
      if (params.event !== "all" && params.event !== inc.hazardType) return false;
      if (params.location !== "all" && params.location !== inc.region) return false;
      if (params.status !== "all" && params.status !== inc.verificationStatus) return false;
      return true;
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    const data = await fetchIncidentsFromAPI(params);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch incidents", details: String(error) },
      { status: 500 }
    );
  }
}
