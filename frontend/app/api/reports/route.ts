import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data: Record<string, any> = {
      name: formData.get("name"),
      email: formData.get("email"),
      hazardType: formData.get("hazardType"),
      description: formData.get("description"),
      location: formData.get("location"),
      image: formData.get("image") ? "[BINARY_DATA]" : null,
      latitude: formData.get("latitude"),
      longitude: formData.get("longitude"),
      honeypot: formData.get("honeypot"),
    };

    if (data.honeypot) {
      return NextResponse.json({ error: "Spam detected" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      incidentId: `INC-${Date.now()}`,
      message: "Report submitted to AI verification pipeline",
      data: {
        ...data,
        verificationStatus: "pending",
        credibilityScore: 0.5,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit report" },
      { status: 500 }
    );
  }
}
