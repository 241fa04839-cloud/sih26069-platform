import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    stations: [
      { id: "AWS-001", name: "Kottayam AWS", lat: 9.5894, lng: 76.5174, temp: 28.5, humidity: 78, pressure: 1012 },
      { id: "AWS-002", name: "Mumbai AWS", lat: 19.076, lng: 72.8777, temp: 33.2, humidity: 65, pressure: 1008 },
      { id: "AWS-003", name: "Chennai AWS", lat: 10.85, lng: 80.27, temp: 31.0, humidity: 72, pressure: 1010 },
    ]
  });
}
