import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const data = {
      ingestion_latency_ms: Math.floor(Math.random() * 20) + 8,
      active_aws_sensors: 2847 + Math.floor(Math.random() * 10),
      posts_per_hour: 14203 + Math.floor(Math.random() * 200),
      ai_accuracy: "98.7%",
    };
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch telemetry" },
      { status: 500 }
    );
  }
}
